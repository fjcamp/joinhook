function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function commerceAcceptsPayments() {
  return process.env.JOINHOOK_COMMERCE_ACCEPT_PAYMENTS === 'true';
}

export function commerceConfig() {
  return {
    siteUrl: (process.env.JOINHOOK_SITE_URL || 'https://joinhook.cl').replace(/\/$/, ''),
    environment: process.env.JOINHOOK_COMMERCE_ENV === 'production' ? 'production' : 'test',
    acceptsPayments: commerceAcceptsPayments(),
    mercadopago: {
      publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY?.trim() || '',
      accessToken: required('MERCADOPAGO_ACCESS_TOKEN'),
      webhookSecret: required('MERCADOPAGO_WEBHOOK_SECRET'),
    },
    store: {
      supabaseUrl: required('JOINHOOK_COMMERCE_SUPABASE_URL').replace(/\/$/, ''),
      serviceRoleKey: required('JOINHOOK_COMMERCE_SUPABASE_SERVICE_ROLE_KEY'),
    },
    delivery: {
      tokenSecret: required('JOINHOOK_DOWNLOAD_TOKEN_SECRET'),
      defaultTtlHours: Number(process.env.JOINHOOK_DOWNLOAD_TTL_HOURS || 72),
      defaultMaxDownloads: Number(process.env.JOINHOOK_DOWNLOAD_MAX_USES || 3),
    },
  } as const;
}

export function publicCommerceConfig() {
  return {
    publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY?.trim() || '',
    enabled: process.env.NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED === 'true',
    environment: process.env.JOINHOOK_COMMERCE_ENV === 'production' ? 'production' : 'test',
  } as const;
}
