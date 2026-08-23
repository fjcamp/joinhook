function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
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

export function commerceConfig() {
  const supabaseKey = commerceSupabaseServerKey();
  return {
    siteUrl: (process.env.JOINHOOK_SITE_URL || 'https://joinhook.cl').replace(/\/$/, ''),
    environment: process.env.JOINHOOK_COMMERCE_ENV === 'production' ? 'production' : 'test',
    acceptsPayments: commerceAcceptsPayments(),
    checkoutEnabled: commerceCheckoutEnabled(),
    mercadopago: {
      publicKey: (process.env.MERCADOPAGO_PUBLIC_KEY || process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY)?.trim() || '',
      accessToken: required('MERCADOPAGO_ACCESS_TOKEN'),
      webhookSecret: required('MERCADOPAGO_WEBHOOK_SECRET'),
    },
    store: {
      supabaseUrl: required('JOINHOOK_COMMERCE_SUPABASE_URL').replace(/\/$/, ''),
      serverKey: supabaseKey.value,
      serverKeyKind: supabaseKey.kind,
    },
    delivery: {
      tokenSecret: required('JOINHOOK_DOWNLOAD_TOKEN_SECRET'),
      defaultTtlHours: Number(process.env.JOINHOOK_DOWNLOAD_TTL_HOURS || 72),
      defaultMaxDownloads: Number(process.env.JOINHOOK_DOWNLOAD_MAX_USES || 3),
    },
  } as const;
}

/**
 * Public values safe to expose to the browser. This function is intended to be
 * called server-side at request time so BlueHosting/cPanel environment changes
 * can enable sandbox checkout without rebuilding the Next.js artifact.
 */
export function publicCommerceConfig() {
  return {
    publicKey: (process.env.MERCADOPAGO_PUBLIC_KEY || process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY)?.trim() || '',
    enabled: commerceCheckoutEnabled(),
    environment: process.env.JOINHOOK_COMMERCE_ENV === 'production' ? 'production' : 'test',
  } as const;
}
