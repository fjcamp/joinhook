export type CommerceProduct = {
  code: string;
  slug: string;
  name: string;
  shortName: string;
  currency: 'CLP';
  amount: number;
  active: boolean;
};

/**
 * CGE is intentionally not used as a public or internal acronym because it is
 * strongly associated with another Chilean company. Use the stable product
 * code below for integrations and data correlation.
 */
export const GASTRO_EXPRESS_PRODUCT_CODE = 'JH-GASTRO-EXPRESS-FOUNDERS';

export const commerceProducts: Record<string, CommerceProduct> = {
  [GASTRO_EXPRESS_PRODUCT_CODE]: {
    code: GASTRO_EXPRESS_PRODUCT_CODE,
    slug: 'control-gastronomico-express',
    name: 'Control Gastronómico Express',
    shortName: 'Control Express',
    currency: 'CLP',
    amount: 4990,
    active: true,
  },
};

export function getCommerceProduct(code: string) {
  return commerceProducts[code] ?? null;
}
