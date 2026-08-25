import type { NextApiRequest, NextApiResponse } from 'next';

type LocalRole = 'admin' | 'editor' | 'moderator' | 'viewer';
type AuthUser = { id: string; email?: string };
type RoleRow = { role: LocalRole; active: boolean };

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

async function resolveActor(base: string, publishableKey: string, serviceKey: string, accessToken: string) {
  if (!accessToken) return null;
  const userResponse = await fetch(`${base}/auth/v1/user`, { headers: { apikey: publishableKey, Authorization: `Bearer ${accessToken}` } });
  if (!userResponse.ok) return null;
  const user = await userResponse.json() as AuthUser;
  if (!user?.id) return null;
  const roleResponse = await fetch(`${base}/rest/v1/local_user_roles?select=role,active&user_id=eq.${encodeURIComponent(user.id)}&limit=1`, { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } });
  if (!roleResponse.ok) return null;
  const rows = await roleResponse.json() as RoleRow[];
  const role = rows[0];
  return role?.active ? { user, role: role.role } : null;
}

async function rest<T>(base: string, key: string, path: string): Promise<T> {
  const response = await fetch(`${base}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
  return response.json() as Promise<T>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'method_not_allowed' }); }
  const cfg = config();
  if (!cfg) return res.status(503).json({ error: 'admin_backend_not_configured' });
  const actor = await resolveActor(cfg.url, cfg.publishableKey, cfg.serviceKey, bearer(req));
  if (!actor) return res.status(401).json({ error: 'unauthorized' });

  try {
    const [businesses, catalog, signals, moderation] = await Promise.all([
      rest(cfg.url, cfg.serviceKey, 'local_businesses?select=id,slug,name,category,city,region,summary,latitude,longitude,open_now,verification,status,whatsapp_url,directions_url,website_url,updated_at&order=updated_at.desc&limit=200'),
      rest(cfg.url, cfg.serviceKey, 'local_catalog_items?select=id,business_id,category,name,price_label,featured,sort_order,status,updated_at&order=business_id.asc,sort_order.asc&limit=500'),
      rest(cfg.url, cfg.serviceKey, 'local_signals?select=id,kind,title,summary,city,region,sponsored,verification,source_url,status,updated_at&order=updated_at.desc&limit=300'),
      actor.role === 'admin' ? rest(cfg.url, cfg.serviceKey, 'local_moderation_log?select=id,entity_type,entity_id,action,actor_user_id,created_at&order=created_at.desc&limit=50') : Promise.resolve([]),
    ]);
    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(200).json({ actor: { role: actor.role, email: actor.user.email }, businesses, catalog, signals, moderation });
  } catch (error) {
    console.error('JoinHook Local admin content error', error);
    return res.status(502).json({ error: 'admin_content_unavailable' });
  }
}
