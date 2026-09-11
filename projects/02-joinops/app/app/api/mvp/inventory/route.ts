import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const tenantId = process.env.JOINOPS_TENANT_ID;

const movementTypes = [
  'RECEIPT', 'ISSUE', 'TRANSFER_IN', 'TRANSFER_OUT', 'SALE', 'WASTE',
  'RETURN_TO_SUPPLIER', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT', 'CONSUMPTION',
] as const;

export async function GET(request: Request) {
  if (!sql || !tenantId) return NextResponse.json({ cloud: false, products: [], balances: [] });
  const url = new URL(request.url);
  const productId = url.searchParams.get('productId');

  const products = await sql`
    SELECT id, product_code, name, category, base_unit, purchase_unit, recipe_unit,
           attributes, nutrition, reference_image_url, active, created_at, updated_at
    FROM ops.products
    WHERE tenant_id = ${tenantId} AND active = true
      AND (${productId}::uuid IS NULL OR id = ${productId}::uuid)
    ORDER BY name
    LIMIT 200
  `;

  const balances = await sql`
    SELECT product_id, lot_id, location_id, quantity
    FROM ops.inventory_balance
    WHERE tenant_id = ${tenantId}
      AND (${productId}::uuid IS NULL OR product_id = ${productId}::uuid)
      AND quantity <> 0
    ORDER BY product_id
  `;

  return NextResponse.json({ cloud: true, products, balances });
}

export async function POST(request: Request) {
  if (!sql || !tenantId) return NextResponse.json({ ok: false, error: 'Cloud persistence is not configured.' }, { status: 503 });
  const body = await request.json();
  const action = String(body?.action ?? '').toLowerCase();

  if (action === 'product') {
    const productCode = String(body?.productCode ?? '').trim();
    const name = String(body?.name ?? '').trim();
    const baseUnit = String(body?.baseUnit ?? '').trim();
    if (!productCode || !name || !baseUnit) {
      return NextResponse.json({ ok: false, error: 'productCode, name and baseUnit are required.' }, { status: 400 });
    }
    try {
      const result = await sql`
        INSERT INTO ops.products
          (tenant_id, product_code, name, category, base_unit, purchase_unit, recipe_unit, attributes, nutrition, reference_image_url)
        VALUES
          (${tenantId}, ${productCode}, ${name}, ${body?.category ? String(body.category) : null}, ${baseUnit},
           ${body?.purchaseUnit ? String(body.purchaseUnit) : null}, ${body?.recipeUnit ? String(body.recipeUnit) : null},
           ${JSON.stringify(body?.attributes ?? {})}::jsonb, ${JSON.stringify(body?.nutrition ?? {})}::jsonb,
           ${body?.referenceImageUrl ? String(body.referenceImageUrl) : null})
        RETURNING id, product_code, name, category, base_unit, purchase_unit, recipe_unit, attributes, nutrition, reference_image_url, active, created_at, updated_at
      `;
      return NextResponse.json({ ok: true, product: result[0] }, { status: 201 });
    } catch {
      return NextResponse.json({ ok: false, error: 'Product could not be created. Product code may already exist.' }, { status: 409 });
    }
  }

  if (action === 'movement') {
    const productId = String(body?.productId ?? '');
    const movementType = String(body?.movementType ?? '').toUpperCase();
    const quantity = Number(body?.quantity ?? 0);
    const idempotencyKey = String(body?.idempotencyKey ?? '').trim();
    if (!productId || !movementTypes.includes(movementType as typeof movementTypes[number]) || !Number.isFinite(quantity) || quantity <= 0 || !idempotencyKey) {
      return NextResponse.json({ ok: false, error: 'Invalid inventory movement.' }, { status: 400 });
    }

    const existing = await sql`
      SELECT id, product_id, lot_id, location_id, movement_type, quantity, unit_cost, reason_code, reference_type, reference_id, occurred_at
      FROM ops.inventory_movements
      WHERE tenant_id = ${tenantId} AND idempotency_key = ${idempotencyKey}
      LIMIT 1
    `;
    if (existing.length) return NextResponse.json({ ok: true, replay: true, movement: existing[0] });

    const product = await sql`
      SELECT id FROM ops.products WHERE tenant_id = ${tenantId} AND id = ${productId} AND active = true LIMIT 1
    `;
    if (!product.length) return NextResponse.json({ ok: false, error: 'Product not found for this tenant.' }, { status: 404 });

    const negative = ['ISSUE','TRANSFER_OUT','SALE','WASTE','RETURN_TO_SUPPLIER','ADJUSTMENT_OUT','CONSUMPTION'].includes(movementType);
    if (negative) {
      const balance = await sql`
        SELECT COALESCE(SUM(CASE WHEN movement_type IN ('RECEIPT','TRANSFER_IN','ADJUSTMENT_IN') THEN quantity ELSE -quantity END), 0) AS quantity
        FROM ops.inventory_movements
        WHERE tenant_id = ${tenantId} AND product_id = ${productId}
          AND (${body?.lotId ? String(body.lotId) : null}::uuid IS NULL OR lot_id = ${body.lotId ? String(body.lotId) : null}::uuid)
      `;
      if (Number(balance[0].quantity) < quantity) {
        return NextResponse.json({ ok: false, error: 'Insufficient inventory balance.' }, { status: 409 });
      }
    }

    try {
      const movement = await sql`
        INSERT INTO ops.inventory_movements
          (tenant_id, product_id, lot_id, location_id, movement_type, quantity, unit_cost, reason_code, reference_type, reference_id, idempotency_key)
        VALUES
          (${tenantId}, ${productId}, ${body?.lotId ? String(body.lotId) : null}, ${body?.locationId ? String(body.locationId) : null},
           ${movementType}, ${quantity}, ${body?.unitCost == null ? null : Number(body.unitCost)},
           ${body?.reasonCode ? String(body.reasonCode) : null}, ${body?.referenceType ? String(body.referenceType) : null},
           ${body?.referenceId ? String(body.referenceId) : null}, ${idempotencyKey})
        RETURNING id, product_id, lot_id, location_id, movement_type, quantity, unit_cost, reason_code, reference_type, reference_id, occurred_at
      `;
      return NextResponse.json({ ok: true, replay: false, movement: movement[0] }, { status: 201 });
    } catch {
      return NextResponse.json({ ok: false, error: 'Inventory movement could not be recorded.' }, { status: 409 });
    }
  }

  return NextResponse.json({ ok: false, error: 'Unsupported inventory action.' }, { status: 400 });
}
