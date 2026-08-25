import type { NextApiRequest, NextApiResponse } from 'next';

function getConfig() {
  const url = process.env.LOCAL_SUPABASE_URL;
  const serviceKey = process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY;
  const adminToken = process.env.LOCAL_ADMIN_TOKEN;
  return url && serviceKey && adminToken ? { url: url.replace(/\/$/, ''), serviceKey, adminToken } : null;
}

function authorized(req: NextApiRequest, token: string) {
  const auth = req.headers.authorization || '';
  return auth === `Bearer ${token}`;
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'method_not_allowed' }); }
  const cfg = getConfig();
  if (!cfg) return res.status(503).json({ error: 'admin_backend_not_configured' });
  if (!authorized(req, cfg.adminToken)) return res.status(401).json({ error: 'unauthorized' });

  const { entity, action, data } = req.body || {};
  try {
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
      const result = action === 'update' && data.id
        ? await write(cfg.url, cfg.serviceKey, 'local_businesses', 'PATCH', row, `?id=eq.${encodeURIComponent(data.id)}`)
        : await write(cfg.url, cfg.serviceKey, 'local_businesses', 'POST', row);
      return res.status(200).json({ ok: true, result });
    }

    if (entity === 'signal') {
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
      const result = action === 'update' && data.id
        ? await write(cfg.url, cfg.serviceKey, 'local_signals', 'PATCH', row, `?id=eq.${encodeURIComponent(data.id)}`)
        : await write(cfg.url, cfg.serviceKey, 'local_signals', 'POST', row);
      return res.status(200).json({ ok: true, result });
    }

    if (entity === 'catalog') {
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
      const result = action === 'update' && data.id
        ? await write(cfg.url, cfg.serviceKey, 'local_catalog_items', 'PATCH', row, `?id=eq.${encodeURIComponent(data.id)}`)
        : await write(cfg.url, cfg.serviceKey, 'local_catalog_items', 'POST', row);
      return res.status(200).json({ ok: true, result });
    }

    return res.status(400).json({ error: 'unsupported_entity' });
  } catch (error) {
    console.error('JoinHook Local admin error', error);
    return res.status(502).json({ error: 'admin_write_failed' });
  }
}
