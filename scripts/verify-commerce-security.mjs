import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function requireContains(path, patterns) {
  const text = read(path);
  for (const pattern of patterns) {
    if (!text.includes(pattern)) throw new Error(`${path} is missing required security marker: ${pattern}`);
  }
  return text;
}

function requireAbsent(path, patterns) {
  const text = read(path);
  for (const pattern of patterns) {
    if (text.includes(pattern)) throw new Error(`${path} contains forbidden regression marker: ${pattern}`);
  }
}

requireContains('src/pages/api/commerce/create-order.ts', [
  'commerceAcceptsPayments()',
  'serializeOrderClaimCookie',
  'newIdempotencyKey()',
  "status: 'verification_pending'",
]);
requireAbsent('src/pages/api/commerce/create-order.ts', [
  'claimToken: localOrder.claimToken',
]);

requireContains('src/pages/checkout/control-gastronomico-express.tsx', [
  "credentials: 'same-origin'",
  'GASTRO_EXPRESS_PRODUCT.amount',
]);
requireAbsent('src/pages/checkout/control-gastronomico-express.tsx', [
  'sessionStorage.',
  'localStorage.',
]);

requireContains('src/pages/api/commerce/order-status.ts', [
  'readOrderClaimCookie',
  "res.setHeader('Cache-Control', 'no-store')",
  "entitlement.status !== 'active'",
  'fulfillMercadoPagoOrder(order.provider_order_id)',
]);

requireContains('src/pages/api/commerce/download.ts', [
  'previewDownloadToken(token)',
  'consumeDownloadToken(token)',
  'fs.openSync',
]);

requireContains('src/pages/api/commerce/webhooks/mercadopago.ts', [
  'validateMercadoPagoWebhookSignature',
  "topic !== 'order'",
]);
requireAbsent('src/pages/api/commerce/webhooks/mercadopago.ts', [
  'payload: req.body',
]);

requireContains('src/pages/api/commerce/webhooks/mercadopago-optional.ts', [
  'validateMercadoPagoWebhookSignature',
  'stop_delivery_op_wh',
  'topic_claims_integration_wh',
  'topic_chargebacks_wh',
  'findOrderByProviderPaymentId',
  'revokeEntitlementByOrder',
]);
requireAbsent('src/pages/api/commerce/webhooks/mercadopago-optional.ts', [
  'payload: req.body',
]);

requireContains('src/lib/commerce/mercadopago.ts', [
  'classifyMercadoPagoOrder',
  "detail === 'partially_refunded'",
  "status === 'charged_back'",
  "return 'review'",
]);

requireContains('src/lib/commerce/fulfillment.ts', [
  'LOCAL_ACCESS_HOLD_STATES',
  'classifyMercadoPagoOrder',
  'revokeEntitlementByOrder',
  'fulfillment.blocked_local_hold',
]);

requireContains('src/lib/commerce/config.ts', [
  'JOINHOOK_COMMERCE_SUPABASE_SECRET_KEY',
  "kind: modernSecret ? ('modern_secret' as const) : ('legacy_service_role' as const)",
]);

requireContains('src/lib/commerce/store.ts', [
  'resolution=ignore-duplicates',
  'revokeEntitlementByOrder',
  'findOrderByProviderPaymentId',
  'partially_refunded',
  'charged_back',
  'apikey: store.serverKey',
  "store.serverKeyKind === 'legacy_service_role'",
  "? { Authorization: `Bearer ${store.serverKey}` }",
]);
requireAbsent('src/lib/commerce/store.ts', [
  'store.serviceRoleKey',
]);
requireAbsent('src/lib/commerce/store.ts', [
  "commerce_entitlements?on_conflict=order_id', {\n    method: 'POST',\n    headers: restHeaders('return=representation,resolution=merge-duplicates')",
]);

requireContains('docs/commerce/schema.sql', [
  'idempotency_key text not null unique',
  'max_downloads integer not null',
  'downloads_used integer not null',
  'preview_commerce_download_token',
  'consume_commerce_download_token',
  'partially_refunded',
  'charged_back',
  'commerce_orders_provider_payment_id_uidx',
]);

requireContains('.env.commerce.example', [
  'NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED=false',
  'JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false',
  'JOINHOOK_COMMERCE_SUPABASE_SECRET_KEY=sb_secret_SERVER_ONLY_HERE',
]);

console.log('Commerce security/reliability invariants verified.');
