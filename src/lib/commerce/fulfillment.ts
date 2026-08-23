import { recordCommerceDomainEvent } from './event-log';
import { getCommerceProduct } from './catalog';
import { classifyMercadoPagoOrder, getMercadoPagoOrder } from './mercadopago';
import {
  createEntitlement,
  findOrderByProviderOrderId,
  markOrderPaid,
  markOrderPostSaleState,
  recordPaymentEvent,
  revokeEntitlementByOrder,
} from './store';

const LOCAL_ACCESS_HOLD_STATES = new Set(['review', 'refunded', 'partially_refunded', 'charged_back']);

function postSaleDomainEventType(disposition: string) {
  if (disposition === 'refunded' || disposition === 'partially_refunded') return 'commerce.refund.completed' as const;
  if (disposition === 'charged_back') return 'commerce.chargeback.received' as const;
  return 'commerce.delivery.revoked' as const;
}

export async function fulfillMercadoPagoOrder(providerOrderId: string) {
  const localOrder = await findOrderByProviderOrderId(providerOrderId);
  if (!localOrder) throw new Error('Unknown Mercado Pago order');

  const product = getCommerceProduct(localOrder.product_code);
  if (!product || !product.active) throw new Error('Unknown or inactive product');

  const remoteOrder = await getMercadoPagoOrder(providerOrderId);
  const remoteAmount = Number(remoteOrder.total_amount ?? NaN);
  if (remoteOrder.external_reference !== localOrder.order_code) throw new Error('External reference mismatch');
  if (!Number.isFinite(remoteAmount) || remoteAmount !== localOrder.amount || remoteAmount !== product.amount) throw new Error('Amount mismatch');

  const disposition = classifyMercadoPagoOrder(remoteOrder);
  const providerPaymentId = remoteOrder.transactions?.payments?.[0]?.id ?? null;

  if (disposition === 'pending') {
    return { status: 'pending' as const, localOrder, remoteOrder };
  }

  if (disposition !== 'paid') {
    await markOrderPostSaleState(localOrder.id, disposition);
    await revokeEntitlementByOrder(localOrder.id);
    await recordPaymentEvent({
      orderId: localOrder.id,
      providerOrderId,
      eventType: `reconciliation.${disposition}`,
      payload: {
        provider_status: remoteOrder.status ?? null,
        provider_status_detail: remoteOrder.status_detail ?? null,
      },
    });
    await recordCommerceDomainEvent({
      type: postSaleDomainEventType(disposition),
      dedupeKey: `${postSaleDomainEventType(disposition)}:${localOrder.id}:${disposition}`,
      correlationId: localOrder.order_code,
      subjectId: localOrder.id,
      data: {
        productCode: localOrder.product_code,
        state: disposition,
        provider: 'mercadopago',
      },
    }).catch((eventError) => console.error('[commerce/fulfillment] post-sale domain event failed', eventError));
    return {
      status: disposition,
      orderCode: localOrder.order_code,
      product,
    };
  }

  // A local dispute/refund/fraud hold is intentionally sticky. A later generic
  // Order webhook must never restore delivery automatically. Manual review is
  // required to clear these states even if the provider read momentarily says
  // processed/accredited.
  if (LOCAL_ACCESS_HOLD_STATES.has(localOrder.status)) {
    await recordPaymentEvent({
      orderId: localOrder.id,
      providerOrderId,
      eventType: 'fulfillment.blocked_local_hold',
      payload: {
        local_status: localOrder.status,
        provider_status: remoteOrder.status ?? null,
        provider_status_detail: remoteOrder.status_detail ?? null,
      },
    });
    return {
      status: localOrder.status,
      orderCode: localOrder.order_code,
      product,
    };
  }

  if (localOrder.status !== 'paid') {
    await markOrderPaid({ orderId: localOrder.id, providerPaymentId });
  }

  await recordCommerceDomainEvent({
    type: 'commerce.order.paid',
    dedupeKey: `commerce.order.paid:${localOrder.id}`,
    correlationId: localOrder.order_code,
    subjectId: localOrder.id,
    data: {
      productCode: localOrder.product_code,
      amount: localOrder.amount,
      currency: localOrder.currency,
      provider: 'mercadopago',
    },
  }).catch((eventError) => console.error('[commerce/fulfillment] paid domain event failed', eventError));

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
      status: 'review' as const,
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

  await recordCommerceDomainEvent({
    type: 'commerce.entitlement.granted',
    dedupeKey: `commerce.entitlement.granted:${entitlement.id}`,
    correlationId: localOrder.order_code,
    subjectId: localOrder.id,
    data: {
      productCode: localOrder.product_code,
      entitlementId: entitlement.id,
    },
  }).catch((eventError) => console.error('[commerce/fulfillment] entitlement domain event failed', eventError));

  return {
    status: 'paid' as const,
    orderCode: localOrder.order_code,
    buyerEmail: localOrder.buyer_email,
    product,
    entitlement,
  };
}
