export type PaymentProviderName = 'mercadopago' | 'flow' | 'webpay';

export type PaymentOrderStatus = 'created' | 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';

export type CreatePaymentOrderInput = {
  orderCode: string;
  amount: number;
  currency: 'CLP';
  buyerEmail: string;
};

export type PaymentOrderResult = {
  provider: PaymentProviderName;
  providerOrderId: string;
  status: PaymentOrderStatus;
  rawStatus?: string | null;
};

export type VerifiedPayment = {
  provider: PaymentProviderName;
  providerOrderId: string;
  providerPaymentId?: string | null;
  externalReference: string;
  amount: number;
  currency: 'CLP';
  status: PaymentOrderStatus;
};

/**
 * Boundary for payment providers. Commerce owns orders, entitlements and delivery;
 * providers only process and report payments.
 */
export interface PaymentProviderAdapter {
  readonly name: PaymentProviderName;
  createOrder(input: CreatePaymentOrderInput): Promise<PaymentOrderResult>;
  verifyOrder(providerOrderId: string): Promise<VerifiedPayment>;
}
