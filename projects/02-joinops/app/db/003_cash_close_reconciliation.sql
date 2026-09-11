-- JoinOps: operational cash close + reconciliation
-- Additive and reversible. No destructive operations.

-- The MVP already depended on this table; keep the migration self-contained so
-- a fresh PostgreSQL environment can reproduce the cash foundation.
CREATE TABLE IF NOT EXISTS ops.cash_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES kernel.tenants(id),
  register_code text NOT NULL,
  cashier_name text NOT NULL,
  opening_amount bigint NOT NULL DEFAULT 0 CHECK (opening_amount >= 0),
  expected_amount bigint NOT NULL DEFAULT 0,
  counted_amount bigint,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','CLOSED')),
  opened_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_open_cash_register
  ON ops.cash_sessions(tenant_id, register_code)
  WHERE status = 'OPEN';

ALTER TABLE ops.cash_sessions
  ADD COLUMN IF NOT EXISTS variance_amount bigint,
  ADD COLUMN IF NOT EXISTS reconciliation_status text;

UPDATE ops.cash_sessions
SET reconciliation_status = CASE
  WHEN status = 'CLOSED' AND counted_amount IS NOT NULL AND counted_amount = expected_amount THEN 'BALANCED'
  WHEN status = 'CLOSED' AND counted_amount IS NOT NULL AND counted_amount > expected_amount THEN 'OVER'
  WHEN status = 'CLOSED' AND counted_amount IS NOT NULL AND counted_amount < expected_amount THEN 'SHORT'
  ELSE reconciliation_status
END,
variance_amount = CASE
  WHEN counted_amount IS NOT NULL THEN counted_amount - expected_amount
  ELSE variance_amount
END
WHERE reconciliation_status IS NULL OR variance_amount IS NULL;

CREATE INDEX IF NOT EXISTS idx_ops_cash_sessions_status_time
  ON ops.cash_sessions(tenant_id, status, opened_at DESC);

CREATE INDEX IF NOT EXISTS idx_ops_cash_movements_session_type
  ON ops.cash_movements(tenant_id, cash_session_id, movement_type, created_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'cash_movements_operational_type_ck'
      AND conrelid = 'ops.cash_movements'::regclass
  ) THEN
    ALTER TABLE ops.cash_movements
      ADD CONSTRAINT cash_movements_operational_type_ck
      CHECK (movement_type IN ('OPENING','SALE','REFUND','CASH_IN','CASH_OUT'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION ops.ensure_cash_session_open()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM ops.cash_sessions
    WHERE id = NEW.cash_session_id
      AND tenant_id = NEW.tenant_id
      AND status = 'OPEN'
  ) THEN
    RAISE EXCEPTION 'Cash session is not open for this tenant';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cash_movement_requires_open_session ON ops.cash_movements;
CREATE TRIGGER trg_cash_movement_requires_open_session
BEFORE INSERT ON ops.cash_movements
FOR EACH ROW EXECUTE FUNCTION ops.ensure_cash_session_open();
