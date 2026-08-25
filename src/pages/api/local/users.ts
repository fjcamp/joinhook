import type { NextApiRequest, NextApiResponse } from 'next';

type LocalRole = 'admin' | 'editor' | 'moderator' | 'viewer';
type AuthUser = { id: string; email?: string; created_at?: string };
type RoleRow = { user_id: string; role: LocalRole; active: boolean };

function config() {
  const url = process.env.LOCAL_SUPABASE_URL;
  const serviceKey = process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = process.env.LOCAL_SUPABASE_PUBLISHABLE_KEY;
  return url && serviceKey && publishableKey ? { url: url.replace(/\/$/, ''), serviceKey, publishableKey } : null;
}

function bearer(req: NextApiRequest) {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

async function requireAdmin(base: string, publishableKey: string, serviceKey: string, accessToken: string) {
  if (!accessToken) return null;
  const userResponse = await fetch(`${base}/auth/v1/user`, { headers: { apikey: publishableKey, Authorization: `Bearer ${accessToken}` } });
  if (!userResponse.ok) return null;
  const user = await userResponse.json() as AuthUser;
  const roleResponse = await fetch(`${base}/rest/v1/local_user_roles?select=role,active&user_id=eq.${encodeURIComponent(user.id)}&limit=1`, { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } });
  if (!roleResponse.ok) return null;
  const roles = await roleResponse.json() as Array<{ role: LocalRole; active: boolean }>;
  return roles[0]?.active && roles[0]?.role === 'admin' ? user : null;
}

async function roleWrite(base: string, key: string, method: 'POST'|'PATCH', body: unknown, query = '') {
  const response = await fetch(`${base}/rest/v1/local_user_roles${query}`, {
    method,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: method === 'POST' ? 'resolution=merge-duplicates,return=representation' : 'return=representation' },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`role write ${response.status}`);
  return payload;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cfg = config();
  if (!cfg) return res.status(503).json({ error: 'admin_backend_not_configured' });
  const actor = await requireAdmin(cfg.url, cfg.publishableKey, cfg.serviceKey, bearer(req));
  if (!actor) return res.status(403).json({ error: 'admin_required' });

  try {
    if (req.method === 'GET') {
      const [usersResponse, rolesResponse] = await Promise.all([
        fetch(`${cfg.url}/auth/v1/admin/users?page=1&per_page=100`, { headers: { apikey: cfg.serviceKey, Authorization: `Bearer ${cfg.serviceKey}` } }),
        fetch(`${cfg.url}/rest/v1/local_user_roles?select=user_id,role,active`, { headers: { apikey: cfg.serviceKey, Authorization: `Bearer ${cfg.serviceKey}` } }),
      ]);
      if (!usersResponse.ok || !rolesResponse.ok) throw new Error('operator listing failed');
      const usersPayload = await usersResponse.json() as { users?: AuthUser[] } | AuthUser[];
      const users = Array.isArray(usersPayload) ? usersPayload : usersPayload.users || [];
      const roles = await rolesResponse.json() as RoleRow[];
      const roleByUser = new Map(roles.map((row) => [row.user_id, row]));
      return res.status(200).json({ users: users.map((user) => ({ id: user.id, email: user.email, createdAt: user.created_at, role: roleByUser.get(user.id)?.role || null, active: roleByUser.get(user.id)?.active ?? false })) });
    }

    if (req.method === 'POST') {
      const { email, password, role = 'viewer' } = req.body || {};
      if (!['admin','editor','moderator','viewer'].includes(role) || typeof email !== 'string' || typeof password !== 'string' || password.length < 10) return res.status(400).json({ error: 'invalid_operator_payload' });
      const response = await fetch(`${cfg.url}/auth/v1/admin/users`, {
        method: 'POST',
        headers: { apikey: cfg.serviceKey, Authorization: `Bearer ${cfg.serviceKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, email_confirm: true }),
      });
      const user = await response.json().catch(() => ({}));
      if (!response.ok || !user?.id) return res.status(409).json({ error: 'operator_creation_failed' });
      await roleWrite(cfg.url, cfg.serviceKey, 'POST', { user_id: user.id, role, active: true });
      return res.status(201).json({ ok: true, user: { id: user.id, email: user.email, role, active: true } });
    }

    if (req.method === 'PATCH') {
      const { userId, role, active } = req.body || {};
      if (typeof userId !== 'string' || !['admin','editor','moderator','viewer'].includes(role) || typeof active !== 'boolean') return res.status(400).json({ error: 'invalid_role_payload' });
      if (userId === actor.id && (!active || role !== 'admin')) return res.status(409).json({ error: 'cannot_remove_own_admin_access' });
      const result = await roleWrite(cfg.url, cfg.serviceKey, 'PATCH', { role, active, updated_at: new Date().toISOString() }, `?user_id=eq.${encodeURIComponent(userId)}`);
      return res.status(200).json({ ok: true, result });
    }

    res.setHeader('Allow', 'GET, POST, PATCH');
    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (error) {
    console.error('JoinHook Local operator management error', error);
    return res.status(502).json({ error: 'operator_management_failed' });
  }
}
