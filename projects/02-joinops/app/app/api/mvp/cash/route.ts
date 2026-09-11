import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const tenantId = process.env.JOINOPS_TENANT_ID;

export async function GET() {
  if (!sql || !tenantId) return NextResponse.json({ cloud: false, session: null });
  const sessions = await sql`
    SELECT id, register_code, cashier_name, opening_amount, expected_amount, counted_amount, status, opened_at, closed_at
    FROM ops.cash_sessions
    WHERE tenant_id = ${tenantId}
    ORDER BY opened_at DESC
    LIMIT 10
  `;
  return NextResponse.json({ cloud: true, sessions });
}

export async function POST(request: Request) {
  if (!sql || !tenantId) return NextResponse.json({ ok: false, error: 'Cloud persistence is not configured.' }, { status: 503 });
  const body = await request.json();
  const registerCode = String(body?.registerCode ?? 'POS-01').trim();
  const cashierName = String(body?.cashierName ?? '').trim();
  const openingAmount = Number(body?.openingAmount ?? 0);
  if (!registerCode || !cashierName || !Number.isSafeInteger(openingAmount) || openingAmount < 0) {
    return NextResponse.json({ ok: false, error: 'Invalid cash opening.' }, { status: 400 });
  }
  try {
    const session = await sql`
      INSERT INTO ops.cash_sessions (tenant_id, register_code, cashier_name, opening_amount, expected_amount, status)
      VALUES (${tenantId}, ${registerCode}, ${cashierName}, ${openingAmount}, ${openingAmount}, 'OPEN')
      RETURNING id, register_code, cashier_name, opening_amount, expected_amount, status, opened_at
    `;
    await sql`
      INSERT INTO ops.cash_movements (tenant_id, cash_session_id, movement_type, amount_minor, idempotency_key)
      VALUES (${tenantId}, ${session[0].id}, 'OPENING', ${openingAmount}, ${`OPEN-${session[0].id}`})
    `;
    await sql`
      INSERT INTO audit.events (tenant_id, event_type, aggregate_type, aggregate_id, payload)
      VALUES (${tenantId}, 'CASH_SESSION_OPENED', 'CASH_SESSION', ${session[0].id}, ${JSON.stringify({ registerCode, cashierName, openingAmount })}::jsonb)
    `;
    return NextResponse.json({ ok: true, session: session[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Cash register already has an open session or the operation failed.' }, { status: 409 });
  }
}
