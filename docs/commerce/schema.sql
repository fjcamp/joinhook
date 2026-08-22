-- JoinHook Commerce Core v1
-- Apply only to the dedicated JoinHook Commerce Postgres/Supabase project.
-- Backend-only model: browser clients must never receive service-role credentials.

create extension if not exists pgcrypto;

create table if not exists public.commerce_orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  product_code text not null,
  buyer_email text not null,
  amount numeric(12,2) not null check (amount > 0),
  currency text not null check (currency = 'CLP'),
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded','cancelled')),
  provider text not null check (provider in ('mercadopago')),
  provider_order_id text unique,
  provider_payment_id text,
  idempotency_key text not null unique,
  claim_token_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.commerce_payment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.commerce_orders(id) on delete set null,
  provider_order_id text,
  provider_event_id text,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(provider_event_id, event_type)
);

create table if not exists public.commerce_entitlements (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.commerce_orders(id) on delete restrict,
  product_code text not null,
  buyer_email text not null,
  status text not null default 'active' check (status in ('active','revoked')),
  max_downloads integer not null default 3 check (max_downloads > 0),
  downloads_used integer not null default 0 check (downloads_used >= 0 and downloads_used <= max_downloads),
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists public.commerce_download_tokens (
  id uuid primary key default gen_random_uuid(),
  entitlement_id uuid not null references public.commerce_entitlements(id) on delete cascade,
  token_hash text not null unique,
  max_uses integer not null default 3 check (max_uses > 0),
  uses integer not null default 0 check (uses >= 0 and uses <= max_uses),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create table if not exists public.commerce_download_events (
  id uuid primary key default gen_random_uuid(),
  token_id uuid not null references public.commerce_download_tokens(id) on delete restrict,
  order_id uuid not null references public.commerce_orders(id) on delete restrict,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists commerce_orders_status_idx on public.commerce_orders(status);
create index if not exists commerce_orders_email_idx on public.commerce_orders(lower(buyer_email));
create index if not exists commerce_payment_events_provider_order_idx on public.commerce_payment_events(provider_order_id);
create index if not exists commerce_payment_events_order_id_idx on public.commerce_payment_events(order_id);
create index if not exists commerce_download_tokens_entitlement_idx on public.commerce_download_tokens(entitlement_id);
create index if not exists commerce_download_events_token_id_idx on public.commerce_download_events(token_id);
create index if not exists commerce_download_events_order_id_idx on public.commerce_download_events(order_id);

-- Validate a token without consuming allowance. The backend uses this before
-- opening the private artifact so a storage error does not spend a download.
create or replace function public.preview_commerce_download_token(p_token_hash text)
returns table(token_id uuid, order_id uuid, product_code text, buyer_email text, remaining_uses integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token public.commerce_download_tokens%rowtype;
  v_ent public.commerce_entitlements%rowtype;
begin
  select * into v_token
  from public.commerce_download_tokens
  where token_hash = p_token_hash;

  if not found or v_token.expires_at <= now() or v_token.uses >= v_token.max_uses then
    return;
  end if;

  select * into v_ent
  from public.commerce_entitlements
  where id = v_token.entitlement_id and status = 'active';

  if not found or v_ent.downloads_used >= v_ent.max_downloads then
    return;
  end if;

  return query
  select
    v_token.id,
    v_ent.order_id,
    v_ent.product_code,
    v_ent.buyer_email,
    least(v_token.max_uses - v_token.uses, v_ent.max_downloads - v_ent.downloads_used);
end;
$$;

-- Atomically consumes one use from both the token and its purchase entitlement.
-- Issuing a fresh token never resets the total purchase download allowance.
create or replace function public.consume_commerce_download_token(p_token_hash text)
returns table(token_id uuid, order_id uuid, product_code text, buyer_email text, remaining_uses integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token public.commerce_download_tokens%rowtype;
  v_ent public.commerce_entitlements%rowtype;
begin
  select * into v_token
  from public.commerce_download_tokens
  where token_hash = p_token_hash
  for update;

  if not found or v_token.expires_at <= now() or v_token.uses >= v_token.max_uses then
    return;
  end if;

  select * into v_ent
  from public.commerce_entitlements
  where id = v_token.entitlement_id and status = 'active'
  for update;

  if not found or v_ent.downloads_used >= v_ent.max_downloads then
    return;
  end if;

  update public.commerce_download_tokens
  set uses = uses + 1, last_used_at = now()
  where id = v_token.id;

  update public.commerce_entitlements
  set downloads_used = downloads_used + 1
  where id = v_ent.id;

  return query
  select
    v_token.id,
    v_ent.order_id,
    v_ent.product_code,
    v_ent.buyer_email,
    least(
      v_token.max_uses - (v_token.uses + 1),
      v_ent.max_downloads - (v_ent.downloads_used + 1)
    );
end;
$$;

-- Defense in depth: backend-only tables remain behind RLS and have no client policies.
alter table public.commerce_orders enable row level security;
alter table public.commerce_payment_events enable row level security;
alter table public.commerce_entitlements enable row level security;
alter table public.commerce_download_tokens enable row level security;
alter table public.commerce_download_events enable row level security;

revoke all on table public.commerce_orders from anon, authenticated;
revoke all on table public.commerce_payment_events from anon, authenticated;
revoke all on table public.commerce_entitlements from anon, authenticated;
revoke all on table public.commerce_download_tokens from anon, authenticated;
revoke all on table public.commerce_download_events from anon, authenticated;

grant all on table public.commerce_orders to service_role;
grant all on table public.commerce_payment_events to service_role;
grant all on table public.commerce_entitlements to service_role;
grant all on table public.commerce_download_tokens to service_role;
grant all on table public.commerce_download_events to service_role;

-- SECURITY DEFINER RPCs must never be executable by PUBLIC/anon/authenticated.
revoke execute on function public.preview_commerce_download_token(text) from public, anon, authenticated;
revoke execute on function public.consume_commerce_download_token(text) from public, anon, authenticated;
grant execute on function public.preview_commerce_download_token(text) to service_role;
grant execute on function public.consume_commerce_download_token(text) to service_role;

comment on function public.preview_commerce_download_token(text) is 'JoinHook Commerce backend-only token preview. service_role only.';
comment on function public.consume_commerce_download_token(text) is 'JoinHook Commerce backend-only atomic token consumption. service_role only.';
