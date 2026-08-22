import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const checks = {
    environment: process.env.JOINHOOK_COMMERCE_ENV === 'production' ? 'production' : 'test',
    featureEnabled: process.env.NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED === 'true',
    publicKeyConfigured: Boolean(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY?.trim()),
    accessTokenConfigured: Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN?.trim()),
    webhookSecretConfigured: Boolean(process.env.MERCADOPAGO_WEBHOOK_SECRET?.trim()),
    storeConfigured: Boolean(process.env.JOINHOOK_COMMERCE_SUPABASE_URL?.trim() && process.env.JOINHOOK_COMMERCE_SUPABASE_SERVICE_ROLE_KEY?.trim()),
    deliverySecretConfigured: Boolean(process.env.JOINHOOK_DOWNLOAD_TOKEN_SECRET?.trim()),
    privateProductConfigured: Boolean(process.env.JOINHOOK_GASTRO_EXPRESS_PRIVATE_FILE?.trim()),
  };

  const readyForSandbox = checks.publicKeyConfigured && checks.accessTokenConfigured && checks.webhookSecretConfigured && checks.storeConfigured && checks.deliverySecretConfigured && checks.privateProductConfigured;
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ service: 'joinhook-commerce', readyForSandbox, checks });
}
