import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const tenantId = process.env.JOINOPS_TENANT_ID;

type MovementAction = 'SALE' | 'REFUND' | 'CASH_IN' | 'CASH_OUT';

export async function GET() {
  if (!sql || !tenantId) return NextResponse.json({ cloud: false, sessions: [], openSession: null });

  const sessions = await sql`
    SELECT id, register_code, cashier_name, opening_amount, expected_amount,
           counted_amount, variance_amount, reconciliation_status,
           status, opened_at, closed_at
    FROM ops.cash_sessions
    WHERE tenant_id = ${tenantId}
    ORDER BY opened_at DESC
    LIMIT 20
  `;

  return NextResponse.json({
    cloud: true,
    sessions,
    openSession: sessions.find((session) => session.status === 'OPEN') ?? null,
  });
}

export async function POST(request: Request) {
  if (!sql || !tenantId) return NextResponse.json({ ok: false, error: 'Cloud persistence is not configured.' }, { status: 503 });

  const body = await request.json();
  const action = String(body?.action ?? 'open').toLowerCase();

  if (action === 'open') {
    const registerCode = String(body?.registerCode ?? 'POS-01').trim();
    const cashierName = String(body?.cashierName ?? 'Operador local').trim();
    const openingAmount = Number(body?.openingAmount ?? 0);

    if (!registerCode || !cashierName || !Number.isSafeInteger(openingAmount) || openingAmount < 0) {
      return NextResponse.json({ ok: false, error: 'Invalid cash opening.' }, { status: 400 });
    }

    try {
      const session = await sql`
        INSERT INTO ops.cash_sessions
          (tenant_id, register_code, cashier_name, opening_amount, expected_amount, status)
        VALUES
          (${tenantId}, ${registerCode}, ${cashierName}, ${openingAmount}, ${openingAmount}, 'OPEN')
        RETURNING id, register_code, cashier_name, opening_amount, expected_amount,
                  counted_amount, variance_amount, reconciliation_status, status, opened_at
      `;

      await sql`
        INSERT INTO ops.cash_movements
          (tenant_id, cash_session_id, movement_type, amount_minor, idempotency_key)
        VALUES
          (${tenantId}, ${session[0].id}, 'OPENING', ${openingAmount}, ${`OPEN-${session[0].id}`})
      `;

      await sql`
        INSERT INTO audit.events
          (tenant_id, event_type, aggregate_type, aggregate_id, payload)
        VALUES
          (${tenantId}, 'CASH_SESSION_OPENED', 'CASH_SESSION', ${session[0].id},
           ${JSON.stringify({ registerCode, cashierName, openingAmount })}::jsonb)
      `;

      return NextResponse.json({ ok: true, replay: false, session: session[0] }, { status: 201 });
    } catch {
      return NextResponse.json({ ok: false, error: 'Cash register already has an open session or the operation failed.' }, { status: 409 });
    }
  }

  if (action === 'movement') {
    const cashSessionId = String(body?.cashSessionId ?? '');
    const movementType = String(body?.movementType ?? '').toUpperCase() as MovementAction;
    const amountMinor = Number(body?.amountMinor ?? 0);
    const idempotencyKey = String(body?.idempotencyKey ?? '');

    if (!cashSessionId || !['SALE', 'REFUND', 'CASH_IN', 'CASH_OUT'].includes(movementType) || !Number.isSafeInteger(amountMinor) || amountMinor <= 0 || !idempotencyKey) {
      return NextResponse.json({ ok: false, error: 'Invalid cash movement.' }, { status: 400 });
    }

    const signedAmount = movementType === 'CASH_OUT' || movementType === 'REFUND' ? -amountMinor : amountMinor;
    const existing = await sql`
      SELECT id, cash_session_id, movement_type, amount_minor, reference_type, reference_id, created_at
      FROM ops.cash_movements
      WHERE tenant_id = ${tenantId} AND idempotency_key = ${idempotencyKey}
      LIMIT 1
    `;
    if (existing.length) return NextResponse.json({ ok: true, replay: true, movement: existing[0] });

    const session = await sql`
      SELECT id FROM ops.cash_sessions
      WHERE tenant_id = ${tenantId} AND id = ${cashSessionId} AND status = 'OPEN'
      LIMIT 1
    `;
    if (!session.length) return NextResponse.json({ ok: false, error: 'Cash session is not open for this tenant.' }, { status: 409 });

    const referenceType = body?.referenceType ? String(body.referenceType) : null;
    const referenceId = body?.referenceId ? String(body.referenceId) : null;
    try {
      const movement = await sql`
        INSERT INTO ops.cash_movements
          (tenant_id, cash_session_id, movement_type, amount_minor, reference_type, reference_id, idempotency_key)
        VALUES
          (${tenantId}, ${cashSessionId}, ${movementType}, ${signedAmount}, ${referenceType}, ${referenceId}, ${idempotencyKey})
        RETURNING id, cash_session_id, movement_type, amount_minor, reference_type, reference_id, created_at
      `;
      return NextResponse.json({ ok: true, replay: false, movement: movement[0] }, { status: 201 });
    } catch {
      return NextResponse.json({ ok: false, error: 'Cash movement could not be recorded.' }, { status: 409 });
    }
  }

  if (action === 'close') {
    const sessionId = String(body?.sessionId ?? '');
    const countedAmount = Number(body?.countedAmount ?? 0);
    if (!sessionId || !Number.isSafeInteger(countedAmount) || countedAmount < 0) {
      return NextResponse.json({ ok: false, error: 'Invalid closing payload.' }, { status: 400 });
    }

    const existing = await sql`
      SELECT id, register_code, cashier_name, opening_amount, expected_amount, counted_amount,
             variance_amount, reconciliation_status, status, opened_at, closed_at
      FROM ops.cash_sessions
      WHERE tenant_id = ${tenantId} AND id = ${sessionId}
      LIMIT 1
    `;
    if (!existing.length) return NextResponse.json({ ok: false, error: 'Cash session not found.' }, { status: 404 });
    if (existing[0].status === 'CLOSED') {
      if (Number(existing[0].counted_amount) === countedAmount) {
        return NextResponse.json({ ok: true, replay: true, session: existing[0] });
      }
      return NextResponse.json({ ok: false, error: 'Cash session is already closed with a different count.' }, { status: 409 });
    }

    const closed = await sql`
      WITH locked_session AS (
        SELECT id, opening_amount
        FROM ops.cash_sessions
        WHERE tenant_id = ${tenantId} AND id = ${sessionId} AND status = 'OPEN'
        FOR UPDATE
      ), movement_total AS (
        SELECT COALESCE(SUM(cm.amount_minor), 0)::bigint AS delta
        FROM ops.cash_movements cm
        JOIN locked_session ls ON ls.id = cm.cash_session_id
        WHERE cm.tenant_id = ${tenantId} AND cm.movement_type <> 'OPENING'
      )
      UPDATE ops.cash_sessions cs
      SET expected_amount = (ls.opening_amount + mt.delta),
          counted_amount = ${countedAmount},
          variance_amount = ${countedAmount} - (ls.opening_amount + mt.delta),
          reconciliation_status = CASE
            WHEN ${countedAmount} = (ls.opening_amount + mt.delta) THEN 'BALANCED'
            WHEN ${countedAmount} > (ls.opening_amount + mt.delta) THEN 'OVER'
            ELSE 'SHORT'
          END,
          status = 'CLOSED',
          closed_at = now()
      FROM locked_session ls, movement_total mt
      WHERE cs.id = ls.id AND cs.status = 'OPEN'
      RETURNING cs.id, cs.register_code, cs.cashier_name, cs.opening_amount,
                cs.expected_amount, cs.counted_amount, cs.variance_amount,
                cs.reconciliation_status, cs.status, cs.opened_at, cs.closed_at
    `;

    if (!closed.length) return NextResponse.json({ ok: false, error: 'Cash session was closed concurrently.' }, { status: 409 });

    await sql`
      INSERT INTO audit.events
        (tenant_id, event_type, aggregate_type, aggregate_id, payload)
      VALUES
        (${tenantId}, 'CASH_SESSION_CLOSED', 'CASH_SESSION', ${closed[0].id},
         ${JSON.stringify({
           countedAmount,
           expectedAmount: Number(closed[0].expected_amount),
           varianceAmount: Number(closed[0].variance_amount),
           reconciliationStatus: closed[0].reconciliation_status,
         })}::jsonb)
    `;

    return NextResponse.json({ ok: true, replay: false, session: closed[0] });
  }

  return NextResponse.json({ ok: false, error: 'Unsupported cash action.' }, { status: 400 });
}
