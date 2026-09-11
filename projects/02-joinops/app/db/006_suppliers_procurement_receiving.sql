-- JoinOps Supplier, procurement and receiving foundation.

create table if not exists ops.suppliers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  legal_name text not null,
  trade_name text,
  tax_id text,
  email text,
  phone text,
  address text,
  payment_terms_days integer check (payment_terms_days is null or payment_terms_days >= 0),
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_suppliers_tax_id
  on ops.suppliers(tenant_id, tax_id) where tax_id is not null;

create table if not exists ops.supplier_contacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  supplier_id uuid not null references ops.suppliers(id),
  name text not null,
  role text,
  email text,
  phone text,
  preferred boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists ops.supplier_quotes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  supplier_id uuid not null references ops.suppliers(id),
  quote_number text,
  valid_until date,
  currency text not null default 'CLP',
  status text not null default 'RECEIVED' check (status in ('RECEIVED','UNDER_REVIEW','ACCEPTED','REJECTED','EXPIRED')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists ops.supplier_quote_lines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  quote_id uuid not null references ops.supplier_quotes(id),
  product_id uuid not null references ops.products(id),
  supplier_product_id uuid references ops.supplier_products(id),
  quantity numeric(18,6) not null check (quantity > 0),
  unit_cost numeric(18,4) not null check (unit_cost >= 0),
  created_at timestamptz not null default now()
);

create table if not exists ops.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  order_number text not null,
  supplier_id uuid not null references ops.suppliers(id),
  quote_id uuid references ops.supplier_quotes(id),
  status text not null default 'DRAFT' check (status in ('DRAFT','PENDING_APPROVAL','APPROVED','SENT','PARTIALLY_RECEIVED','RECEIVED','CANCELLED')),
  currency text not null default 'CLP',
  notes text,
  ordered_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, order_number)
);

create table if not exists ops.purchase_order_lines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  purchase_order_id uuid not null references ops.purchase_orders(id),
  product_id uuid not null references ops.products(id),
  supplier_product_id uuid references ops.supplier_products(id),
  ordered_quantity numeric(18,6) not null check (ordered_quantity > 0),
  unit_cost numeric(18,4) not null check (unit_cost >= 0),
  received_quantity numeric(18,6) not null default 0 check (received_quantity >= 0),
  created_at timestamptz not null default now()
);

create table if not exists ops.receipts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  receipt_number text not null,
  purchase_order_id uuid references ops.purchase_orders(id),
  supplier_id uuid not null references ops.suppliers(id),
  document_type text,
  document_number text,
  document_date date,
  received_at timestamptz not null default now(),
  status text not null default 'DRAFT' check (status in ('DRAFT','PENDING_REVIEW','CONFIRMED','REJECTED','CANCELLED')),
  received_by text,
  notes text,
  created_at timestamptz not null default now(),
  unique (tenant_id, receipt_number)
);

create table if not exists ops.receipt_lines (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  receipt_id uuid not null references ops.receipts(id),
  purchase_order_line_id uuid references ops.purchase_order_lines(id),
  product_id uuid not null references ops.products(id),
  supplier_product_id uuid references ops.supplier_products(id),
  lot_id uuid references ops.inventory_lots(id),
  received_quantity numeric(18,6) not null check (received_quantity > 0),
  unit_cost numeric(18,4) not null check (unit_cost >= 0),
  expiry_date date,
  variance_reason_code text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists ops.supplier_price_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  supplier_product_id uuid not null references ops.supplier_products(id),
  unit_cost numeric(18,4) not null check (unit_cost >= 0),
  currency text not null default 'CLP',
  source_type text,
  source_id text,
  recorded_at timestamptz not null default now(),
  recorded_by text
);

create index if not exists idx_supplier_products_supplier on ops.supplier_products(tenant_id, supplier_name);
create index if not exists idx_purchase_orders_supplier_status on ops.purchase_orders(tenant_id, supplier_id, status);
create index if not exists idx_receipts_supplier_date on ops.receipts(tenant_id, supplier_id, received_at desc);
create index if not exists idx_price_history_product_time on ops.supplier_price_history(tenant_id, supplier_product_id, recorded_at desc);

comment on table ops.suppliers is 'Master supplier record; supplier identity is independent from product identity.';
comment on table ops.purchase_orders is 'Controlled procurement workflow: draft -> approval -> sent -> receiving.';
comment on table ops.receipts is 'Human-confirmed receiving record; confirmation is the boundary that can affect inventory.';
