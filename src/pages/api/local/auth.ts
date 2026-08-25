import type { NextApiRequest, NextApiResponse } from 'next';

function config() {
  const url = process.env.LOCAL_SUPABASE_URL;
  const key = process.env.LOCAL_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method_not_allowed' }); }
  const cfg = config();
  if (!cfg) return res.status(503).json({ error: 'auth_backend_not_configured' });
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'invalid_credentials_payload' });
  }

  try {
    const response = await fetch(`${cfg.url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: cfg.key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return res.status(401).json({ error: 'invalid_credentials' });
    return res.status(200).json({ accessToken: payload.access_token, expiresIn: payload.expires_in, user: { id: payload.user?.id, email: payload.user?.email } });
  } catch (error) {
    console.error('JoinHook Local auth error', error);
    return res.status(502).json({ error: 'auth_backend_unavailable' });
  }
}
