import type { NextApiRequest, NextApiResponse } from 'next';

type Role = 'admin' | 'editor' | 'moderator' | 'viewer';
type AuthUser = { id: string };
type RoleRow = { role: Role; active: boolean };

type ImportPayload = {
  businesses?: Array<Record<string, unknown>>;
  catalog?: Array<Record<string, unknown>>;
  signals?: Array<Record<string, unknown>>;
};

function cfg() {
  const url = process.env.LOCAL_SUPABASE_URL?.replace(/\/$/, '');
  const serviceKey = process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = process.env.LOCAL_SUPABASE_PUBLISHABLE_KEY;
  return url && serviceKey && publishableKey ? { url, serviceKey, publishableKey } : null;
}

function token(req: NextApiRequest) {
  const value = req.headers.authorization || '';
  return value.startsWith('Bearer ') ? value.slice(7) : '';
}

async function actor(base: string, publishableKey: string, serviceKey: string, accessToken: string) {
  const userRes = await fetch(`${base}/auth/v1/user`, { headers: { apikey: publishableKey, Authorization: `Bearer ${accessToken}` } });
  if (!userRes.ok) return null;
  const user = await userRes.json() as AuthUser;
  const roleRes = await fetch(`${base}/rest/v1/local_user_roles?select=role,active&user_id=eq.${encodeURIComponent(user.id)}&limit=1`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json' },
  });
  if (!roleRes.ok) return null;
  const rows = await roleRes.json() as RoleRow[];
  return rows[0]?.active ? { user, role: rows[0].role } : null;
}

async function insert(base: string, serviceKey: string, table: string, rows: unknown[]) {
  if (!rows.length) return 0;
  const response = await fetch(`${base}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(rows),
  });
  if (!response.ok) throw new Error(`${table} import ${response.status}`);
  return rows.length;
}

function cleanBusinesses(rows: Array<Record<string, unknown>>) {
  return rows.slice(0, 200).map((row) => ({
    slug: String(row.slug || '').trim(),
    name: String(row.name || '').trim(),
    category: String(row.category || '').trim(),
    city: String(row.city || '').trim(),
    region: String(row.region || 'Los Lagos').trim(),
    summary: String(row.summary || '').trim(),
    latitude: typeof row.latitude === 'number' ? row.latitude : null,
    longitude: typeof row.longitude === 'number' ? row.longitude : null,
    open_now: Boolean(row.openNow ?? row.open_now),
    verification: String(row.verification || 'pending'),
    status: String(row.status || 'draft'),
  })).filter((row) => row.slug && row.name && row.category && row.city);
}

function cleanCatalog(rows: Array<Record<string, unknown>>) {
  return rows.slice(0, 500).map((row) => ({
    business_id: String(row.businessId || row.business_id || '').trim(),
    category: String(row.category || '').trim(),
    name: String(row.name || '').trim(),
    price_label: String(row.priceLabel || row.price_label || '').trim(),
    featured: Boolean(row.featured),
    sort_order: Number(row.sortOrder ?? row.sort_order ?? 0),
    status: String(row.status || 'draft'),
  })).filter((row) => row.business_id && row.category && row.name);
}

function cleanSignals(rows: Array<Record<string, unknown>>) {
  return rows.slice(0, 500).map((row) => ({
    kind: String(row.kind || 'event'),
    title: String(row.title || '').trim(),
    summary: String(row.summary || '').trim(),
    city: row.city ? String(row.city).trim() : null,
    region: String(row.region || 'Los Lagos').trim(),
    sponsored: Boolean(row.sponsored),
    verification: row.verification ? String(row.verification) : null,
    source_url: row.sourceUrl || row.source_url ? String(row.sourceUrl || row.source_url) : null,
    status: String(row.status || 'draft'),
  })).filter((row) => row.title);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method_not_allowed' }); }
  const config = cfg();
  if (!config) return res.status(503).json({ error: 'backend_not_configured' });
  const current = await actor(config.url, config.publishableKey, config.serviceKey, token(req));
  if (!current) return res.status(401).json({ error: 'unauthorized' });
  if (!['admin', 'editor'].includes(current.role)) return res.status(403).json({ error: 'forbidden' });

  const payload = (req.body || {}) as ImportPayload;
  const businesses = cleanBusinesses(payload.businesses || []);
  const catalog = cleanCatalog(payload.catalog || []);
  const signals = cleanSignals(payload.signals || []);
  if (!businesses.length && !catalog.length && !signals.length) return res.status(400).json({ error: 'empty_import' });

  try {
    const imported = {
      businesses: await insert(config.url, config.serviceKey, 'local_businesses', businesses),
      catalog: await insert(config.url, config.serviceKey, 'local_catalog_items', catalog),
      signals: await insert(config.url, config.serviceKey, 'local_signals', signals),
    };
    await insert(config.url, config.serviceKey, 'local_moderation_log', [{
      actor_user_id: current.user.id,
      entity_type: 'batch_import',
      entity_id: 'local',
      action: `import:${imported.businesses}/${imported.catalog}/${imported.signals}`,
    }]);
    return res.status(200).json({ ok: true, imported });
  } catch (error) {
    console.error('JoinHook Local import error', error);
    return res.status(502).json({ error: 'import_failed' });
  }
}
