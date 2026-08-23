-- JoinHook Commerce — domain event log for federated Control Plane / Revenue Intelligence
-- Events are owned by Commerce. Consumers read only through authenticated contracts/APIs.

create table if not exists public.commerce_domain_events (
  event_id uuid primary key,
  dedupe_key text not null unique,
  event_type text not null,
  event_version integer not null default 1 check (event_version > 0),
  occurred_at timestamptz not null,
  environment text not null check (environment in ('development','staging','production')),
  correlation_id text,
  subject_id text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists commerce_domain_events_occurred_idx
  on public.commerce_domain_events (occurred_at, event_id);
create index if not exists commerce_domain_events_type_occurred_idx
  on public.commerce_domain_events (event_type, occurred_at desc);

alter table public.commerce_domain_events enable row level security;
revoke all on table public.commerce_domain_events from public, anon, authenticated;

drop policy if exists commerce_domain_events_deny_clients on public.commerce_domain_events;
create policy commerce_domain_events_deny_clients
  on public.commerce_domain_events
  for all
  to anon, authenticated
  using (false)
  with check (false);

comment on table public.commerce_domain_events is
  'Append-only Commerce-owned domain event log. Browser roles are denied; consumers use explicit JoinHook Data Pass APIs.';
