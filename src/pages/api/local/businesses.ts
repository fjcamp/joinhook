import type { NextApiRequest, NextApiResponse } from 'next';
import type { BusinessDiscoveryItem, VerificationState } from '../../../features/local/types';

type BusinessRow = {
  id: string; name: string; category: string; city: string; summary: string; open_now: boolean;
  verification: VerificationState; latitude: number | null; longitude: number | null;
};

function config() {
  const url = process.env.LOCAL_SUPABASE_URL;
  const key = process.env.LOCAL_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
}

function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'method_not_allowed' }); }
  const cfg = config();
  if (!cfg) return res.status(503).json({ error: 'local_backend_not_configured' });

  const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
  const category = typeof req.query.category === 'string' ? req.query.category.trim().toLowerCase() : '';
  const city = typeof req.query.city === 'string' ? req.query.city.trim().toLowerCase() : '';
  const lat = typeof req.query.lat === 'string' ? Number(req.query.lat) : NaN;
  const lng = typeof req.query.lng === 'string' ? Number(req.query.lng) : NaN;

  try {
    const response = await fetch(`${cfg.url}/rest/v1/local_businesses?select=id,name,category,city,summary,open_now,verification,latitude,longitude&status=eq.published&order=updated_at.desc&limit=100`, {
      headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}`, Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
    let rows = await response.json() as BusinessRow[];
    if (q) rows = rows.filter((row) => `${row.name} ${row.category} ${row.city} ${row.summary}`.toLowerCase().includes(q));
    if (category) rows = rows.filter((row) => row.category.toLowerCase() === category);
    if (city) rows = rows.filter((row) => row.city.toLowerCase() === city);

    const items: BusinessDiscoveryItem[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      city: row.city,
      summary: row.summary,
      openNow: row.open_now,
      verification: row.verification,
      distanceMeters: Number.isFinite(lat) && Number.isFinite(lng) && row.latitude != null && row.longitude != null ? distanceMeters(lat, lng, row.latitude, row.longitude) : null,
    })).sort((a, b) => (a.distanceMeters ?? Number.MAX_SAFE_INTEGER) - (b.distanceMeters ?? Number.MAX_SAFE_INTEGER));

    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
    return res.status(200).json({ businesses: items });
  } catch (error) {
    console.error('JoinHook Local discovery error', error);
    return res.status(502).json({ error: 'business_discovery_unavailable' });
  }
}
