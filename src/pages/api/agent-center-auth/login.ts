import type { NextApiRequest, NextApiResponse } from 'next';
import { createOwnerSessionCookie, validateOwnerAccessKey } from '@/utils/agentCenterAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  if (!validateOwnerAccessKey(req.body?.accessKey)) {
    return res.status(401).json({ error: 'invalid_access_key' });
  }

  res.setHeader('Set-Cookie', createOwnerSessionCookie());
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ authenticated: true });
}
