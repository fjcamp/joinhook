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

export type AdminBusinessRow = { id:string; slug:string; name:string; category:string; city:string; region:string; summary:string; latitude:number|null; longitude:number|null; open_now:boolean; verification:string; status:'draft'|'published'|'archived'; updated_at:string };
export type AdminCatalogRow = { id:string; business_id:string; category:string; name:string; price_label:string; featured:boolean; sort_order:number; status:'draft'|'published'|'archived'; updated_at:string };
export type AdminSignalRow = { id:string; kind:string; title:string; summary:string; city:string|null; region:string; sponsored:boolean; verification:string|null; source_url:string|null; status:'draft'|'published'|'archived'; updated_at:string };
export type AdminContentSnapshot = { actor:{role:string;email?:string}; businesses:AdminBusinessRow[]; catalog:AdminCatalogRow[]; signals:AdminSignalRow[]; moderation:unknown[] };

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

export async function loadAdminContent(accessToken:string):Promise<AdminContentSnapshot>{
  const response=await fetch('/api/local/admin-content',{headers:{Accept:'application/json',Authorization:`Bearer ${accessToken}`}});
  const body=await response.json().catch(()=>({}));
  if(!response.ok) throw new Error(body?.error||`admin content ${response.status}`);
  return body as AdminContentSnapshot;
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
