import type { DataPassContractV1, ProductId } from './contracts';

export type ProductDataBoundary = {
  id: ProductId;
  owns: string[];
  exposesToControlPlane: string[];
  prohibitedByDefault: string[];
};

/**
 * Documentation-as-code for product data ownership.
 * This registry contains no credentials, endpoints or customer data.
 */
export const productDataBoundaries: ProductDataBoundary[] = [
  {
    id: 'snowwise',
    owns: ['users', 'destinations', 'weather-context', 'gps', 'maps', 'passport', 'gear-checklists', 'community'],
    exposesToControlPlane: ['health', 'release-version', 'aggregate-usage', 'integration-health', 'open-incidents'],
    prohibitedByDefault: ['precise-location', 'private-profile-data', 'raw-community-content', 'credentials'],
  },
  {
    id: 'joinops',
    owns: ['companies', 'branches', 'inventory', 'production', 'recipes', 'suppliers', 'hr', 'operations', 'audit-ledger'],
    exposesToControlPlane: ['health', 'release-version', 'aggregate-usage', 'integration-health', 'open-incidents'],
    prohibitedByDefault: ['employee-personal-data', 'payroll-detail', 'customer-secrets', 'credentials'],
  },
  {
    id: 'joinhook-commerce',
    owns: ['products', 'orders', 'payments', 'payment-events', 'entitlements', 'downloads', 'refunds'],
    exposesToControlPlane: ['health', 'aggregate-revenue', 'order-counts', 'payment-health', 'delivery-health'],
    prohibitedByDefault: ['payment-secrets', 'card-data', 'download-tokens', 'service-role-credentials'],
  },
  {
    id: 'revenue-intelligence',
    owns: ['sessions', 'behavior-events', 'campaign-attribution', 'chat-signals', 'lead-scoring', 'funnels', 'derived-models'],
    exposesToControlPlane: ['health', 'aggregate-funnel-metrics', 'campaign-performance', 'model-freshness'],
    prohibitedByDefault: ['raw-sensitive-conversation-content', 'unmasked-personal-data', 'credentials'],
  },
  {
    id: 'regional-knowledge',
    owns: ['sources', 'provenance', 'validity', 'territories', 'structured-knowledge', 'approved-rag-indexes'],
    exposesToControlPlane: ['health', 'source-freshness', 'coverage', 'verification-status'],
    prohibitedByDefault: ['private-client-documents', 'unapproved-drafts', 'credentials'],
  },
];

/**
 * Initial approved data flows. These records describe what may cross a service
 * boundary; they do not grant access by themselves. Runtime credentials remain
 * independent and must implement the declared scope.
 */
export const dataPassRegistry: DataPassContractV1[] = [
  {
    contractVersion: 1,
    id: 'snowwise-control-plane-health-v1',
    source: 'snowwise',
    consumer: 'joinhook',
    purpose: 'Portfolio health, release and aggregate usage visibility.',
    dataClassification: 'internal',
    fields: ['health', 'releaseVersion', 'aggregateUsage', 'integrationHealth', 'openIncidents'],
    transport: 'https-api',
    direction: 'read-only',
    retention: 'Snapshots only; no raw SnowWise operational records.',
    authScope: 'snowwise:control-plane:read',
    audit: 'Consumer request log + source access log.',
    revocation: 'Rotate/revoke the SnowWise scoped Control Plane credential.',
  },
  {
    contractVersion: 1,
    id: 'commerce-revenue-events-v1',
    source: 'joinhook-commerce',
    consumer: 'revenue-intelligence',
    purpose: 'Measure funnel conversion and commercial outcomes without exposing payment secrets.',
    dataClassification: 'confidential',
    fields: ['eventId', 'eventType', 'occurredAt', 'correlationId', 'productCode', 'amount', 'currency', 'status'],
    transport: 'event-bus',
    direction: 'event-only',
    retention: 'Per Revenue Intelligence retention policy; buyer email is excluded by default.',
    authScope: 'commerce:revenue-events:consume',
    audit: 'Append-only event IDs at producer and consumer.',
    revocation: 'Disable consumer subscription/credential without changing Commerce payment credentials.',
    legalBasisOrPolicy: 'Privacy-by-design; minimization and purpose limitation.',
  },
  {
    contractVersion: 1,
    id: 'product-commerce-order-command-v1',
    source: 'snowwise',
    consumer: 'joinhook-commerce',
    purpose: 'Allow a product to request creation of a JoinHook Commerce order without database access.',
    dataClassification: 'confidential',
    fields: ['productCode', 'customerRef', 'buyerEmail', 'returnContext'],
    transport: 'https-api',
    direction: 'command',
    retention: 'Commerce retains only fields required for order, support and compliance.',
    authScope: 'commerce:orders:create:snowwise',
    audit: 'Correlation ID + authenticated source product + order code.',
    revocation: 'Revoke the SnowWise Commerce client credential.',
    legalBasisOrPolicy: 'Commercial transaction and applicable privacy policy.',
  },
];

export function getProductDataBoundary(productId: ProductId) {
  return productDataBoundaries.find((boundary) => boundary.id === productId) ?? null;
}

export function getDataPass(id: string) {
  return dataPassRegistry.find((dataPass) => dataPass.id === id) ?? null;
}
