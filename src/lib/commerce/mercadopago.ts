import crypto from 'node:crypto';
import { commerceMercadoPagoConfig } from './config';

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

export type MercadoPagoApiError = Error & { status?: number; payload?: unknown };

export type MercadoPagoOrderDisposition =
  | 'paid'
  | 'pending'
  | 'review'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded'
  | 'charged_back';

async function mpRequest<T>(path: string, init: RequestInit = {}) {
  const mercadopago = commerceMercadoPagoConfig();
  const response = await fetch(`${MP_API}${path}`, {
    ...init,
    signal: init.signal ?? AbortSignal.timeout(15_000),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mercadopago.accessToken}`,
      ...(init.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`Mercado Pago API ${response.status}`) as MercadoPagoApiError;
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload as T;
}

export function newIdempotencyKey() {
  return crypto.randomUUID();
}

export function isDefiniteMercadoPagoRejection(error: unknown) {
  const status = (error as MercadoPagoApiError | null)?.status;
  return typeof status === 'number' && status >= 400 && status < 500 && ![408, 409, 425, 429].includes(status);
}

export function isTransientMercadoPagoError(error: unknown) {
  const status = (error as MercadoPagoApiError | null)?.status;
  return typeof status !== 'number' || status >= 500 || [408, 409, 425, 429].includes(status);
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createMercadoPagoCardOrder(input: {
  externalReference: string;
  amount: number;
  payerEmail: string;
  identificationType?: string;
  identificationNumber?: string;
  paymentMethodId: string;
  paymentMethodType: string;
  cardToken: string;
  installments: number;
  idempotencyKey?: string;
}) {
  const idempotencyKey = input.idempotencyKey || newIdempotencyKey();
  const payer: Record<string, unknown> = { email: input.payerEmail };
  if (input.identificationType && input.identificationNumber) {
    payer.identification = { type: input.identificationType, number: input.identificationNumber };
  }
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
    payer,
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

  const createOnce = () => mpRequest<MercadoPagoOrderResponse>('/v1/orders', {
    method: 'POST',
    headers: { 'X-Idempotency-Key': idempotencyKey },
    body: JSON.stringify(body),
  });

  try {
    const order = await createOnce();
    return { order, idempotencyKey };
  } catch (error) {
    // A retry with the SAME idempotency key is safe for transient/ambiguous
    // transport/provider failures and reduces the chance of leaving a buyer in
    // an uncertain state. Never generate a second key for the same attempt.
    if (!isTransientMercadoPagoError(error)) throw error;
    await wait(300);
    const order = await createOnce();
    return { order, idempotencyKey };
  }
}

export async function getMercadoPagoOrder(orderId: string) {
  return mpRequest<MercadoPagoOrderResponse>(`/v1/orders/${encodeURIComponent(orderId)}`, { method: 'GET' });
}

/**
 * Normalize Mercado Pago Orders API status/status_detail into JoinHook states.
 * Unknown states never grant access: they fall into review.
 */
export function classifyMercadoPagoOrder(order: MercadoPagoOrderResponse): MercadoPagoOrderDisposition {
  const status = String(order.status || '').toLowerCase();
  const detail = String(order.status_detail || '').toLowerCase();

  if (status === 'processed' && detail === 'accredited') return 'paid';
  if (status === 'processed' && detail === 'partially_refunded') return 'partially_refunded';
  if (status === 'refunded') return 'refunded';
  if (status === 'charged_back') return 'charged_back';
  if (status === 'failed') return 'failed';
  if (status === 'canceled' || status === 'cancelled' || status === 'expired') return 'cancelled';
  if (status === 'created' || status === 'processing' || status === 'action_required') return 'pending';

  // A processed order with a new/unknown status_detail, or any future status we
  // do not understand, must be reviewed instead of being fulfilled.
  return 'review';
}

export function isMercadoPagoOrderApproved(order: MercadoPagoOrderResponse) {
  return classifyMercadoPagoOrder(order) === 'paid';
}
