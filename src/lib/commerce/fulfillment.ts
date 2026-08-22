import { getCommerceProduct } from './catalog';
import { getMercadoPagoOrder, isMercadoPagoOrderApproved } from './mercadopago';
import {
  createEntitlement,
  findOrderByProviderOrderId,
  markOrderPaid,
  recordPaymentEvent,
} from './store';

export async function fulfillMercadoPagoOrder(providerOrderId: string) {
  const localOrder = await findOrderByProviderOrderId(providerOrderId);
  if (!localOrder) throw new Error('Unknown Mercado Pago order');

  const product = getCommerceProduct(localOrder.product_code);
  if (!product || !product.active) throw new Error('Unknown or inactive product');

  const remoteOrder = await getMercadoPagoOrder(providerOrderId);
  const remoteAmount = Number(remoteOrder.total_amount ?? NaN);
  if (remoteOrder.external_reference !== localOrder.order_code) throw new Error('External reference mismatch');
  if (!Number.isFinite(remoteAmount) || remoteAmount !== localOrder.amount || remoteAmount !== product.amount) throw new Error('Amount mismatch');
  if (!isMercadoPagoOrderApproved(remoteOrder)) return { status: 'pending' as const, localOrder, remoteOrder };

  const providerPaymentId = remoteOrder.transactions?.payments?.[0]?.id ?? null;
  if (localOrder.status === 'pending') {
    await markOrderPaid({ orderId: localOrder.id, providerPaymentId });
  }

  const entitlement = await createEntitlement(localOrder.id, localOrder.product_code, localOrder.buyer_email);
  if (!entitlement?.id) throw new Error('Entitlement could not be created');
  if (entitlement.status !== 'active') {
    await recordPaymentEvent({
      orderId: localOrder.id,
      providerOrderId,
      eventType: 'fulfillment.blocked_revoked',
      payload: { product_code: localOrder.product_code, entitlement_id: entitlement.id },
    });
    return {
      status: 'access_revoked' as const,
      orderCode: localOrder.order_code,
      buyerEmail: localOrder.buyer_email,
      product,
      entitlement,
    };
  }

  await recordPaymentEvent({
    orderId: localOrder.id,
    providerOrderId,
    eventType: 'fulfillment.entitlement_granted',
    payload: { product_code: localOrder.product_code, entitlement_id: entitlement.id },
  });

  return {
    status: 'paid' as const,
    orderCode: localOrder.order_code,
    buyerEmail: localOrder.buyer_email,
    product,
    entitlement,
  };
}
