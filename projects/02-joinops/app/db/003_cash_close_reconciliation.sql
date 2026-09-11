-- JoinOps: operational cash close + reconciliation
-- Additive and reversible. No destructive operations.
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
