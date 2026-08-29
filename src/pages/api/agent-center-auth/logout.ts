import type { NextApiRequest, NextApiResponse } from 'next';
import { clearOwnerSessionCookie } from '@/utils/agentCenterAuth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  res.setHeader('Set-Cookie', clearOwnerSessionCookie());
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ authenticated: false });
}
