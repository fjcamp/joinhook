import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const tenantId = process.env.JOINOPS_TENANT_ID;

export async function GET() {
  if (!sql || !tenantId) {
    return NextResponse.json({ cloud: false, products: [] });
  }

  const products = await sql`
    SELECT id, code, name, category_code, base_unit
    FROM core.products
    WHERE tenant_id = ${tenantId} AND status = 'active'
    ORDER BY name
  `;

  return NextResponse.json({ cloud: true, products });
}

export async function POST(request: Request) {
  if (!sql || !tenantId) {
    return NextResponse.json({ ok: false, cloud: false, error: 'Cloud persistence is not configured.' }, { status: 503 });
  }

  const body = await request.json();
  const idempotencyKey = String(body?.idempotencyKey ?? '');
  const items = Array.isArray(body?.items) ? body.items : [];
  const totalMinor = Number(body?.totalMinor ?? 0);

  if (!idempotencyKey || !items.length || !Number.isSafeInteger(totalMinor) || totalMinor < 0) {
    return NextResponse.json({ ok: false, error: 'Invalid order payload.' }, { status: 400 });
  }

  const existing = await sql`
    SELECT id, order_number, status, total_minor
    FROM ops.orders
    WHERE tenant_id = ${tenantId} AND idempotency_key = ${idempotencyKey}
    LIMIT 1
  `;
  if (existing.length) return NextResponse.json({ ok: true, replay: true, order: existing[0] });

  const orderNumber = `POS-${Date.now()}`;
  const order = await sql`
    INSERT INTO ops.orders (tenant_id, order_number, status, total_minor, currency, idempotency_key)
    VALUES (${tenantId}, ${orderNumber}, 'paid', ${totalMinor}, 'CLP', ${idempotencyKey})
    RETURNING id, order_number, status, total_minor, currency, created_at
  `;

  for (const item of items) {
    const productId = String(item?.productId ?? '');
    const quantity = Number(item?.quantity ?? 0);
    const unitMinor = Number(item?.unitMinor ?? 0);
    if (!productId || !(quantity > 0) || !Number.isSafeInteger(unitMinor) || unitMinor < 0) {
      return NextResponse.json({ ok: false, error: 'Invalid order item.' }, { status: 400 });
    }
    await sql`
      INSERT INTO ops.order_items (tenant_id, order_id, product_id, quantity, unit_price, line_total)
      VALUES (${tenantId}, ${order[0].id}, ${productId}, ${quantity}, ${unitMinor}, ${Math.round(quantity * unitMinor)})
    `;
  }

  await sql`
    INSERT INTO audit.events (tenant_id, event_type, entity_type, entity_id, payload)
    VALUES (${tenantId}, 'ORDER_CREATED', 'ORDER', ${order[0].id}, ${JSON.stringify({ source: 'joinops-mvp', idempotencyKey, totalMinor })}::jsonb)
  `;

  return NextResponse.json({ ok: true, replay: false, order: order[0] }, { status: 201 });
}
