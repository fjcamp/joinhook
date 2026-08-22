import type { NextApiRequest, NextApiResponse } from 'next';
import { commerceConfig } from '@/lib/commerce/config';
import { fulfillMercadoPagoOrder } from '@/lib/commerce/fulfillment';
import { recordPaymentEvent } from '@/lib/commerce/store';
import { validateMercadoPagoWebhookSignature } from '@/lib/commerce/webhook-signature';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const { mercadopago } = commerceConfig();
  const dataId = req.query['data.id'] ?? (req.body?.data?.id ? String(req.body.data.id) : undefined);
  const valid = validateMercadoPagoWebhookSignature({
    xSignature: req.headers['x-signature'],
    xRequestId: req.headers['x-request-id'],
    dataId,
    secret: mercadopago.webhookSecret,
  });
  if (!valid) return res.status(401).json({ error: 'invalid_signature' });

  const providerOrderId = Array.isArray(dataId) ? dataId[0] : dataId;
  const eventId = req.body?.id != null ? String(req.body.id) : null;
  const eventType = String(req.body?.action || req.body?.type || 'mercadopago.webhook');

  try {
    await recordPaymentEvent({
      providerOrderId: providerOrderId || null,
      eventType,
      providerEventId: eventId,
      payload: req.body ?? {},
    });

    if (providerOrderId) {
      await fulfillMercadoPagoOrder(providerOrderId);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('[commerce/webhook/mercadopago]', error);
    // 500 makes the provider retry transient failures. Duplicate events are safe by design.
    return res.status(500).json({ error: 'webhook_processing_failed' });
  }
}
