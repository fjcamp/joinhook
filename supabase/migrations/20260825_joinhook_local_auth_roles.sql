create table if not exists public.local_user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','editor','moderator','viewer')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists local_user_roles_role_active_idx on public.local_user_roles(role, active);
alter table public.local_user_roles enable row level security;

-- Deliberately no client policies. Roles are resolved server-side with the service role.
