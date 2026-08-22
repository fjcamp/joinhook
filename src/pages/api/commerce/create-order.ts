import type { NextApiRequest, NextApiResponse } from 'next';
import { getCommerceProduct } from '@/lib/commerce/catalog';
import { createMercadoPagoCardOrder } from '@/lib/commerce/mercadopago';
import { attachProviderOrder, createPendingOrder, recordPaymentEvent } from '@/lib/commerce/store';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  try {
    const { productCode, email, cardToken, paymentMethodId, paymentMethodType, installments } = req.body ?? {};
    const product = getCommerceProduct(String(productCode || ''));
    if (!product || !product.active) return res.status(400).json({ error: 'invalid_product' });
    if (!emailPattern.test(String(email || ''))) return res.status(400).json({ error: 'invalid_email' });
    if (!cardToken || !paymentMethodId || !paymentMethodType) return res.status(400).json({ error: 'missing_payment_token' });
    const installmentCount = Number(installments || 1);
    if (!Number.isInteger(installmentCount) || installmentCount < 1 || installmentCount > 24) return res.status(400).json({ error: 'invalid_installments' });

    const localOrder = await createPendingOrder({
      productCode: product.code,
      buyerEmail: String(email),
      amount: product.amount,
      currency: product.currency,
    });

    const { order, idempotencyKey } = await createMercadoPagoCardOrder({
      externalReference: localOrder.order_code,
      amount: product.amount,
      payerEmail: String(email),
      paymentMethodId: String(paymentMethodId),
      paymentMethodType: String(paymentMethodType),
      cardToken: String(cardToken),
      installments: installmentCount,
    });

    await attachProviderOrder(localOrder.id, order.id, idempotencyKey);
    await recordPaymentEvent({
      orderId: localOrder.id,
      providerOrderId: order.id,
      eventType: 'mercadopago.order.created',
      payload: { status: order.status, status_detail: order.status_detail },
    });

    return res.status(201).json({
      orderCode: localOrder.order_code,
      providerOrderId: order.id,
      status: order.status ?? 'created',
      statusDetail: order.status_detail ?? null,
    });
  } catch (error) {
    console.error('[commerce/create-order]', error);
    return res.status(502).json({ error: 'payment_provider_error' });
  }
}
