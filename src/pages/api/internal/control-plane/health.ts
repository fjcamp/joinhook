import type { NextApiRequest, NextApiResponse } from 'next';
import { authorizeControlPlaneBearer } from '@/lib/control-plane/auth';
import type { ProductHealthSnapshot } from '@/lib/control-plane/contracts';

function configured(name: string) {
  return Boolean(process.env[name]?.trim());
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const token = process.env.JOINHOOK_CP_COMMERCE_TOKEN?.trim() || '';
  if (!token) return res.status(503).json({ error: 'control_plane_not_configured' });
  if (!authorizeControlPlaneBearer(req.headers.authorization, token)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const configChecks = [
    ['database', configured('JOINHOOK_COMMERCE_SUPABASE_URL') && configured('JOINHOOK_COMMERCE_SUPABASE_SERVICE_ROLE_KEY')],
    ['mercadopago', configured('MERCADOPAGO_ACCESS_TOKEN') && configured('MERCADOPAGO_WEBHOOK_SECRET')],
    ['delivery', configured('JOINHOOK_DOWNLOAD_TOKEN_SECRET') && configured('JOINHOOK_GASTRO_EXPRESS_PRIVATE_FILE')],
  ] as const;

  const state = configChecks.every(([, ok]) => ok) ? 'healthy' : 'degraded';
  const snapshot: ProductHealthSnapshot = {
    contractVersion: 1,
    productId: 'joinhook-commerce',
    environment: process.env.JOINHOOK_COMMERCE_ENV === 'production' ? 'production' : 'staging',
    observedAt: new Date().toISOString(),
    state,
    version: process.env.JOINHOOK_RELEASE_SHA?.slice(0, 12) || null,
    checks: [
      ...configChecks.map(([key, ok]) => ({ key, state: ok ? 'healthy' as const : 'degraded' as const })),
      {
        key: 'accepting-payments',
        state: process.env.JOINHOOK_COMMERCE_ACCEPT_PAYMENTS === 'true' ? 'healthy' : 'unknown',
        message: process.env.JOINHOOK_COMMERCE_ACCEPT_PAYMENTS === 'true' ? 'enabled' : 'disabled-by-policy',
      },
    ],
  };

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(snapshot);
}
