-- JoinOps MVP: Payment & Cash Hub foundation
-- Additive migration. No destructive operations.
CREATE TABLE IF NOT EXISTS ops.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES kernel.tenants(id),
  order_id uuid NOT NULL REFERENCES ops.orders(id) ON DELETE CASCADE,
  method text NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency char(3) NOT NULL DEFAULT 'CLP',
  status text NOT NULL DEFAULT 'captured',
  idempotency_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS idx_ops_payments_order ON ops.payments(tenant_id, order_id, created_at DESC);

CREATE TABLE IF NOT EXISTS ops.cash_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES kernel.tenants(id),
  cash_session_id uuid NOT NULL REFERENCES ops.cash_sessions(id),
  movement_type text NOT NULL,
  amount_minor bigint NOT NULL CHECK (amount_minor <> 0),
  reference_type text,
  reference_id uuid,
  idempotency_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, idempotency_key)
);
CREATE INDEX IF NOT EXISTS idx_ops_cash_movements_session ON ops.cash_movements(tenant_id, cash_session_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS uq_open_cash_register
  ON ops.cash_sessions(tenant_id, register_code)
  WHERE status='OPEN';
