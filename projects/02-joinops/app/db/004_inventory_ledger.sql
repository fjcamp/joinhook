-- JoinOps Inventory Ledger foundation
-- Product identity is independent from supplier SKU/barcode.
-- All stock-affecting events are append-only ledger entries.

create schema if not exists ops;

create table if not exists ops.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  product_code text not null,
  name text not null,
  category text,
  base_unit text not null,
  purchase_unit text,
  recipe_unit text,
  attributes jsonb not null default '{}'::jsonb,
  nutrition jsonb not null default '{}'::jsonb,
  reference_image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, product_code)
);

create table if not exists ops.supplier_products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  product_id uuid not null references ops.products(id),
  supplier_name text not null,
  supplier_sku text,
  barcode text,
  presentation text,
  unit_multiplier numeric(18,6) not null default 1 check (unit_multiplier > 0),
  current_unit_cost numeric(18,4) check (current_unit_cost >= 0),
  currency text not null default 'CLP',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_supplier_products_product on ops.supplier_products(product_id);
create index if not exists idx_supplier_products_barcode on ops.supplier_products(tenant_id, barcode);

create table if not exists ops.inventory_locations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  code text not null,
  name text not null,
  active boolean not null default true,
  unique (tenant_id, code)
);

create table if not exists ops.inventory_lots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  product_id uuid not null references ops.products(id),
  supplier_product_id uuid references ops.supplier_products(id),
  supplier_lot text,
  source_document text,
  received_at timestamptz,
  manufactured_at date,
  expires_at date,
  received_quantity numeric(18,6) not null check (received_quantity >= 0),
  status text not null default 'AVAILABLE' check (status in ('AVAILABLE','BLOCKED','EXPIRED','DEPLETED')),
  created_at timestamptz not null default now()
);

create index if not exists idx_inventory_lots_product_expiry on ops.inventory_lots(tenant_id, product_id, expires_at);

create table if not exists ops.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  product_id uuid not null references ops.products(id),
  lot_id uuid references ops.inventory_lots(id),
  location_id uuid references ops.inventory_locations(id),
  movement_type text not null check (movement_type in ('RECEIPT','ISSUE','TRANSFER_IN','TRANSFER_OUT','SALE','WASTE','RETURN_TO_SUPPLIER','ADJUSTMENT_IN','ADJUSTMENT_OUT','CONSUMPTION')),
  quantity numeric(18,6) not null check (quantity > 0),
  unit_cost numeric(18,4) check (unit_cost >= 0),
  reason_code text,
  reference_type text,
  reference_id text,
  idempotency_key text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (tenant_id, idempotency_key)
);

create index if not exists idx_inventory_movements_product_time on ops.inventory_movements(tenant_id, product_id, occurred_at desc);
create index if not exists idx_inventory_movements_lot_time on ops.inventory_movements(tenant_id, lot_id, occurred_at desc);

create or replace view ops.inventory_balance as
select
  tenant_id,
  product_id,
  lot_id,
  location_id,
  sum(case when movement_type in ('RECEIPT','TRANSFER_IN','ADJUSTMENT_IN') then quantity
           when movement_type in ('ISSUE','TRANSFER_OUT','SALE','WASTE','RETURN_TO_SUPPLIER','ADJUSTMENT_OUT','CONSUMPTION') then -quantity
           else 0 end) as quantity
from ops.inventory_movements
group by tenant_id, product_id, lot_id, location_id;

comment on table ops.inventory_movements is 'Append-only stock ledger. Corrections are new compensating movements, never silent mutation.';
comment on table ops.products is 'JoinOps Product Master. Supplier SKU/barcode are references, not product identity.';
