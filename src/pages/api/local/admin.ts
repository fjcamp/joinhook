import type { NextApiRequest, NextApiResponse } from 'next';

type LocalRole = 'admin' | 'editor' | 'moderator' | 'viewer';

type AuthUser = { id: string; email?: string };
type RoleRow = { role: LocalRole; active: boolean };

function getConfig() {
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
  const userResponse = await fetch(`${base}/auth/v1/user`, {
    headers: { apikey: publishableKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!userResponse.ok) return null;
  const user = await userResponse.json() as AuthUser;
  if (!user?.id) return null;

  const roleResponse = await fetch(`${base}/rest/v1/local_user_roles?select=role,active&user_id=eq.${encodeURIComponent(user.id)}&limit=1`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json' },
  });
  if (!roleResponse.ok) return null;
  const rows = await roleResponse.json() as RoleRow[];
  const role = rows[0];
  if (!role?.active) return null;
  return { user, role: role.role };
}

function canWrite(role: LocalRole, entity: string, action: string) {
  if (role === 'admin') return true;
  if (role === 'editor') return ['business', 'signal', 'catalog'].includes(entity) && ['create', 'update'].includes(action);
  if (role === 'moderator') return entity === 'signal' && action === 'update';
  return false;
}

async function write(base: string, serviceKey: string, table: string, method: 'POST'|'PATCH', body: unknown, query = '') {
  const response = await fetch(`${base}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Supabase write ${response.status}`);
  return payload;
}

async function audit(base: string, serviceKey: string, actorId: string, entity: string, entityId: string, action: string) {
  try {
    await write(base, serviceKey, 'local_moderation_log', 'POST', {
      actor_user_id: actorId,
      entity_type: entity,
      entity_id: entityId,
      action,
    });
  } catch (error) {
    console.error('JoinHook Local audit write error', error);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method_not_allowed' }); }
  const cfg = getConfig();
  if (!cfg) return res.status(503).json({ error: 'admin_backend_not_configured' });

  const actor = await resolveActor(cfg.url, cfg.publishableKey, cfg.serviceKey, bearer(req));
  if (!actor) return res.status(401).json({ error: 'unauthorized' });

  const { entity, action, data } = req.body || {};
  if (!canWrite(actor.role, entity, action)) return res.status(403).json({ error: 'forbidden' });

  try {
    let result: Array<{ id?: string }> | null = null;
    if (entity === 'business') {
      const row = {
        slug: data.slug,
        name: data.name,
        category: data.category,
        city: data.city,
        region: data.region || 'Los Lagos',
        summary: data.summary || '',
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        open_now: Boolean(data.openNow),
        verification: data.verification || 'pending',
        status: data.status || 'draft',
        updated_at: new Date().toISOString(),
      };
      result = action === 'update' && data.id
        ? await write(cfg.url, cfg.serviceKey, 'local_businesses', 'PATCH', row, `?id=eq.${encodeURIComponent(data.id)}`)
        : await write(cfg.url, cfg.serviceKey, 'local_businesses', 'POST', row);
    } else if (entity === 'signal') {
      const row = {
        kind: data.kind,
        title: data.title,
        summary: data.summary || '',
        city: data.city || null,
        region: data.region || 'Los Lagos',
        sponsored: Boolean(data.sponsored),
        verification: data.verification || null,
        source_url: data.sourceUrl || null,
        status: data.status || 'draft',
        updated_at: new Date().toISOString(),
      };
      result = action === 'update' && data.id
        ? await write(cfg.url, cfg.serviceKey, 'local_signals', 'PATCH', row, `?id=eq.${encodeURIComponent(data.id)}`)
        : await write(cfg.url, cfg.serviceKey, 'local_signals', 'POST', row);
    } else if (entity === 'catalog') {
      const row = {
        business_id: data.businessId,
        category: data.category,
        name: data.name,
        price_label: data.priceLabel || '',
        featured: Boolean(data.featured),
        sort_order: Number(data.sortOrder || 0),
        status: data.status || 'draft',
        updated_at: new Date().toISOString(),
      };
      result = action === 'update' && data.id
        ? await write(cfg.url, cfg.serviceKey, 'local_catalog_items', 'PATCH', row, `?id=eq.${encodeURIComponent(data.id)}`)
        : await write(cfg.url, cfg.serviceKey, 'local_catalog_items', 'POST', row);
    } else {
      return res.status(400).json({ error: 'unsupported_entity' });
    }

    const entityId = String(result?.[0]?.id || data.id || 'unknown');
    await audit(cfg.url, cfg.serviceKey, actor.user.id, entity, entityId, action);
    return res.status(200).json({ ok: true, result, actor: { role: actor.role } });
  } catch (error) {
    console.error('JoinHook Local admin error', error);
    return res.status(502).json({ error: 'admin_write_failed' });
  }
}
