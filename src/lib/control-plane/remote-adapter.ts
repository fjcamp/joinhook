import type {
  ProductControlPlaneAdapter,
  ProductHealthSnapshot,
  ProductId,
  ProductIncidentSnapshot,
  ProductRevenueSnapshot,
  ProductUsageSnapshot,
} from './contracts';

type RemoteAdapterConfig = {
  productId: ProductId;
  baseUrl: string;
  token: string;
};

function normalizedBaseUrl(raw: string) {
  const url = new URL(raw);
  const allowHttp = process.env.NODE_ENV !== 'production' && ['localhost', '127.0.0.1'].includes(url.hostname);
  if (url.protocol !== 'https:' && !allowHttp) throw new Error('Control Plane product endpoint must use HTTPS');
  url.pathname = url.pathname.replace(/\/$/, '');
  url.search = '';
  url.hash = '';
  return url.toString().replace(/\/$/, '');
}

function assertBaseSnapshot(payload: unknown, expectedProduct: ProductId) {
  if (!payload || typeof payload !== 'object') throw new Error('Invalid Control Plane response');
  const base = payload as { contractVersion?: unknown; productId?: unknown };
  if (base.contractVersion !== 1 || base.productId !== expectedProduct) {
    throw new Error('Control Plane contract/product mismatch');
  }
}

export class RemoteProductControlPlaneAdapter implements ProductControlPlaneAdapter {
  readonly productId: ProductId;
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(config: RemoteAdapterConfig) {
    this.productId = config.productId;
    this.baseUrl = normalizedBaseUrl(config.baseUrl);
    this.token = config.token;
    if (!this.token) throw new Error(`Missing Control Plane token for ${config.productId}`);
  }

  private async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.token}`,
        'User-Agent': 'JoinHook-Control-Plane/1',
      },
    });
    if (!response.ok) throw new Error(`Control Plane ${this.productId} returned ${response.status}`);
    const payload = (await response.json()) as T;
    assertBaseSnapshot(payload, this.productId);
    return payload;
  }

  getHealth() {
    return this.get<ProductHealthSnapshot>('/api/internal/control-plane/health');
  }

  getUsage(periodStart: string, periodEnd: string) {
    const params = new URLSearchParams({ from: periodStart, to: periodEnd });
    return this.get<ProductUsageSnapshot>(`/api/internal/control-plane/usage?${params.toString()}`);
  }

  getRevenue(periodStart: string, periodEnd: string) {
    const params = new URLSearchParams({ from: periodStart, to: periodEnd });
    return this.get<ProductRevenueSnapshot>(`/api/internal/control-plane/revenue?${params.toString()}`);
  }

  getIncidents() {
    return this.get<ProductIncidentSnapshot>('/api/internal/control-plane/incidents');
  }
}

export function remoteProductConfigFromEnv(productId: ProductId, envPrefix: string) {
  const baseUrl = process.env[`${envPrefix}_URL`]?.trim() || '';
  const token = process.env[`${envPrefix}_TOKEN`]?.trim() || '';
  if (!baseUrl || !token) return null;
  return { productId, baseUrl, token } satisfies RemoteAdapterConfig;
}
