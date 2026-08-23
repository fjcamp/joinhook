import type { NextApiRequest, NextApiResponse } from 'next';
import { commerceRecoveryConfig } from '@/lib/commerce/config';
import {
  createRecoveryChallenge,
  deliverRecoveryEmail,
  normalizeRecoveryEmail,
  normalizeRecoveryOrderCode,
  recoveryRequestFingerprint,
} from '@/lib/commerce/recovery';
import {
  countRecentRecoveryRequests,
  createRecoveryToken,
  findOrderByCode,
  recordRecoveryRequest,
  revokeRecoveryToken,
} from '@/lib/commerce/store';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const orderCodePattern = /^JH-\d{8}-[A-F0-9]{8}$/;

function clientAddress(req: NextApiRequest) {
  const forwarded = req.headers['x-forwarded-for'];
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return (first || req.socket.remoteAddress || 'unknown').trim().slice(0, 128);
}

function genericResponse(res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(202).json({
    accepted: true,
    message: 'Si los datos coinciden con una compra elegible, enviaremos instrucciones al correo registrado.',
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  try {
    const config = commerceRecoveryConfig();
    const orderCode = normalizeRecoveryOrderCode(String(req.body?.orderCode || ''));
    const email = normalizeRecoveryEmail(String(req.body?.email || ''));

    // Keep the same external response for malformed and non-matching inputs to
    // avoid turning recovery into an order/email enumeration endpoint.
    if (!orderCodePattern.test(orderCode) || !emailPattern.test(email)) {
      return genericResponse(res);
    }

    const requestKeyHash = recoveryRequestFingerprint({
      orderCode,
      email,
      clientAddress: clientAddress(req),
    });
    const recentRequests = await countRecentRecoveryRequests(requestKeyHash);
    if (recentRequests >= config.maxRequestsPer15Minutes) {
      return genericResponse(res);
    }

    const order = await findOrderByCode(orderCode);
    const matched = Boolean(order && normalizeRecoveryEmail(order.buyer_email) === email);
    if (!order || !matched) {
      await recordRecoveryRequest({
        requestKeyHash,
        matched: false,
        deliveryStatus: 'not_attempted',
      });
      return genericResponse(res);
    }

    const challenge = createRecoveryChallenge();
    const tokenId = await createRecoveryToken({
      orderId: order.id,
      tokenHash: challenge.tokenHash,
      expiresAt: challenge.expiresAt,
    });

    let delivered = false;
    try {
      const result = await deliverRecoveryEmail({
        deliveryId: tokenId,
        buyerEmail: order.buyer_email,
        orderCode: order.order_code,
        rawToken: challenge.rawToken,
        expiresAt: challenge.expiresAt,
      });
      delivered = result.delivered;
    } catch (error) {
      console.error('[commerce/recovery/request] delivery failed', error);
    }

    if (!delivered) {
      await revokeRecoveryToken(tokenId).catch((error) => console.error('[commerce/recovery/request] revoke failed token failed', error));
    }

    await recordRecoveryRequest({
      requestKeyHash,
      orderId: order.id,
      matched: true,
      deliveryStatus: delivered ? 'delivered' : 'failed',
    });

    return genericResponse(res);
  } catch (error) {
    console.error('[commerce/recovery/request]', error);
    // Recovery should fail closed. The generic 503 does not reveal whether the
    // supplied order/email exists.
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ error: 'recovery_temporarily_unavailable' });
  }
}
