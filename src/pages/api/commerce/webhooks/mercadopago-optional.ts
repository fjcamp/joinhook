import type { NextApiRequest, NextApiResponse } from 'next';
import { commerceMercadoPagoConfig } from '@/lib/commerce/config';
import {
  findOrderByProviderPaymentId,
  markOrderPostSaleState,
  recordPaymentEvent,
  revokeEntitlementByOrder,
} from '@/lib/commerce/store';
import { validateMercadoPagoWebhookSignature } from '@/lib/commerce/webhook-signature';

const FRAUD_TOPICS = new Set(['stop_delivery_op_wh', 'delivery_cancellation']);
const CLAIM_TOPICS = new Set(['topic_claims_integration_wh', 'claim', 'claims']);
const CHARGEBACK_TOPICS = new Set(['topic_chargebacks_wh', 'chargeback', 'chargebacks']);

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const mercadopago = commerceMercadoPagoConfig();
  const queryDataId = firstString(req.query['data.id']);
  const bodyDataId = req.body?.data?.id != null ? String(req.body.data.id) : undefined;
  const dataId = queryDataId || bodyDataId;
  const topic = String(firstString(req.query.type) || req.body?.type || '').toLowerCase();

  const valid = validateMercadoPagoWebhookSignature({
    xSignature: req.headers['x-signature'],
    xRequestId: req.headers['x-request-id'],
    dataId,
    secret: mercadopago.webhookSecret,
  });
  if (!valid) return res.status(401).json({ error: 'invalid_signature' });

  const recognized = FRAUD_TOPICS.has(topic) || CLAIM_TOPICS.has(topic) || CHARGEBACK_TOPICS.has(topic);
  if (!recognized) return res.status(202).json({ received: true, ignored: true });

  const eventId = req.body?.id != null ? String(req.body.id) : dataId || null;
  const paymentId = req.body?.data?.payment_id != null ? String(req.body.data.payment_id) : null;

  try {
    // Fraud notifications can contain payment_id directly. Claims/chargebacks
    // may not; in those cases preserve a minimal unmatched audit record and rely
    // on the primary Orders webhook/reconciliation until those resource APIs are
    // integrated. Never reinterpret claim/chargeback resource IDs as Order IDs.
    const order = paymentId ? await findOrderByProviderPaymentId(paymentId) : null;

    if (order) {
      const holdState = CHARGEBACK_TOPICS.has(topic) ? 'charged_back' : 'review';
      await markOrderPostSaleState(order.id, holdState);
      await revokeEntitlementByOrder(order.id);
      await recordPaymentEvent({
        orderId: order.id,
        providerOrderId: order.provider_order_id,
        providerEventId: eventId,
        eventType: `mercadopago.optional.${topic}`,
        payload: {
          payment_id: paymentId,
          action: req.body?.action ?? null,
          live_mode: req.body?.live_mode ?? null,
          date_created: req.body?.date_created ?? null,
          access_revoked: true,
        },
      });
    } else {
      await recordPaymentEvent({
        providerEventId: eventId,
        eventType: `mercadopago.optional.${topic}`,
        payload: {
          resource_id: dataId ?? null,
          payment_id: paymentId,
          action: req.body?.action ?? null,
          live_mode: req.body?.live_mode ?? null,
          date_created: req.body?.date_created ?? null,
          matched_order: false,
        },
      });
    }

    // Mercado Pago requires a fast acknowledgement. Fraud-alert notifications in
    // particular should not wait for unrelated delivery/recovery configuration.
    return res.status(200).json({ received: true, held: Boolean(order) });
  } catch (error) {
    console.error('[commerce/webhook/mercadopago-optional]', error);
    return res.status(500).json({ error: 'optional_webhook_processing_failed' });
  }
}
