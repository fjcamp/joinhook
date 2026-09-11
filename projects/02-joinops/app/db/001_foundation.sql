CREATE SCHEMA IF NOT EXISTS kernel;
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS security;
CREATE SCHEMA IF NOT EXISTS ops;

CREATE TABLE IF NOT EXISTS kernel.tenants (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS kernel.organizations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES kernel.tenants(id), name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS security.users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES kernel.tenants(id), email text NOT NULL, display_name text, status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(tenant_id,email));
CREATE TABLE IF NOT EXISTS security.roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES kernel.tenants(id), code text NOT NULL, name text NOT NULL, UNIQUE(tenant_id,code));
CREATE TABLE IF NOT EXISTS security.user_roles (user_id uuid NOT NULL REFERENCES security.users(id), role_id uuid NOT NULL REFERENCES security.roles(id), created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,role_id));
CREATE TABLE IF NOT EXISTS audit.events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES kernel.tenants(id), actor_user_id uuid REFERENCES security.users(id), event_type text NOT NULL, aggregate_type text, aggregate_id text, payload jsonb NOT NULL DEFAULT '{}'::jsonb, correlation_id uuid, occurred_at timestamptz NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_audit_events_tenant_time ON audit.events(tenant_id,occurred_at DESC);
CREATE TABLE IF NOT EXISTS core.business_partners (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES kernel.tenants(id), kind text NOT NULL, legal_name text NOT NULL, tax_id text, status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS core.products (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES kernel.tenants(id), code text NOT NULL, name text NOT NULL, category_code text, base_unit text NOT NULL, status text NOT NULL DEFAULT 'active', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(tenant_id,code));
CREATE TABLE IF NOT EXISTS ops.orders (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tenant_id uuid NOT NULL REFERENCES kernel.tenants(id), order_number text NOT NULL, status text NOT NULL DEFAULT 'draft', total_minor bigint NOT NULL DEFAULT 0, currency char(3) NOT NULL DEFAULT 'CLP', idempotency_key text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(tenant_id,idempotency_key));
