function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function positiveNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value || fallback);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function commerceSupabaseServerKey() {
  const modernSecret = process.env.JOINHOOK_COMMERCE_SUPABASE_SECRET_KEY?.trim();
  const legacyServiceRole = process.env.JOINHOOK_COMMERCE_SUPABASE_SERVICE_ROLE_KEY?.trim();
  const value = modernSecret || legacyServiceRole;
  if (!value) {
    throw new Error('Missing required environment variable: JOINHOOK_COMMERCE_SUPABASE_SECRET_KEY');
  }
  return {
    value,
    kind: modernSecret ? ('modern_secret' as const) : ('legacy_service_role' as const),
  };
}

export function commerceAcceptsPayments() {
  return process.env.JOINHOOK_COMMERCE_ACCEPT_PAYMENTS === 'true';
}

export function commerceCheckoutEnabled() {
  return process.env.JOINHOOK_COMMERCE_CHECKOUT_ENABLED === 'true'
    || process.env.NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED === 'true';
}

export function commerceRuntimeContext() {
  return {
    siteUrl: (process.env.JOINHOOK_SITE_URL || 'https://joinhook.cl').replace(/\/$/, ''),
    environment: process.env.JOINHOOK_COMMERCE_ENV === 'production' ? ('production' as const) : ('test' as const),
    acceptsPayments: commerceAcceptsPayments(),
    checkoutEnabled: commerceCheckoutEnabled(),
  };
}

export function commerceMercadoPagoConfig() {
  return {
    publicKey: (process.env.MERCADOPAGO_PUBLIC_KEY || process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY)?.trim() || '',
    accessToken: required('MERCADOPAGO_ACCESS_TOKEN'),
    webhookSecret: required('MERCADOPAGO_WEBHOOK_SECRET'),
  } as const;
}

export function commerceStoreConfig() {
  const supabaseKey = commerceSupabaseServerKey();
  return {
    supabaseUrl: required('JOINHOOK_COMMERCE_SUPABASE_URL').replace(/\/$/, ''),
    serverKey: supabaseKey.value,
    serverKeyKind: supabaseKey.kind,
  } as const;
}

export function commerceDeliveryConfig() {
  return {
    tokenSecret: required('JOINHOOK_DOWNLOAD_TOKEN_SECRET'),
    defaultTtlHours: positiveNumber(process.env.JOINHOOK_DOWNLOAD_TTL_HOURS, 72),
    defaultMaxDownloads: Math.max(1, Math.floor(positiveNumber(process.env.JOINHOOK_DOWNLOAD_MAX_USES, 3))),
  } as const;
}

export function commerceRecoveryConfig() {
  const endpoint = process.env.JOINHOOK_TRANSACTIONAL_EMAIL_WEBHOOK_URL?.trim() || '';
  const secret = process.env.JOINHOOK_TRANSACTIONAL_EMAIL_WEBHOOK_SECRET?.trim() || '';
  return {
    tokenSecret: required('JOINHOOK_RECOVERY_TOKEN_SECRET'),
    ttlMinutes: Math.max(5, Math.floor(positiveNumber(process.env.JOINHOOK_RECOVERY_TTL_MINUTES, 30))),
    maxRequestsPer15Minutes: Math.max(1, Math.floor(positiveNumber(process.env.JOINHOOK_RECOVERY_MAX_REQUESTS_15M, 5))),
    emailWebhookUrl: endpoint,
    emailWebhookSecret: secret,
    emailConfigured: Boolean(endpoint && secret && endpoint.startsWith('https://')),
  } as const;
}

/**
 * Backward-compatible aggregate for call sites that need the complete Commerce
 * runtime. New low-level modules should prefer the narrow configuration helpers
 * above so unrelated secrets are not required unnecessarily.
 */
export function commerceConfig() {
  return {
    ...commerceRuntimeContext(),
    mercadopago: commerceMercadoPagoConfig(),
    store: commerceStoreConfig(),
    delivery: commerceDeliveryConfig(),
  } as const;
}

/**
 * Public values safe to expose to the browser. This function is intended to be
 * called server-side at request time so BlueHosting/cPanel environment changes
 * can enable sandbox checkout without rebuilding the Next.js artifact.
 */
export function publicCommerceConfig() {
  const runtime = commerceRuntimeContext();
  return {
    publicKey: (process.env.MERCADOPAGO_PUBLIC_KEY || process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY)?.trim() || '',
    enabled: runtime.checkoutEnabled,
    environment: runtime.environment,
  } as const;
}
