export type ProductId =
  | 'joinhook'
  | 'joinhook-commerce'
  | 'snowwise'
  | 'joinops'
  | 'revenue-intelligence'
  | 'regional-knowledge';

export type Environment = 'development' | 'staging' | 'production';

export type HealthState = 'healthy' | 'degraded' | 'down' | 'unknown';

export type ProductHealthSnapshot = {
  contractVersion: 1;
  productId: ProductId;
  environment: Environment;
  observedAt: string;
  state: HealthState;
  version?: string | null;
  checks: Array<{
    key: string;
    state: HealthState;
    latencyMs?: number | null;
    message?: string | null;
  }>;
};

export type ProductUsageSnapshot = {
  contractVersion: 1;
  productId: ProductId;
  environment: Environment;
  periodStart: string;
  periodEnd: string;
  activeUsers?: number | null;
  sessions?: number | null;
  keyActions?: Record<string, number>;
};

export type ProductRevenueSnapshot = {
  contractVersion: 1;
  productId: ProductId;
  environment: Environment;
  periodStart: string;
  periodEnd: string;
  currency: 'CLP';
  orders: number;
  paidOrders: number;
  grossRevenue: number;
  refunds: number;
};

export type ProductIncidentSnapshot = {
  contractVersion: 1;
  productId: ProductId;
  environment: Environment;
  observedAt: string;
  openIncidents: number;
  criticalIncidents: number;
  lastIncidentAt?: string | null;
};

export type DomainEventEnvelope<TData extends Record<string, unknown> = Record<string, unknown>> = {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  sourceProduct: ProductId;
  environment: Environment;
  correlationId?: string | null;
  subjectId?: string | null;
  data: TData;
};

export type DataClassification = 'public' | 'internal' | 'confidential' | 'sensitive';
export type DataPassDirection = 'read-only' | 'event-only' | 'command';
export type DataPassTransport = 'https-api' | 'webhook' | 'event-bus' | 'queue';

/**
 * Explicit contract for moving a minimal, approved subset of data between two
 * JoinHook products/services. The absence of a field from `fields` means deny.
 */
export type DataPassContractV1 = {
  contractVersion: 1;
  id: string;
  source: ProductId;
  consumer: ProductId;
  purpose: string;
  dataClassification: DataClassification;
  fields: readonly string[];
  transport: DataPassTransport;
  direction: DataPassDirection;
  retention: string;
  authScope: string;
  audit: string;
  revocation: string;
  legalBasisOrPolicy?: string | null;
};

/**
 * Contract implemented by product-specific read adapters.
 * It intentionally exposes only aggregated/control-plane data and never raw tables.
 */
export interface ProductControlPlaneAdapter {
  readonly productId: ProductId;
  getHealth(): Promise<ProductHealthSnapshot>;
  getUsage?(periodStart: string, periodEnd: string): Promise<ProductUsageSnapshot>;
  getRevenue?(periodStart: string, periodEnd: string): Promise<ProductRevenueSnapshot>;
  getIncidents?(): Promise<ProductIncidentSnapshot>;
}
