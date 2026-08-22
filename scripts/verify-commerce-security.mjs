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
  'sessionStorage',
  'localStorage',
]);

requireContains('src/pages/api/commerce/order-status.ts', [
  'readOrderClaimCookie',
  "res.setHeader('Cache-Control', 'no-store')",
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

requireContains('docs/commerce/schema.sql', [
  'idempotency_key text not null unique',
  'max_downloads integer not null',
  'downloads_used integer not null',
  'preview_commerce_download_token',
  'consume_commerce_download_token',
]);

requireContains('.env.commerce.example', [
  'NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED=false',
  'JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false',
]);

console.log('Commerce security/reliability invariants verified.');
