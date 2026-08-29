import type { DomainEventEnvelope, Environment } from '@/lib/control-plane/contracts';
import { commerceStoreConfig } from './config';
import { buildCommerceDomainEvent, type CommerceDomainEventType } from './domain-events';

function restHeaders(prefer?: string) {
  const store = commerceStoreConfig();
  return {
    apikey: store.serverKey,
    ...(store.serverKeyKind === 'legacy_service_role'
      ? { Authorization: `Bearer ${store.serverKey}` }
      : {}),
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

function commerceEnvironment(): Environment {
  if (process.env.NODE_ENV !== 'production') return 'development';
  return process.env.JOINHOOK_COMMERCE_ENV === 'production' ? 'production' : 'staging';
}

export async function recordCommerceDomainEvent<TData extends Record<string, unknown>>(input: {
  type: CommerceDomainEventType;
  dedupeKey: string;
  correlationId?: string | null;
  subjectId?: string | null;
  data: TData;
}) {
  const store = commerceStoreConfig();
  const event = buildCommerceDomainEvent({
    type: input.type,
    environment: commerceEnvironment(),
    correlationId: input.correlationId,
    subjectId: input.subjectId,
    data: input.data,
  });

  const response = await fetch(`${store.supabaseUrl}/rest/v1/commerce_domain_events?on_conflict=dedupe_key`, {
    method: 'POST',
    headers: restHeaders('return=minimal,resolution=ignore-duplicates'),
    body: JSON.stringify({
      event_id: event.eventId,
      dedupe_key: input.dedupeKey,
      event_type: event.eventType,
      event_version: event.eventVersion,
      occurred_at: event.occurredAt,
      environment: event.environment,
      correlation_id: event.correlationId ?? null,
      subject_id: event.subjectId ?? null,
      data: event.data,
    }),
  });

  if (!response.ok) {
    const payload = await response.text().catch(() => '');
    throw new Error(`Commerce domain event store error ${response.status}: ${payload.slice(0, 300)}`);
  }
  return event;
}

type StoredEvent = {
  event_id: string;
  event_type: string;
  event_version: number;
  occurred_at: string;
  environment: Environment;
  correlation_id: string | null;
  subject_id: string | null;
  data: Record<string, unknown>;
};

export async function listCommerceDomainEvents(input: {
  after?: string | null;
  limit?: number;
}) {
  const store = commerceStoreConfig();
  const limit = Math.max(1, Math.min(Number(input.limit || 50), 100));
  const params = new URLSearchParams({
    select: 'event_id,event_type,event_version,occurred_at,environment,correlation_id,subject_id,data',
    order: 'occurred_at.asc,event_id.asc',
    limit: String(limit),
  });
  if (input.after) params.set('occurred_at', `gt.${input.after}`);

  const response = await fetch(`${store.supabaseUrl}/rest/v1/commerce_domain_events?${params.toString()}`, {
    method: 'GET',
    headers: restHeaders(),
  });
  const rows = (await response.json().catch(() => [])) as StoredEvent[];
  if (!response.ok) throw new Error(`Commerce domain event read error ${response.status}`);

  return rows.map((row): DomainEventEnvelope => ({
    eventId: row.event_id,
    eventType: row.event_type,
    eventVersion: row.event_version,
    occurredAt: row.occurred_at,
    sourceProduct: 'joinhook-commerce',
    environment: row.environment,
    correlationId: row.correlation_id,
    subjectId: row.subject_id,
    data: row.data,
  }));
}
