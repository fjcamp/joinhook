import type { NextApiRequest, NextApiResponse } from 'next';
import type { LocalDashboard, VerificationState } from '../../../features/local/types';

type BusinessRow = {
  id: string; slug: string; name: string; category: string; city: string; summary: string;
  latitude: number | null; longitude: number | null; open_now: boolean; verification: VerificationState;
  whatsapp_url: string | null; directions_url: string | null; website_url: string | null; updated_at: string;
};
type CatalogRow = { id: string; category: string; name: string; price_label: string; featured: boolean; sort_order: number };
type SignalRow = { id: string; kind: 'offer'|'editorial'|'tourism'|'community'; title: string; summary: string; sponsored: boolean; verification: VerificationState | null; source_url: string | null; updated_at: string };

function config() {
  const url = process.env.LOCAL_SUPABASE_URL || process.env.NEXT_PUBLIC_LOCAL_SUPABASE_URL;
  const key = process.env.LOCAL_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_LOCAL_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ''), key } : null;
}

async function rest<T>(base: string, key: string, path: string): Promise<T> {
  const response = await fetch(`${base}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Supabase REST ${response.status}`);
  return response.json() as Promise<T>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'method_not_allowed' }); }
  const cfg = config();
  if (!cfg) return res.status(503).json({ error: 'local_backend_not_configured' });

  try {
    const businesses = await rest<BusinessRow[]>(cfg.url, cfg.key, 'local_businesses?select=id,slug,name,category,city,summary,latitude,longitude,open_now,verification,whatsapp_url,directions_url,website_url,updated_at&status=eq.published&order=updated_at.desc&limit=1');
    const business = businesses[0];
    if (!business) return res.status(404).json({ error: 'no_published_business' });

    const [catalog, signals] = await Promise.all([
      rest<CatalogRow[]>(cfg.url, cfg.key, `local_catalog_items?select=id,category,name,price_label,featured,sort_order&business_id=eq.${business.id}&status=eq.published&order=sort_order.asc`),
      rest<SignalRow[]>(cfg.url, cfg.key, 'local_signals?select=id,kind,title,summary,sponsored,verification,source_url,updated_at&status=eq.published&order=updated_at.desc&limit=12'),
    ]);

    const dashboard: LocalDashboard = {
      location: { lat: business.latitude ?? -41.3195, lng: business.longitude ?? -72.9854, label: business.city },
      weather: { temperatureC: 0, condition: 'Actualizando clima…', outdoorStatus: 'Consultando condiciones locales', observedAt: new Date().toISOString(), source: 'Open-Meteo' },
      rating: 4.9,
      ratingSource: 'Comunidad local',
      business: {
        id: business.id,
        name: business.name,
        category: business.category,
        city: business.city,
        distanceMeters: 0,
        openNow: business.open_now,
        verification: business.verification,
        summary: business.summary,
        directionsUrl: business.directions_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${business.city}`)}`,
        contactUrl: business.whatsapp_url || business.website_url || undefined,
        catalog: catalog.map((item) => ({ id: item.id, category: item.category, name: item.name, priceLabel: item.price_label, featured: item.featured })),
      },
      signals: signals.map((item) => ({ id: item.id, kind: item.kind, title: item.title, summary: item.summary, sponsored: item.sponsored, verification: item.verification ?? undefined, sourceLabel: item.source_url ? 'Fuente disponible' : undefined })),
      updatedAt: [business.updated_at, ...signals.map((s) => s.updated_at)].sort().at(-1),
    };

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(dashboard);
  } catch (error) {
    console.error('JoinHook Local dashboard error', error);
    return res.status(502).json({ error: 'local_backend_unavailable' });
  }
}
