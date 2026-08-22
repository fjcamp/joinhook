import type { NextApiRequest, NextApiResponse } from 'next';
import { getCommerceProduct } from '@/lib/commerce/catalog';
import { commerceAcceptsPayments } from '@/lib/commerce/config';
import {
  createMercadoPagoCardOrder,
  isDefiniteMercadoPagoRejection,
  newIdempotencyKey,
  type MercadoPagoApiError,
} from '@/lib/commerce/mercadopago';
import { serializeOrderClaimCookie } from '@/lib/commerce/order-claim-cookie';
import {
  attachProviderOrder,
  createPendingOrder,
  markOrderFailed,
  recordPaymentEvent,
} from '@/lib/commerce/store';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function providerStatus(error: unknown) {
  return (error as MercadoPagoApiError | null)?.status ?? null;
}

function setPurchaseClaimCookie(res: NextApiResponse, orderCode: string, claimToken: string) {
  res.setHeader('Set-Cookie', serializeOrderClaimCookie(orderCode, claimToken));
  res.setHeader('Cache-Control', 'no-store');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  if (!commerceAcceptsPayments()) {
    return res.status(503).json({ error: 'commerce_payments_disabled' });
  }

  const {
    productCode,
    email,
    cardToken,
    paymentMethodId,
    paymentMethodType,
    installments,
    identificationType,
    identificationNumber,
  } = req.body ?? {};
  const product = getCommerceProduct(String(productCode || ''));
  if (!product || !product.active) return res.status(400).json({ error: 'invalid_product' });
  if (!emailPattern.test(String(email || ''))) return res.status(400).json({ error: 'invalid_email' });
  if (!cardToken || !paymentMethodId || !paymentMethodType) return res.status(400).json({ error: 'missing_payment_token' });
  const installmentCount = Number(installments || 1);
  if (!Number.isInteger(installmentCount) || installmentCount < 1 || installmentCount > 24) return res.status(400).json({ error: 'invalid_installments' });

  const idempotencyKey = newIdempotencyKey();
  let localOrder: Awaited<ReturnType<typeof createPendingOrder>> | null = null;

  try {
    localOrder = await createPendingOrder({
      productCode: product.code,
      buyerEmail: String(email),
      amount: product.amount,
      currency: product.currency,
      idempotencyKey,
    });

    try {
      const { order } = await createMercadoPagoCardOrder({
        externalReference: localOrder.order.order_code,
        amount: product.amount,
        payerEmail: String(email),
        identificationType: identificationType ? String(identificationType) : undefined,
        identificationNumber: identificationNumber ? String(identificationNumber) : undefined,
        paymentMethodId: String(paymentMethodId),
        paymentMethodType: String(paymentMethodType),
        cardToken: String(cardToken),
        installments: installmentCount,
        idempotencyKey,
      });

      await attachProviderOrder(localOrder.order.id, order.id);
      await recordPaymentEvent({
        orderId: localOrder.order.id,
        providerOrderId: order.id,
        eventType: 'mercadopago.order.created',
        payload: { status: order.status ?? null, status_detail: order.status_detail ?? null },
      });

      setPurchaseClaimCookie(res, localOrder.order.order_code, localOrder.claimToken);
      return res.status(201).json({
        orderCode: localOrder.order.order_code,
        providerOrderId: order.id,
        status: order.status ?? 'created',
        statusDetail: order.status_detail ?? null,
      });
    } catch (error) {
      const status = providerStatus(error);
      const definite = isDefiniteMercadoPagoRejection(error);

      await recordPaymentEvent({
        orderId: localOrder.order.id,
        eventType: definite ? 'mercadopago.order.creation_rejected' : 'mercadopago.order.creation_uncertain',
        payload: { http_status: status, classification: definite ? 'definite_rejection' : 'ambiguous_or_transient' },
      }).catch((auditError) => console.error('[commerce/create-order] payment audit failed', auditError));

      if (definite) {
        await markOrderFailed(localOrder.order.id).catch((storeError) => console.error('[commerce/create-order] mark failed error', storeError));
        return res.status(422).json({ error: 'payment_not_created' });
      }

      // A network/timeout/5xx path can be ambiguous: Mercado Pago may have
      // accepted the order even when JoinHook did not receive the response.
      // Preserve the claim in an HttpOnly cookie and direct the customer to a
      // safe verification state instead of encouraging a second payment.
      setPurchaseClaimCookie(res, localOrder.order.order_code, localOrder.claimToken);
      return res.status(202).json({
        orderCode: localOrder.order.order_code,
        status: 'verification_pending',
        recoveryRequired: true,
      });
    }
  } catch (error) {
    console.error('[commerce/create-order]', error);
    return res.status(500).json({ error: 'commerce_order_failed' });
  }
}
