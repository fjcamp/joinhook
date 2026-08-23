import type { NextApiRequest, NextApiResponse } from 'next';
import { commerceMercadoPagoConfig } from '@/lib/commerce/config';
import { fulfillMercadoPagoOrder } from '@/lib/commerce/fulfillment';
import { recordPaymentEvent } from '@/lib/commerce/store';
import { validateMercadoPagoWebhookSignature } from '@/lib/commerce/webhook-signature';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const mercadopago = commerceMercadoPagoConfig();
  const dataId = req.query['data.id'] ?? (req.body?.data?.id ? String(req.body.data.id) : undefined);
  const valid = validateMercadoPagoWebhookSignature({
    xSignature: req.headers['x-signature'],
    xRequestId: req.headers['x-request-id'],
    dataId,
    secret: mercadopago.webhookSecret,
  });
  if (!valid) return res.status(401).json({ error: 'invalid_signature' });

  const providerOrderId = Array.isArray(dataId) ? dataId[0] : dataId;
  const topic = String(req.body?.type || req.query.type || '').toLowerCase();
  const eventId = req.body?.id != null ? String(req.body.id) : null;
  const eventType = String(req.body?.action || req.body?.type || 'mercadopago.webhook');

  // This endpoint is deliberately scoped to the primary Orders topic. Optional
  // claims/chargebacks/fraud topics use dedicated handlers so their resource IDs
  // can never be confused with an order ID.
  if (topic && topic !== 'order') {
    return res.status(202).json({ received: true, ignored: true });
  }
  if (!providerOrderId) return res.status(400).json({ error: 'missing_order_id' });

  try {
    // Store only fields required for audit/idempotency. Do not persist the
    // complete provider body by default; Commerce can always re-fetch the order.
    await recordPaymentEvent({
      providerOrderId,
      eventType,
      providerEventId: eventId,
      payload: {
        type: req.body?.type ?? null,
        action: req.body?.action ?? null,
        api_version: req.body?.api_version ?? null,
        live_mode: req.body?.live_mode ?? null,
        date_created: req.body?.date_created ?? null,
      },
    });

    await fulfillMercadoPagoOrder(providerOrderId);
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[commerce/webhook/mercadopago]', error);
    // 500 makes the provider retry transient failures. Duplicate events are safe by design.
    return res.status(500).json({ error: 'webhook_processing_failed' });
  }
}
