import crypto from 'node:crypto';
import { commerceRecoveryConfig, commerceRuntimeContext } from './config';

export function normalizeRecoveryEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeRecoveryOrderCode(value: string) {
  return value.trim().toUpperCase();
}

export function hashRecoveryToken(rawToken: string) {
  const config = commerceRecoveryConfig();
  return crypto.createHmac('sha256', config.tokenSecret).update(rawToken).digest('hex');
}

export function recoveryRequestFingerprint(input: {
  orderCode: string;
  email: string;
  clientAddress: string;
}) {
  const config = commerceRecoveryConfig();
  const material = [
    normalizeRecoveryOrderCode(input.orderCode),
    normalizeRecoveryEmail(input.email),
    input.clientAddress.trim(),
  ].join('|');
  return crypto.createHmac('sha256', config.tokenSecret).update(material).digest('hex');
}

export function createRecoveryChallenge() {
  const config = commerceRecoveryConfig();
  const rawToken = crypto.randomBytes(32).toString('base64url');
  const tokenHash = hashRecoveryToken(rawToken);
  const expiresAt = new Date(Date.now() + config.ttlMinutes * 60 * 1000).toISOString();
  return { rawToken, tokenHash, expiresAt };
}

export async function deliverRecoveryEmail(input: {
  deliveryId: string;
  buyerEmail: string;
  orderCode: string;
  rawToken: string;
  expiresAt: string;
}) {
  const config = commerceRecoveryConfig();
  const runtime = commerceRuntimeContext();
  if (!config.emailConfigured) return { delivered: false as const, reason: 'not_configured' as const };

  const recoveryUrl = `${runtime.siteUrl}/recuperar-compra?order=${encodeURIComponent(input.orderCode)}&token=${encodeURIComponent(input.rawToken)}`;
  const response = await fetch(config.emailWebhookUrl, {
    method: 'POST',
    signal: AbortSignal.timeout(10_000),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.emailWebhookSecret}`,
      'X-JoinHook-Delivery-Id': input.deliveryId,
      'X-JoinHook-Event': 'commerce.purchase_recovery',
    },
    body: JSON.stringify({
      event: 'commerce.purchase_recovery',
      deliveryId: input.deliveryId,
      to: input.buyerEmail,
      subject: 'Recupera tu compra en JoinHook',
      template: 'commerce_purchase_recovery_v1',
      variables: {
        orderCode: input.orderCode,
        recoveryUrl,
        expiresAt: input.expiresAt,
      },
    }),
  });

  if (!response.ok) {
    return { delivered: false as const, reason: 'provider_rejected' as const, status: response.status };
  }
  return { delivered: true as const };
}
