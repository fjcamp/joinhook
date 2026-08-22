import type { NextApiRequest, NextApiResponse } from 'next';
import { fulfillMercadoPagoOrder } from '@/lib/commerce/fulfillment';
import { getCommerceProduct } from '@/lib/commerce/catalog';
import { readOrderClaimCookie } from '@/lib/commerce/order-claim-cookie';
import { createDownloadToken, createEntitlement, findOrderByCode, validateOrderClaim } from '@/lib/commerce/store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  try {
    const orderCode = String(req.body?.orderCode || '');
    if (!orderCode) return res.status(400).json({ error: 'missing_order_code' });
    const claimToken = readOrderClaimCookie(req.headers.cookie, orderCode);
    if (!claimToken) return res.status(404).json({ error: 'order_not_found' });

    let order = await findOrderByCode(orderCode);
    if (!order || !validateOrderClaim(order, claimToken)) return res.status(404).json({ error: 'order_not_found' });

    if (order.status === 'pending' && order.provider_order_id) {
      await fulfillMercadoPagoOrder(order.provider_order_id);
      order = await findOrderByCode(orderCode);
      if (!order) return res.status(404).json({ error: 'order_not_found' });
    }

    const product = getCommerceProduct(order.product_code);
    if (!product) return res.status(409).json({ error: 'product_not_available' });

    if (order.status !== 'paid') {
      const verificationRequired = order.status === 'pending' && Boolean(order.idempotency_key) && !order.provider_order_id;
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({
        orderCode: order.order_code,
        status: verificationRequired ? 'verification_pending' : order.status,
        verificationRequired,
        product: { code: product.code, name: product.name },
      });
    }

    const entitlement = await createEntitlement(order.id, order.product_code, order.buyer_email);
    if (!entitlement?.id) throw new Error('Entitlement missing');
    if (entitlement.status !== 'active') {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({
        orderCode: order.order_code,
        status: 'access_revoked',
        buyerEmail: order.buyer_email,
        product: { code: product.code, name: product.name },
      });
    }

    const download = await createDownloadToken({ entitlementId: entitlement.id });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      orderCode: order.order_code,
      status: 'paid',
      buyerEmail: order.buyer_email,
      product: { code: product.code, name: product.name },
      access: {
        downloadUrl: `/api/commerce/download?token=${encodeURIComponent(download.rawToken)}`,
        expiresAt: download.expiresAt,
      },
    });
  } catch (error) {
    console.error('[commerce/order-status]', error);
    return res.status(500).json({ error: 'order_status_failed' });
  }
}
