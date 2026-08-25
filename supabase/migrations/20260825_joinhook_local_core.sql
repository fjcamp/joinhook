create extension if not exists pgcrypto;

create table if not exists public.local_businesses (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null,
  category text not null, city text not null, region text not null default 'Los Lagos', summary text not null default '',
  latitude double precision, longitude double precision, open_now boolean not null default false,
  verification text not null default 'pending' check (verification in ('verified','community','pending')),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  whatsapp_url text, directions_url text, website_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.local_catalog_items (
  id uuid primary key default gen_random_uuid(), business_id uuid not null references public.local_businesses(id) on delete cascade,
  category text not null default 'General', name text not null, price_label text not null default '', featured boolean not null default false,
  sort_order integer not null default 0, status text not null default 'published' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.local_signals (
  id uuid primary key default gen_random_uuid(), kind text not null check (kind in ('offer','editorial','tourism','community','event')),
  title text not null, summary text not null default '', city text, region text not null default 'Los Lagos', sponsored boolean not null default false,
  verification text check (verification in ('verified','community','pending')), source_url text, starts_at timestamptz, ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.local_moderation_log (
  id bigint generated always as identity primary key, entity_type text not null, entity_id text not null,
  action text not null, reason text, actor_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists local_businesses_status_city_idx on public.local_businesses(status, city);
create index if not exists local_catalog_business_idx on public.local_catalog_items(business_id, status, sort_order);
create index if not exists local_signals_status_kind_idx on public.local_signals(status, kind);

alter table public.local_businesses enable row level security;
alter table public.local_catalog_items enable row level security;
alter table public.local_signals enable row level security;
alter table public.local_moderation_log enable row level security;

drop policy if exists "local businesses public read" on public.local_businesses;
create policy "local businesses public read" on public.local_businesses for select to anon, authenticated using (status = 'published');

drop policy if exists "local catalog public read" on public.local_catalog_items;
create policy "local catalog public read" on public.local_catalog_items for select to anon, authenticated
using (status = 'published' and exists (select 1 from public.local_businesses b where b.id = business_id and b.status = 'published'));

drop policy if exists "local signals public read" on public.local_signals;
create policy "local signals public read" on public.local_signals for select to anon, authenticated using (status = 'published');
