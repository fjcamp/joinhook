import crypto from 'node:crypto';
import { commerceConfig } from './config';

function restHeaders(prefer?: string) {
  const { store } = commerceConfig();
  return {
    apikey: store.serviceRoleKey,
    Authorization: `Bearer ${store.serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

async function rest<T>(path: string, init: RequestInit = {}) {
  const { store } = commerceConfig();
  const response = await fetch(`${store.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: { ...restHeaders(), ...(init.headers || {}) },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Commerce store error ${response.status}: ${JSON.stringify(payload)}`);
  return payload as T;
}

export type CommerceOrderRecord = {
  id: string;
  order_code: string;
  product_code: string;
  buyer_email: string;
  amount: number;
  currency: 'CLP';
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  provider: 'mercadopago';
  provider_order_id: string | null;
  provider_payment_id: string | null;
  idempotency_key: string | null;
  created_at: string;
  paid_at: string | null;
};

export function createJoinHookOrderCode() {
  const date = new Date();
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  const suffix = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `JH-${y}${m}${d}-${suffix}`;
}

export async function createPendingOrder(input: {
  productCode: string;
  buyerEmail: string;
  amount: number;
  currency: 'CLP';
}) {
  const row = {
    order_code: createJoinHookOrderCode(),
    product_code: input.productCode,
    buyer_email: input.buyerEmail.toLowerCase(),
    amount: input.amount,
    currency: input.currency,
    status: 'pending',
    provider: 'mercadopago',
  };
  const response = await rest<CommerceOrderRecord[]>('commerce_orders', {
    method: 'POST',
    headers: restHeaders('return=representation'),
    body: JSON.stringify(row),
  });
  if (!response[0]) throw new Error('Commerce order was not persisted');
  return response[0];
}

export async function attachProviderOrder(orderId: string, providerOrderId: string, idempotencyKey: string) {
  await rest(`commerce_orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: restHeaders('return=minimal'),
    body: JSON.stringify({ provider_order_id: providerOrderId, idempotency_key: idempotencyKey }),
  });
}

export async function findOrderByCode(orderCode: string) {
  const rows = await rest<CommerceOrderRecord[]>(`commerce_orders?order_code=eq.${encodeURIComponent(orderCode)}&limit=1`);
  return rows[0] ?? null;
}

export async function findOrderByProviderOrderId(providerOrderId: string) {
  const rows = await rest<CommerceOrderRecord[]>(`commerce_orders?provider_order_id=eq.${encodeURIComponent(providerOrderId)}&limit=1`);
  return rows[0] ?? null;
}

export async function markOrderPaid(input: { orderId: string; providerPaymentId?: string | null }) {
  await rest(`commerce_orders?id=eq.${encodeURIComponent(input.orderId)}`, {
    method: 'PATCH',
    headers: restHeaders('return=minimal'),
    body: JSON.stringify({
      status: 'paid',
      provider_payment_id: input.providerPaymentId || null,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  });
}

export async function recordPaymentEvent(input: {
  orderId?: string | null;
  providerOrderId?: string | null;
  eventType: string;
  providerEventId?: string | null;
  payload: unknown;
}) {
  await rest('commerce_payment_events', {
    method: 'POST',
    headers: restHeaders('return=minimal,resolution=ignore-duplicates'),
    body: JSON.stringify({
      order_id: input.orderId || null,
      provider_order_id: input.providerOrderId || null,
      event_type: input.eventType,
      provider_event_id: input.providerEventId || null,
      payload: input.payload,
    }),
  });
}

export async function createEntitlement(orderId: string, productCode: string, buyerEmail: string) {
  const rows = await rest<Array<{ id: string }>>('commerce_entitlements?on_conflict=order_id', {
    method: 'POST',
    headers: restHeaders('return=representation,resolution=merge-duplicates'),
    body: JSON.stringify({ order_id: orderId, product_code: productCode, buyer_email: buyerEmail.toLowerCase(), status: 'active' }),
  });
  return rows[0] ?? null;
}

export async function createDownloadToken(input: { entitlementId: string }) {
  const { delivery } = commerceConfig();
  const rawToken = crypto.randomBytes(32).toString('base64url');
  const tokenHash = crypto.createHmac('sha256', delivery.tokenSecret).update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + delivery.defaultTtlHours * 60 * 60 * 1000).toISOString();
  const rows = await rest<Array<{ id: string }>>('commerce_download_tokens', {
    method: 'POST',
    headers: restHeaders('return=representation'),
    body: JSON.stringify({
      entitlement_id: input.entitlementId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      max_uses: delivery.defaultMaxDownloads,
    }),
  });
  return { rawToken, tokenId: rows[0]?.id ?? null, expiresAt };
}

export async function consumeDownloadToken(rawToken: string) {
  const { delivery, store } = commerceConfig();
  const tokenHash = crypto.createHmac('sha256', delivery.tokenSecret).update(rawToken).digest('hex');
  const response = await fetch(`${store.supabaseUrl}/rest/v1/rpc/consume_commerce_download_token`, {
    method: 'POST',
    headers: restHeaders(),
    body: JSON.stringify({ p_token_hash: tokenHash }),
  });
  const rows = (await response.json().catch(() => [])) as Array<{
    token_id: string;
    order_id: string;
    product_code: string;
    buyer_email: string;
    remaining_uses: number;
  }>;
  if (!response.ok) throw new Error(`Commerce token RPC error ${response.status}`);
  return rows[0] ?? null;
}

export async function recordDownloadEvent(input: {
  tokenId: string;
  orderId: string;
  userAgent?: string | null;
  ipHash?: string | null;
}) {
  await rest('commerce_download_events', {
    method: 'POST',
    headers: restHeaders('return=minimal'),
    body: JSON.stringify({
      token_id: input.tokenId,
      order_id: input.orderId,
      user_agent: input.userAgent || null,
      ip_hash: input.ipHash || null,
    }),
  });
}
