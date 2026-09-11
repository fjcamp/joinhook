import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const tenantId = process.env.JOINOPS_TENANT_ID;

export async function GET() {
  if (!sql || !tenantId) return NextResponse.json({ cloud: false, products: [] });
  const products = await sql`
    SELECT id, code, name, category_code, base_unit, sale_price_minor AS "priceMinor"
    FROM core.products WHERE tenant_id = ${tenantId} AND status = 'active' ORDER BY name
  `;
  return NextResponse.json({ cloud: true, products });
}

export async function POST(request: Request) {
  if (!sql || !tenantId) return NextResponse.json({ ok: false, cloud: false, error: 'Cloud persistence is not configured.' }, { status: 503 });
  const body = await request.json();
  const idempotencyKey = String(body?.idempotencyKey ?? '');
  const items = Array.isArray(body?.items) ? body.items : [];
  const totalMinor = Number(body?.totalMinor ?? 0);
  if (!idempotencyKey || !items.length || !Number.isSafeInteger(totalMinor) || totalMinor < 0) return NextResponse.json({ ok: false, error: 'Invalid order payload.' }, { status: 400 });

  const normalized = items.map((item: any) => ({ productCode: String(item?.productCode ?? ''), quantity: Number(item?.quantity ?? 0), unitMinor: Number(item?.unitMinor ?? 0) }));
  if (normalized.some(x => !x.productCode || !(x.quantity > 0) || !Number.isSafeInteger(x.unitMinor) || x.unitMinor < 0)) return NextResponse.json({ ok: false, error: 'Invalid order item.' }, { status: 400 });
  const calculated = normalized.reduce((sum, x) => sum + Math.round(x.quantity * x.unitMinor), 0);
  if (calculated !== totalMinor) return NextResponse.json({ ok: false, error: 'Order total mismatch.' }, { status: 400 });

  const existing = await sql`SELECT id, order_number, status, total_minor FROM ops.orders WHERE tenant_id = ${tenantId} AND idempotency_key = ${idempotencyKey} LIMIT 1`;
  if (existing.length) return NextResponse.json({ ok: true, replay: true, order: existing[0] });

  const codes = normalized.map(x => x.productCode);
  const validProducts = await sql`SELECT code FROM core.products WHERE tenant_id = ${tenantId} AND status = 'active' AND code = ANY(${codes}::text[])`;
  if (validProducts.length !== new Set(codes).size) return NextResponse.json({ ok: false, error: 'One or more products are not valid for this tenant.' }, { status: 409 });

  const orderNumber = `POS-${Date.now()}`;
  const itemsJson = JSON.stringify(normalized);
  const result = await sql`
    WITH new_order AS (
      INSERT INTO ops.orders (tenant_id, order_number, status, total_minor, currency, idempotency_key)
      VALUES (${tenantId}, ${orderNumber}, 'paid', ${totalMinor}, 'CLP', ${idempotencyKey})
      RETURNING id, order_number, status, total_minor, currency, created_at
    ), inserted_items AS (
      INSERT INTO ops.order_items (tenant_id, order_id, product_id, quantity, unit_price, line_total)
      SELECT ${tenantId}, o.id, p.id, (item->>'quantity')::numeric, (item->>'unitMinor')::numeric,
             ROUND((item->>'quantity')::numeric * (item->>'unitMinor')::numeric)
      FROM new_order o
      CROSS JOIN jsonb_array_elements(${itemsJson}::jsonb) item
      JOIN core.products p ON p.tenant_id = ${tenantId} AND p.code = item->>'productCode' AND p.status = 'active'
      RETURNING id
    ), audit_row AS (
      INSERT INTO audit.events (tenant_id, event_type, aggregate_type, aggregate_id, payload)
      SELECT ${tenantId}, 'ORDER_CREATED', 'ORDER', o.id::text,
             ${JSON.stringify({ source: 'joinops-mvp', idempotencyKey, totalMinor })}::jsonb
      FROM new_order o
      RETURNING id
    )
    SELECT * FROM new_order
  `;
  return NextResponse.json({ ok: true, replay: false, order: result[0] }, { status: 201 });
}
