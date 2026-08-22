import type { ProductId } from './contracts';

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

export function getProductDataBoundary(productId: ProductId) {
  return productDataBoundaries.find((boundary) => boundary.id === productId) ?? null;
}
