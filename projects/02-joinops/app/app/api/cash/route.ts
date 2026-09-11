import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const tenantId = process.env.JOINOPS_TENANT_ID;

export async function GET() {
  if (!sql || !tenantId) return NextResponse.json({ cloud: false, session: null });
  const rows = await sql`
    SELECT id, register_code, cashier_name, opening_amount, expected_amount, counted_amount, status, opened_at, closed_at
    FROM ops.cash_sessions
    WHERE tenant_id = ${tenantId} AND status = 'OPEN'
    ORDER BY opened_at DESC
    LIMIT 1
  `;
  return NextResponse.json({ cloud: true, session: rows[0] ?? null });
}

export async function POST(request: Request) {
  if (!sql || !tenantId) return NextResponse.json({ ok: false, error: 'Cloud persistence is not configured.' }, { status: 503 });
  const body = await request.json();
  const action = String(body?.action ?? '').toLowerCase();

  if (action === 'open') {
    const registerCode = String(body?.registerCode ?? 'CAJA-01').trim();
    const cashierName = String(body?.cashierName ?? 'Operador').trim();
    const openingAmount = Number(body?.openingAmount ?? 0);
    if (!registerCode || !cashierName || !Number.isSafeInteger(openingAmount) || openingAmount < 0) {
      return NextResponse.json({ ok: false, error: 'Invalid opening payload.' }, { status: 400 });
    }
    const existing = await sql`
      SELECT id FROM ops.cash_sessions
      WHERE tenant_id = ${tenantId} AND register_code = ${registerCode} AND status = 'OPEN'
      LIMIT 1
    `;
    if (existing.length) return NextResponse.json({ ok: true, replay: true, session: existing[0] });
    const rows = await sql`
      INSERT INTO ops.cash_sessions (tenant_id, register_code, cashier_name, opening_amount, expected_amount)
      VALUES (${tenantId}, ${registerCode}, ${cashierName}, ${openingAmount}, ${openingAmount})
      RETURNING id, register_code, cashier_name, opening_amount, expected_amount, status, opened_at
    `;
    await sql`
      INSERT INTO audit.events (tenant_id, event_type, aggregate_type, aggregate_id, payload)
      VALUES (${tenantId}, 'CASH_SESSION_OPENED', 'CASH_SESSION', ${rows[0].id}, ${JSON.stringify({ registerCode, openingAmount })}::jsonb)
    `;
    return NextResponse.json({ ok: true, replay: false, session: rows[0] }, { status: 201 });
  }

  if (action === 'close') {
    const sessionId = String(body?.sessionId ?? '');
    const countedAmount = Number(body?.countedAmount ?? 0);
    if (!sessionId || !Number.isSafeInteger(countedAmount) || countedAmount < 0) return NextResponse.json({ ok: false, error: 'Invalid closing payload.' }, { status: 400 });
    const rows = await sql`
      UPDATE ops.cash_sessions
      SET counted_amount = ${countedAmount}, status = 'CLOSED', closed_at = now()
      WHERE tenant_id = ${tenantId} AND id = ${sessionId} AND status = 'OPEN'
      RETURNING id, register_code, cashier_name, opening_amount, expected_amount, counted_amount, status, opened_at, closed_at
    `;
    if (!rows.length) return NextResponse.json({ ok: false, error: 'Open cash session not found.' }, { status: 409 });
    await sql`
      INSERT INTO audit.events (tenant_id, event_type, aggregate_type, aggregate_id, payload)
      VALUES (${tenantId}, 'CASH_SESSION_CLOSED', 'CASH_SESSION', ${rows[0].id}, ${JSON.stringify({ countedAmount, variance: countedAmount - Number(rows[0].expected_amount) })}::jsonb)
    `;
    return NextResponse.json({ ok: true, session: rows[0] });
  }

  return NextResponse.json({ ok: false, error: 'Unsupported cash action.' }, { status: 400 });
}
