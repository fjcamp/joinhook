import type { BusinessDiscoveryItem, LocalDashboard, LocalSignal, LocalBusiness, CatalogItem, GeoPoint } from './types';

export async function loadSupabaseDashboard(signal?: AbortSignal, businessId?: string): Promise<LocalDashboard> {
  const query = businessId ? `?businessId=${encodeURIComponent(businessId)}` : '';
  const response = await fetch(`/api/local/dashboard${query}`, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`local dashboard ${response.status}`);
  return response.json() as Promise<LocalDashboard>;
}

export async function discoverLocalBusinesses(location?: GeoPoint, q = ''): Promise<BusinessDiscoveryItem[]> {
  const params = new URLSearchParams();
  if (location) { params.set('lat', String(location.lat)); params.set('lng', String(location.lng)); }
  if (q.trim()) params.set('q', q.trim());
  const response = await fetch(`/api/local/businesses?${params.toString()}`, { headers: { Accept: 'application/json' } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error || `business discovery ${response.status}`);
  return body.businesses || [];
}

export type AdminBusinessInput = Pick<LocalBusiness, 'name' | 'category' | 'city' | 'summary'> & { id?: string; slug: string; region: string; latitude?: number | null; longitude?: number | null; openNow?: boolean; verification?: LocalBusiness['verification']; status?: 'draft' | 'published' | 'archived' };
export type AdminSignalInput = Pick<LocalSignal, 'kind' | 'title' | 'summary'> & { id?: string; city?: string; region: string; sponsored?: boolean; verification?: LocalSignal['verification']; sourceUrl?: string; status?: 'draft' | 'published' | 'archived' };
export type AdminCatalogInput = Pick<CatalogItem, 'category' | 'name' | 'priceLabel'> & { id?: string; businessId: string; featured?: boolean; sortOrder?: number; status?: 'draft' | 'published' | 'archived' };
export type LocalAdminSession = { accessToken: string; expiresIn: number; user: { id?: string; email?: string } };
export type LocalOperator = { id: string; email?: string; createdAt?: string; role: 'admin' | 'editor' | 'moderator' | 'viewer' | null; active: boolean };

export async function loginLocalAdmin(email: string, password: string): Promise<LocalAdminSession> {
  const response = await fetch('/api/local/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error || `auth ${response.status}`);
  return body as LocalAdminSession;
}

export async function adminMutation(accessToken: string, payload: unknown) {
  const response = await fetch('/api/local/admin', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }, body: JSON.stringify(payload) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error || `admin mutation ${response.status}`);
  return body;
}

async function operatorRequest(accessToken: string, method: 'GET'|'POST'|'PATCH', payload?: unknown) {
  const response = await fetch('/api/local/users', { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` }, body: payload ? JSON.stringify(payload) : undefined });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error || `operators ${response.status}`);
  return body;
}

export async function listLocalOperators(accessToken: string): Promise<LocalOperator[]> { const body = await operatorRequest(accessToken, 'GET'); return body.users || []; }
export async function createLocalOperator(accessToken: string, email: string, password: string, role: Exclude<LocalOperator['role'], null>) { return operatorRequest(accessToken, 'POST', { email, password, role }); }
export async function updateLocalOperator(accessToken: string, userId: string, role: Exclude<LocalOperator['role'], null>, active: boolean) { return operatorRequest(accessToken, 'PATCH', { userId, role, active }); }
