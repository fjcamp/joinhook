import type { NextApiRequest, NextApiResponse } from 'next';
import { commerceMercadoPagoConfig } from '@/lib/commerce/config';
import {
  extractChargebackPaymentIds,
  getMercadoPagoChargeback,
  getMercadoPagoClaim,
} from '@/lib/commerce/mercadopago';
import {
  findOrderByProviderPaymentId,
  markOrderPostSaleState,
  recordPaymentEvent,
  revokeEntitlementByOrder,
  type CommerceOrderRecord,
} from '@/lib/commerce/store';
import { validateMercadoPagoWebhookSignature } from '@/lib/commerce/webhook-signature';

const FRAUD_TOPICS = new Set(['stop_delivery_op_wh', 'delivery_cancellation']);
const CLAIM_TOPICS = new Set(['topic_claims_integration_wh', 'claim', 'claims']);
const CHARGEBACK_TOPICS = new Set(['topic_chargebacks_wh', 'chargeback', 'chargebacks']);
const TERMINAL_REVOKED_STATES = new Set(['refunded', 'partially_refunded', 'charged_back']);

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function firstOrderForPaymentIds(paymentIds: string[]) {
  for (const paymentId of paymentIds) {
    const order = await findOrderByProviderPaymentId(paymentId);
    if (order) return { order, paymentId };
  }
  return { order: null, paymentId: paymentIds[0] || null };
}

async function resolvePostSaleResource(topic: string, dataId: string | undefined, bodyPaymentId: string | null) {
  if (bodyPaymentId) {
    return { paymentIds: [bodyPaymentId], resource: null as Record<string, unknown> | null };
  }
  if (!dataId) return { paymentIds: [] as string[], resource: null as Record<string, unknown> | null };

  if (CLAIM_TOPICS.has(topic)) {
    const claim = await getMercadoPagoClaim(dataId);
    const resourceType = String(claim.resource || '').toLowerCase();
    const paymentIds = resourceType === 'payment' && claim.resource_id != null
      ? [String(claim.resource_id)]
      : [];
    return {
      paymentIds,
      resource: {
        kind: 'claim',
        id: String(claim.id),
        status: claim.status ?? null,
        stage: claim.stage ?? null,
        type: claim.type ?? null,
        resource: claim.resource ?? null,
        reason_id: claim.reason_id ?? null,
      },
    };
  }

  if (CHARGEBACK_TOPICS.has(topic)) {
    const chargeback = await getMercadoPagoChargeback(dataId);
    return {
      paymentIds: extractChargebackPaymentIds(chargeback),
      resource: {
        kind: 'chargeback',
        id: String(chargeback.id),
        status: chargeback.status ?? null,
        amount: chargeback.amount ?? null,
        currency: chargeback.currency ?? null,
      },
    };
  }

  return { paymentIds: [] as string[], resource: null as Record<string, unknown> | null };
}

async function applyStickyHold(order: CommerceOrderRecord, topic: string) {
  const chargeback = CHARGEBACK_TOPICS.has(topic);
  if (chargeback) {
    if (order.status !== 'refunded') await markOrderPostSaleState(order.id, 'charged_back');
  } else if (!TERMINAL_REVOKED_STATES.has(order.status)) {
    await markOrderPostSaleState(order.id, 'review');
  }
  await revokeEntitlementByOrder(order.id);
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
  const bodyPaymentId = req.body?.data?.payment_id != null ? String(req.body.data.payment_id) : null;

  try {
    // Claims and chargebacks use their own resource IDs. Re-fetch the official
    // resource first and correlate only through a payment ID it explicitly
    // references; never reinterpret a claim/chargeback ID as an Order ID.
    const resolved = await resolvePostSaleResource(topic, dataId, bodyPaymentId);
    const { order, paymentId } = await firstOrderForPaymentIds(resolved.paymentIds);

    if (order) {
      await applyStickyHold(order, topic);
      await recordPaymentEvent({
        orderId: order.id,
        providerOrderId: order.provider_order_id,
        providerEventId: eventId,
        eventType: `mercadopago.optional.${topic}`,
        payload: {
          payment_id: paymentId,
          resource: resolved.resource,
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
          payment_ids: resolved.paymentIds,
          resource: resolved.resource,
          action: req.body?.action ?? null,
          live_mode: req.body?.live_mode ?? null,
          date_created: req.body?.date_created ?? null,
          matched_order: false,
        },
      });
    }

    return res.status(200).json({ received: true, held: Boolean(order) });
  } catch (error) {
    console.error('[commerce/webhook/mercadopago-optional]', error);
    return res.status(500).json({ error: 'optional_webhook_processing_failed' });
  }
}
