-- JoinOps receiving transaction boundary.
-- Confirmation is the only point at which a receiving draft may affect inventory.

alter table ops.receipt_lines
  add column if not exists location_id uuid references ops.inventory_locations(id);

create or replace function ops.confirm_receipt(
  p_tenant_id uuid,
  p_receipt_id uuid,
  p_actor_user_id uuid default null,
  p_correlation_id uuid default null
)
returns jsonb
language plpgsql
as $$
declare
  receipt_row ops.receipts%rowtype;
  line_row record;
  lot_id uuid;
  movement_id uuid;
  confirmed_count integer := 0;
begin
  select * into receipt_row
    from ops.receipts
   where tenant_id = p_tenant_id and id = p_receipt_id
   for update;

  if not found then
    raise exception 'RECEIPT_NOT_FOUND';
  end if;

  if receipt_row.status = 'CONFIRMED' then
    return jsonb_build_object('ok', true, 'replay', true, 'receiptId', p_receipt_id);
  end if;

  if receipt_row.status not in ('DRAFT','PENDING_REVIEW') then
    raise exception 'RECEIPT_STATUS_NOT_CONFIRMABLE';
  end if;

  if not exists (select 1 from ops.receipt_lines where tenant_id = p_tenant_id and receipt_id = p_receipt_id) then
    raise exception 'RECEIPT_HAS_NO_LINES';
  end if;

  for line_row in
    select rl.*, p.name as product_name
      from ops.receipt_lines rl
      join ops.products p on p.id = rl.product_id and p.tenant_id = p_tenant_id
     where rl.tenant_id = p_tenant_id and rl.receipt_id = p_receipt_id
  loop
    if line_row.expiry_date is not null and line_row.expiry_date < current_date then
      raise exception 'RECEIPT_EXPIRED_LOT: product %', line_row.product_name;
    end if;

    insert into ops.inventory_lots (
      tenant_id, product_id, supplier_product_id, source_document,
      received_at, expires_at, received_quantity, status
    ) values (
      p_tenant_id, line_row.product_id, line_row.supplier_product_id,
      coalesce(receipt_row.document_number, receipt_row.receipt_number),
      receipt_row.received_at, line_row.expiry_date, line_row.received_quantity, 'AVAILABLE'
    ) returning id into lot_id;

    insert into ops.inventory_movements (
      tenant_id, product_id, lot_id, location_id, movement_type,
      quantity, unit_cost, reason_code, reference_type, reference_id, idempotency_key
    ) values (
      p_tenant_id, line_row.product_id, lot_id, line_row.location_id, 'RECEIPT',
      line_row.received_quantity, line_row.unit_cost, null, 'RECEIPT',
      p_receipt_id::text, concat('RECEIPT:', p_receipt_id::text, ':', line_row.id::text)
    ) returning id into movement_id;

    if line_row.purchase_order_line_id is not null then
      update ops.purchase_order_lines
         set received_quantity = received_quantity + line_row.received_quantity
       where tenant_id = p_tenant_id and id = line_row.purchase_order_line_id;
    end if;

    insert into ops.supplier_price_history (
      tenant_id, supplier_product_id, unit_cost, currency, source_type, source_id, recorded_by
    )
    select p_tenant_id, line_row.supplier_product_id, line_row.unit_cost, receipt_row.document_type,
           'RECEIPT', p_receipt_id::text, p_actor_user_id::text
    where line_row.supplier_product_id is not null;

    confirmed_count := confirmed_count + 1;
  end loop;

  update ops.receipts
     set status = 'CONFIRMED'
   where tenant_id = p_tenant_id and id = p_receipt_id;

  insert into audit.events (
    tenant_id, actor_user_id, event_type, aggregate_type, aggregate_id, payload, correlation_id
  ) values (
    p_tenant_id, p_actor_user_id, 'RECEIPT_CONFIRMED', 'RECEIPT', p_receipt_id::text,
    jsonb_build_object('lineCount', confirmed_count, 'documentNumber', receipt_row.document_number),
    p_correlation_id
  );

  return jsonb_build_object('ok', true, 'replay', false, 'receiptId', p_receipt_id, 'lineCount', confirmed_count);
end;
$$;

comment on function ops.confirm_receipt(uuid, uuid, uuid, uuid) is
'Atomic receiving boundary: creates lots, posts receipt movements, updates PO quantities, records supplier price history and audit. Human confirmation required.';
