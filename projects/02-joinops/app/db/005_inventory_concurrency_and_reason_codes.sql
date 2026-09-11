-- JoinOps Inventory hardening
-- Fixes the first inventory foundation race: application-level balance checks are not sufficient under concurrency.
-- The ledger remains append-only; a per-bucket lock serializes stock-affecting writes.

create table if not exists ops.inventory_balance_locks (
  tenant_id uuid not null,
  product_id uuid not null references ops.products(id),
  lot_id uuid null,
  location_id uuid null,
  primary key (tenant_id, product_id, lot_id, location_id)
);

create table if not exists ops.reason_codes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  code text not null,
  domain text not null,
  name text not null,
  requires_note boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

insert into ops.reason_codes (tenant_id, code, domain, name, requires_note)
select distinct p.tenant_id, v.code, v.domain, v.name, v.requires_note
from ops.products p
cross join (values
  ('WASTE_EXPIRED','INVENTORY','Merma por vencimiento',false),
  ('WASTE_DAMAGED','INVENTORY','Merma por daño',true),
  ('RETURN_QUALITY','INVENTORY','Devolución por calidad',true),
  ('ADJUSTMENT_COUNT','INVENTORY','Ajuste por conteo',true),
  ('ADJUSTMENT_DAMAGE','INVENTORY','Ajuste por daño',true),
  ('RECEIPT_SHORT','RECEIVING','Recepción con faltante',true),
  ('RECEIPT_OVER','RECEIVING','Recepción con sobrante',true)
) as v(code,domain,name,requires_note)
where not exists (
  select 1 from ops.reason_codes r where r.tenant_id = p.tenant_id and r.code = v.code
);

create or replace function ops.ensure_inventory_lock()
returns trigger
language plpgsql
as $$
begin
  insert into ops.inventory_balance_locks (tenant_id, product_id, lot_id, location_id)
  values (new.tenant_id, new.product_id, new.lot_id, new.location_id)
  on conflict do nothing;

  perform 1 from ops.inventory_balance_locks
  where tenant_id = new.tenant_id
    and product_id = new.product_id
    and lot_id is not distinct from new.lot_id
    and location_id is not distinct from new.location_id
  for update;

  return new;
end;
$$;

drop trigger if exists trg_inventory_lock on ops.inventory_movements;
create trigger trg_inventory_lock
after insert on ops.inventory_movements
for each row execute function ops.ensure_inventory_lock();

create or replace function ops.reject_negative_inventory()
returns trigger
language plpgsql
as $$
declare
  balance numeric;
begin
  if new.movement_type in ('ISSUE','TRANSFER_OUT','SALE','WASTE','RETURN_TO_SUPPLIER','ADJUSTMENT_OUT','CONSUMPTION') then
    select coalesce(sum(case
      when movement_type in ('RECEIPT','TRANSFER_IN','ADJUSTMENT_IN') then quantity
      when movement_type in ('ISSUE','TRANSFER_OUT','SALE','WASTE','RETURN_TO_SUPPLIER','ADJUSTMENT_OUT','CONSUMPTION') then -quantity
      else 0 end), 0)
      into balance
      from ops.inventory_movements
     where tenant_id = new.tenant_id
       and product_id = new.product_id
       and lot_id is not distinct from new.lot_id
       and location_id is not distinct from new.location_id;

    if balance < 0 then
      raise exception 'INVENTORY_NEGATIVE: tenant %, product %, lot %, location %, balance %',
        new.tenant_id, new.product_id, new.lot_id, new.location_id, balance
        using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_inventory_no_negative on ops.inventory_movements;
create constraint trigger trg_inventory_no_negative
after insert on ops.inventory_movements
deferrable initially immediate
for each row execute function ops.reject_negative_inventory();

comment on table ops.inventory_balance_locks is 'Concurrency guard for append-only inventory buckets. Prevents race conditions in negative-stock checks.';
comment on table ops.reason_codes is 'Controlled operational reasons. Critical adjustments/returns/waste may require an operator note.';
