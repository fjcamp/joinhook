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
 * Stable product code for integrations and data correlation. The public short
 * name is Control Express; avoid introducing ambiguous external acronyms.
 */
export const GASTRO_EXPRESS_PRODUCT_CODE = 'JH-GASTRO-EXPRESS-FOUNDERS';

export const GASTRO_EXPRESS_PRODUCT: CommerceProduct = {
  code: GASTRO_EXPRESS_PRODUCT_CODE,
  slug: 'control-gastronomico-express',
  name: 'Control Gastronómico Express',
  shortName: 'Control Express',
  currency: 'CLP',
  amount: 4990,
  active: true,
};

export const commerceProducts: Record<string, CommerceProduct> = {
  [GASTRO_EXPRESS_PRODUCT_CODE]: GASTRO_EXPRESS_PRODUCT,
};

export function getCommerceProduct(code: string) {
  return commerceProducts[code] ?? null;
}
