-- JoinOps procurement invariants.

create or replace function ops.validate_po_received_quantity()
returns trigger
language plpgsql
as $$
declare
  ordered numeric;
begin
  select ordered_quantity into ordered
    from ops.purchase_order_lines
   where tenant_id = new.tenant_id and id = new.id;

  if ordered is not null and new.received_quantity > ordered then
    raise exception 'PO_OVER_RECEIVED: line %, ordered %, received %', new.id, ordered, new.received_quantity;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_po_received_quantity on ops.purchase_order_lines;
create trigger trg_po_received_quantity
before update of received_quantity on ops.purchase_order_lines
for each row execute function ops.validate_po_received_quantity();

create or replace function ops.sync_purchase_order_status()
returns trigger
language plpgsql
as $$
declare
  total_lines integer;
  complete_lines integer;
  any_received boolean;
begin
  select count(*),
         count(*) filter (where received_quantity >= ordered_quantity),
         bool_or(received_quantity > 0)
    into total_lines, complete_lines, any_received
    from ops.purchase_order_lines
   where tenant_id = new.tenant_id and purchase_order_id = new.purchase_order_id;

  update ops.purchase_orders
     set status = case
       when total_lines > 0 and complete_lines = total_lines then 'RECEIVED'
       when any_received then 'PARTIALLY_RECEIVED'
       else status
     end,
     updated_at = now()
   where tenant_id = new.tenant_id and id = new.purchase_order_id
     and status not in ('CANCELLED','DRAFT');

  return new;
end;
$$;

drop trigger if exists trg_sync_purchase_order_status on ops.purchase_order_lines;
create trigger trg_sync_purchase_order_status
after update of received_quantity on ops.purchase_order_lines
for each row execute function ops.sync_purchase_order_status();
