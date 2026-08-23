import type { NextApiRequest, NextApiResponse } from 'next';
import { hashRecoveryToken, normalizeRecoveryOrderCode } from '@/lib/commerce/recovery';
import { consumeRecoveryTokenHash, rotateOrderClaim } from '@/lib/commerce/store';
import { serializeOrderClaimCookie } from '@/lib/commerce/order-claim-cookie';

const orderCodePattern = /^JH-\d{8}-[A-F0-9]{8}$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  try {
    const rawToken = String(req.body?.token || '');
    const expectedOrderCode = normalizeRecoveryOrderCode(String(req.body?.orderCode || ''));
    if (rawToken.length < 32 || rawToken.length > 256 || !orderCodePattern.test(expectedOrderCode)) {
      return res.status(404).json({ error: 'recovery_not_found' });
    }

    const grant = await consumeRecoveryTokenHash(hashRecoveryToken(rawToken));
    if (!grant || grant.order_code !== expectedOrderCode) {
      return res.status(404).json({ error: 'recovery_not_found' });
    }

    const rotated = await rotateOrderClaim(grant.order_id);
    if (rotated.orderCode !== expectedOrderCode) {
      return res.status(409).json({ error: 'recovery_order_mismatch' });
    }

    res.setHeader('Set-Cookie', serializeOrderClaimCookie(rotated.orderCode, rotated.claimToken));
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ orderCode: rotated.orderCode, recovered: true });
  } catch (error) {
    console.error('[commerce/recovery/claim]', error);
    return res.status(500).json({ error: 'recovery_failed' });
  }
}
