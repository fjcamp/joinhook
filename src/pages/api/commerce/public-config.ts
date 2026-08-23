import type { NextApiRequest, NextApiResponse } from 'next';
import { publicCommerceConfig } from '@/lib/commerce/config';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const config = publicCommerceConfig();
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  return res.status(200).json({
    enabled: config.enabled,
    environment: config.environment,
    publicKey: config.publicKey,
  });
}
