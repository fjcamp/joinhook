// Compatibility/canonical route for the Mercado Pago configuration currently
// registered in the JoinHook Commerce application.
//
// Public URL:
//   /api/commerce/mercadopago/webhook
//
// Keep the actual processing logic in one place to avoid signature/idempotency
// drift between aliases.
export { default } from '@/pages/api/commerce/webhooks/mercadopago';
