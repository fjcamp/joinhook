-- JoinHook Commerce — purchase recovery
-- Applied to dedicated JoinHook Commerce Supabase project.

create table if not exists public.commerce_recovery_requests (
  id uuid primary key default gen_random_uuid(),
  request_key_hash text not null,
  order_id uuid references public.commerce_orders(id) on delete set null,
  matched boolean not null default false,
  delivery_status text not null check (delivery_status in ('not_attempted','delivered','failed')),
  created_at timestamptz not null default now()
);

create index if not exists commerce_recovery_requests_key_created_idx
  on public.commerce_recovery_requests (request_key_hash, created_at desc);
create index if not exists commerce_recovery_requests_order_idx
  on public.commerce_recovery_requests (order_id);

create table if not exists public.commerce_recovery_tokens (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.commerce_orders(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists commerce_recovery_tokens_order_idx
  on public.commerce_recovery_tokens (order_id);
create index if not exists commerce_recovery_tokens_expires_idx
  on public.commerce_recovery_tokens (expires_at);
create index if not exists commerce_recovery_tokens_active_idx
  on public.commerce_recovery_tokens (expires_at)
  where used_at is null and revoked_at is null;

alter table public.commerce_recovery_requests enable row level security;
alter table public.commerce_recovery_tokens enable row level security;

revoke all on table public.commerce_recovery_requests from public, anon, authenticated;
revoke all on table public.commerce_recovery_tokens from public, anon, authenticated;

drop policy if exists commerce_recovery_requests_deny_clients on public.commerce_recovery_requests;
create policy commerce_recovery_requests_deny_clients
  on public.commerce_recovery_requests
  for all
  to anon, authenticated
  using (false)
  with check (false);

drop policy if exists commerce_recovery_tokens_deny_clients on public.commerce_recovery_tokens;
create policy commerce_recovery_tokens_deny_clients
  on public.commerce_recovery_tokens
  for all
  to anon, authenticated
  using (false)
  with check (false);

-- The expected order code participates in the same atomic UPDATE that consumes
-- the token. Presenting a valid token with a different order code does not burn
-- the token and cannot recover another purchase.
drop function if exists public.consume_commerce_recovery_token(text);

create or replace function public.consume_commerce_recovery_token(
  p_token_hash text,
  p_order_code text
)
returns table (
  token_id uuid,
  order_id uuid,
  order_code text,
  buyer_email text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  update public.commerce_recovery_tokens t
  set used_at = now()
  from public.commerce_orders o
  where t.token_hash = p_token_hash
    and t.order_id = o.id
    and o.order_code = p_order_code
    and t.used_at is null
    and t.revoked_at is null
    and t.expires_at > now()
  returning t.id, t.order_id, o.order_code, o.buyer_email;
end;
$$;

revoke all on function public.consume_commerce_recovery_token(text, text) from public, anon, authenticated;
grant execute on function public.consume_commerce_recovery_token(text, text) to service_role;
