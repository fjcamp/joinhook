import crypto from 'node:crypto';
import { commerceDeliveryConfig, commerceStoreConfig } from './config';

function restHeaders(prefer?: string) {
  const store = commerceStoreConfig();
  return {
    apikey: store.serverKey,
    // Modern sb_secret_* keys are API keys, not JWTs. Sending them as Bearer
    // tokens can trigger invalid-JWT behavior. Legacy service_role JWT remains
    // supported temporarily for migration compatibility.
    ...(store.serverKeyKind === 'legacy_service_role'
      ? { Authorization: `Bearer ${store.serverKey}` }
      : {}),
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

async function rest<T>(path: string, init: RequestInit = {}) {
  const store = commerceStoreConfig();
  const response = await fetch(`${store.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: { ...restHeaders(), ...(init.headers || {}) },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Commerce store error ${response.status}: ${JSON.stringify(payload)}`);
  return payload as T;
}

export type CommerceOrderStatus =
  | 'pending'
  | 'paid'
  | 'review'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'
  | 'cancelled'
  | 'charged_back';

export type CommerceOrderRecord = {
  id: string;
  order_code: string;
  product_code: string;
  buyer_email: string;
  amount: number;
  currency: 'CLP';
  status: CommerceOrderStatus;
  provider: 'mercadopago';
  provider_order_id: string | null;
  provider_payment_id: string | null;
  idempotency_key: string | null;
  claim_token_hash: string;
  created_at: string;
  paid_at: string | null;
};

type EntitlementRecord = {
  id: string;
  status: 'active' | 'revoked';
};

type DownloadGrant = {
  token_id: string;
  order_id: string;
  product_code: string;
  buyer_email: string;
  remaining_uses: number;
};

export type RecoveryGrant = {
  token_id: string;
  order_id: string;
  order_code: string;
  buyer_email: string;
};

function hashSecret(value: string) {
  const delivery = commerceDeliveryConfig();
  return crypto.createHmac('sha256', delivery.tokenSecret).update(value).digest('hex');
}

function safeEqualText(left: string, right: string) {
  if (left.length !== right.length) return false;
  const encoder = new TextEncoder();
  return crypto.timingSafeEqual(encoder.encode(left), encoder.encode(right));
}

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
  idempotencyKey: string;
}) {
  const claimToken = crypto.randomBytes(32).toString('base64url');
  const row = {
    order_code: createJoinHookOrderCode(),
    product_code: input.productCode,
    buyer_email: input.buyerEmail.toLowerCase(),
    amount: input.amount,
    currency: input.currency,
    status: 'pending',
    provider: 'mercadopago',
    idempotency_key: input.idempotencyKey,
    claim_token_hash: hashSecret(claimToken),
  };
  const response = await rest<CommerceOrderRecord[]>('commerce_orders', {
    method: 'POST',
    headers: restHeaders('return=representation'),
    body: JSON.stringify(row),
  });
  if (!response[0]) throw new Error('Commerce order was not persisted');
  return { order: response[0], claimToken };
}

export async function attachProviderOrder(orderId: string, providerOrderId: string) {
  await rest(`commerce_orders?id=eq.${encodeURIComponent(orderId)}&status=eq.pending`, {
    method: 'PATCH',
    headers: restHeaders('return=minimal'),
    body: JSON.stringify({ provider_order_id: providerOrderId, updated_at: new Date().toISOString() }),
  });
}

export async function markOrderFailed(orderId: string) {
  await rest(`commerce_orders?id=eq.${encodeURIComponent(orderId)}&status=eq.pending`, {
    method: 'PATCH',
    headers: restHeaders('return=minimal'),
    body: JSON.stringify({ status: 'failed', updated_at: new Date().toISOString() }),
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

export async function findOrderByProviderPaymentId(providerPaymentId: string) {
  const rows = await rest<CommerceOrderRecord[]>(`commerce_orders?provider_payment_id=eq.${encodeURIComponent(providerPaymentId)}&limit=1`);
  return rows[0] ?? null;
}

export function validateOrderClaim(order: CommerceOrderRecord, rawClaimToken: string) {
  if (!rawClaimToken) return false;
  return safeEqualText(order.claim_token_hash, hashSecret(rawClaimToken));
}

export async function rotateOrderClaim(orderId: string) {
  const rawClaimToken = crypto.randomBytes(32).toString('base64url');
  const rows = await rest<Array<{ order_code: string }>>(`commerce_orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: restHeaders('return=representation'),
    body: JSON.stringify({ claim_token_hash: hashSecret(rawClaimToken), updated_at: new Date().toISOString() }),
  });
  if (!rows[0]?.order_code) throw new Error('Order claim could not be rotated');
  return { orderCode: rows[0].order_code, claimToken: rawClaimToken };
}

export async function markOrderPaid(input: { orderId: string; providerPaymentId?: string | null }) {
  await rest(`commerce_orders?id=eq.${encodeURIComponent(input.orderId)}&status=in.(pending,review)`, {
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

export async function markOrderPostSaleState(
  orderId: string,
  status: Exclude<CommerceOrderStatus, 'pending' | 'paid'>,
) {
  await rest(`commerce_orders?id=eq.${encodeURIComponent(orderId)}`, {
    method: 'PATCH',
    headers: restHeaders('return=minimal'),
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  });
}

export async function markOrderRefunded(orderId: string) {
  await markOrderPostSaleState(orderId, 'refunded');
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
  const delivery = commerceDeliveryConfig();
  const inserted = await rest<EntitlementRecord[]>('commerce_entitlements?on_conflict=order_id', {
    method: 'POST',
    headers: restHeaders('return=representation,resolution=ignore-duplicates'),
    body: JSON.stringify({
      order_id: orderId,
      product_code: productCode,
      buyer_email: buyerEmail.toLowerCase(),
      status: 'active',
      max_downloads: delivery.defaultMaxDownloads,
    }),
  });
  if (inserted[0]) return inserted[0];

  // A previously revoked entitlement must stay revoked. Never use an upsert
  // that can silently reactivate access after refund/chargeback.
  const existing = await rest<EntitlementRecord[]>(`commerce_entitlements?order_id=eq.${encodeURIComponent(orderId)}&select=id,status&limit=1`);
  return existing[0] ?? null;
}

export async function revokeEntitlementByOrder(orderId: string) {
  await rest(`commerce_entitlements?order_id=eq.${encodeURIComponent(orderId)}&status=eq.active`, {
    method: 'PATCH',
    headers: restHeaders('return=minimal'),
    body: JSON.stringify({ status: 'revoked', revoked_at: new Date().toISOString() }),
  });
}

export async function createDownloadToken(input: { entitlementId: string }) {
  const delivery = commerceDeliveryConfig();
  const rawToken = crypto.randomBytes(32).toString('base64url');
  const tokenHash = hashSecret(rawToken);
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

async function downloadTokenRpc(functionName: 'preview_commerce_download_token' | 'consume_commerce_download_token', rawToken: string) {
  const store = commerceStoreConfig();
  const tokenHash = hashSecret(rawToken);
  const response = await fetch(`${store.supabaseUrl}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: restHeaders(),
    body: JSON.stringify({ p_token_hash: tokenHash }),
  });
  const rows = (await response.json().catch(() => [])) as DownloadGrant[];
  if (!response.ok) throw new Error(`Commerce token RPC ${functionName} error ${response.status}`);
  return rows[0] ?? null;
}

export async function previewDownloadToken(rawToken: string) {
  return downloadTokenRpc('preview_commerce_download_token', rawToken);
}

export async function consumeDownloadToken(rawToken: string) {
  return downloadTokenRpc('consume_commerce_download_token', rawToken);
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

export async function recordRecoveryRequest(input: {
  requestKeyHash: string;
  orderId?: string | null;
  matched: boolean;
  deliveryStatus: 'not_attempted' | 'delivered' | 'failed';
}) {
  await rest('commerce_recovery_requests', {
    method: 'POST',
    headers: restHeaders('return=minimal'),
    body: JSON.stringify({
      request_key_hash: input.requestKeyHash,
      order_id: input.orderId || null,
      matched: input.matched,
      delivery_status: input.deliveryStatus,
    }),
  });
}

export async function countRecentRecoveryRequests(requestKeyHash: string) {
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const rows = await rest<Array<{ id: string }>>(
    `commerce_recovery_requests?request_key_hash=eq.${encodeURIComponent(requestKeyHash)}&created_at=gte.${encodeURIComponent(since)}&select=id`,
    { headers: restHeaders('count=exact') },
  );
  return rows.length;
}

export async function createRecoveryToken(input: {
  orderId: string;
  tokenHash: string;
  expiresAt: string;
}) {
  const rows = await rest<Array<{ id: string }>>('commerce_recovery_tokens', {
    method: 'POST',
    headers: restHeaders('return=representation'),
    body: JSON.stringify({
      order_id: input.orderId,
      token_hash: input.tokenHash,
      expires_at: input.expiresAt,
    }),
  });
  if (!rows[0]?.id) throw new Error('Recovery token was not persisted');
  return rows[0].id;
}

export async function revokeRecoveryToken(tokenId: string) {
  await rest(`commerce_recovery_tokens?id=eq.${encodeURIComponent(tokenId)}&used_at=is.null`, {
    method: 'PATCH',
    headers: restHeaders('return=minimal'),
    body: JSON.stringify({ revoked_at: new Date().toISOString() }),
  });
}

export async function consumeRecoveryTokenHash(tokenHash: string) {
  const store = commerceStoreConfig();
  const response = await fetch(`${store.supabaseUrl}/rest/v1/rpc/consume_commerce_recovery_token`, {
    method: 'POST',
    headers: restHeaders(),
    body: JSON.stringify({ p_token_hash: tokenHash }),
  });
  const rows = (await response.json().catch(() => [])) as RecoveryGrant[];
  if (!response.ok) throw new Error(`Commerce recovery RPC error ${response.status}`);
  return rows[0] ?? null;
}
