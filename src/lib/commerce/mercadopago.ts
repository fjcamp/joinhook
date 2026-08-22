import crypto from 'node:crypto';
import { commerceConfig } from './config';

const MP_API = 'https://api.mercadopago.com';

export type MercadoPagoOrderResponse = {
  id: string;
  status?: string;
  status_detail?: string;
  external_reference?: string;
  total_amount?: string;
  transactions?: {
    payments?: Array<{
      id?: string;
      status?: string;
      status_detail?: string;
      amount?: string;
    }>;
  };
  [key: string]: unknown;
};

async function mpRequest<T>(path: string, init: RequestInit = {}) {
  const { mercadopago } = commerceConfig();
  const response = await fetch(`${MP_API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mercadopago.accessToken}`,
      ...(init.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`Mercado Pago API ${response.status}`) as Error & { status?: number; payload?: unknown };
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload as T;
}

export function newIdempotencyKey() {
  return crypto.randomUUID();
}

export async function createMercadoPagoCardOrder(input: {
  externalReference: string;
  amount: number;
  payerEmail: string;
  paymentMethodId: string;
  paymentMethodType: string;
  cardToken: string;
  installments: number;
  idempotencyKey?: string;
}) {
  const idempotencyKey = input.idempotencyKey || newIdempotencyKey();
  const body = {
    type: 'online',
    external_reference: input.externalReference,
    processing_mode: 'automatic',
    capture_mode: 'automatic',
    total_amount: input.amount.toFixed(2),
    config: {
      online: {
        transaction_security: {
          validation: 'on_fraud_risk',
          liability_shift: 'required',
        },
      },
    },
    payer: { email: input.payerEmail },
    transactions: {
      payments: [
        {
          amount: input.amount.toFixed(2),
          payment_method: {
            id: input.paymentMethodId,
            type: input.paymentMethodType,
            token: input.cardToken,
            installments: input.installments,
          },
        },
      ],
    },
  };

  const order = await mpRequest<MercadoPagoOrderResponse>('/v1/orders', {
    method: 'POST',
    headers: { 'X-Idempotency-Key': idempotencyKey },
    body: JSON.stringify(body),
  });
  return { order, idempotencyKey };
}

export async function getMercadoPagoOrder(orderId: string) {
  return mpRequest<MercadoPagoOrderResponse>(`/v1/orders/${encodeURIComponent(orderId)}`, { method: 'GET' });
}

export function isMercadoPagoOrderApproved(order: MercadoPagoOrderResponse) {
  const payment = order.transactions?.payments?.[0];
  return order.status === 'processed' || payment?.status === 'approved';
}
