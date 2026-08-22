import crypto from 'node:crypto';
import type { DomainEventEnvelope, Environment } from '@/lib/control-plane/contracts';

export type CommerceDomainEventType =
  | 'commerce.order.created'
  | 'commerce.order.paid'
  | 'commerce.entitlement.granted'
  | 'commerce.download.completed'
  | 'commerce.refund.completed'
  | 'commerce.chargeback.received'
  | 'commerce.delivery.revoked';

export function buildCommerceDomainEvent<TData extends Record<string, unknown>>(input: {
  type: CommerceDomainEventType;
  environment: Environment;
  correlationId?: string | null;
  subjectId?: string | null;
  data: TData;
}): DomainEventEnvelope<TData> {
  return {
    eventId: crypto.randomUUID(),
    eventType: input.type,
    eventVersion: 1,
    occurredAt: new Date().toISOString(),
    sourceProduct: 'joinhook-commerce',
    environment: input.environment,
    correlationId: input.correlationId ?? null,
    subjectId: input.subjectId ?? null,
    data: input.data,
  };
}

/**
 * Future sink boundary for Revenue Intelligence / Control Plane.
 * An implementation must be idempotent and must not include provider secrets,
 * card data or raw download tokens in the event payload.
 */
export interface CommerceDomainEventSink {
  publish(event: DomainEventEnvelope): Promise<void>;
}
