import type { LocalDashboard, LocalSignal, LocalBusiness, CatalogItem } from './types';

const endpoint = '/api/local/dashboard';

export async function loadSupabaseDashboard(signal?: AbortSignal): Promise<LocalDashboard> {
  const response = await fetch(endpoint, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`local dashboard ${response.status}`);
  return response.json() as Promise<LocalDashboard>;
}

export type AdminBusinessInput = Pick<LocalBusiness, 'name' | 'category' | 'city' | 'summary'> & {
  id?: string;
  slug: string;
  region: string;
  latitude?: number | null;
  longitude?: number | null;
  openNow?: boolean;
  verification?: LocalBusiness['verification'];
  status?: 'draft' | 'published' | 'archived';
};

export type AdminSignalInput = Pick<LocalSignal, 'kind' | 'title' | 'summary'> & {
  id?: string;
  city?: string;
  region: string;
  sponsored?: boolean;
  verification?: LocalSignal['verification'];
  sourceUrl?: string;
  status?: 'draft' | 'published' | 'archived';
};

export type AdminCatalogInput = Pick<CatalogItem, 'category' | 'name' | 'priceLabel'> & {
  id?: string;
  businessId: string;
  featured?: boolean;
  sortOrder?: number;
  status?: 'draft' | 'published' | 'archived';
};

export type LocalAdminSession = {
  accessToken: string;
  expiresIn: number;
  user: { id?: string; email?: string };
};

export async function loginLocalAdmin(email: string, password: string): Promise<LocalAdminSession> {
  const response = await fetch('/api/local/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error || `auth ${response.status}`);
  return body as LocalAdminSession;
}

export async function adminMutation(accessToken: string, payload: unknown) {
  const response = await fetch('/api/local/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error || `admin mutation ${response.status}`);
  return body;
}
