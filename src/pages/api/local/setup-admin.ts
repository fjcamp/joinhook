import type { NextApiRequest, NextApiResponse } from 'next';

function config() {
  const url = process.env.LOCAL_SUPABASE_URL;
  const serviceKey = process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY;
  const setupToken = process.env.LOCAL_ADMIN_SETUP_TOKEN;
  return url && serviceKey && setupToken ? { url: url.replace(/\/$/, ''), serviceKey, setupToken } : null;
}

async function roleCount(base: string, serviceKey: string) {
  const response = await fetch(`${base}/rest/v1/local_user_roles?select=user_id&limit=1`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`role lookup ${response.status}`);
  const rows = await response.json() as Array<{ user_id: string }>;
  return rows.length;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method_not_allowed' }); }
  const cfg = config();
  if (!cfg) return res.status(503).json({ error: 'setup_not_configured' });
  const { email, password, setupToken } = req.body || {};
  if (setupToken !== cfg.setupToken) return res.status(401).json({ error: 'invalid_setup_token' });
  if (typeof email !== 'string' || typeof password !== 'string' || password.length < 10) return res.status(400).json({ error: 'invalid_admin_credentials' });

  try {
    if (await roleCount(cfg.url, cfg.serviceKey)) return res.status(409).json({ error: 'admin_already_initialized' });

    const userResponse = await fetch(`${cfg.url}/auth/v1/admin/users`, {
      method: 'POST',
      headers: { apikey: cfg.serviceKey, Authorization: `Bearer ${cfg.serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, email_confirm: true }),
    });
    const user = await userResponse.json().catch(() => ({}));
    if (!userResponse.ok || !user?.id) return res.status(502).json({ error: 'admin_user_creation_failed' });

    const roleResponse = await fetch(`${cfg.url}/rest/v1/local_user_roles`, {
      method: 'POST',
      headers: {
        apikey: cfg.serviceKey,
        Authorization: `Bearer ${cfg.serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ user_id: user.id, role: 'admin', active: true }),
    });
    if (!roleResponse.ok) return res.status(502).json({ error: 'admin_role_creation_failed' });
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error('JoinHook Local first admin setup error', error);
    return res.status(502).json({ error: 'admin_setup_failed' });
  }
}
