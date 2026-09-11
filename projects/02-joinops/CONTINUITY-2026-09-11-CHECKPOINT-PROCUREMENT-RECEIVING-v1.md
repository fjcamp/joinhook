# JoinOps — Procurement / Receiving Checkpoint v1

## Implementado en esta slice
- Supplier master and contacts.
- Supplier quotes and quote lines.
- Purchase orders and lines.
- Receiving documents and lines.
- Supplier price history.
- Atomic `ops.confirm_receipt(...)` transaction.
- Lot creation and inventory receipt posting at confirmation.
- Purchase-order received quantities.
- Supplier price history capture from confirmed receiving.
- Audit event `RECEIPT_CONFIRMED`.
- Procurement invariants against silent over-receiving.
- Purchase-order status synchronization for partial/complete receiving.

## Process boundary
`Solicitud -> Cotización -> Orden de compra -> Aprobación -> Recepción borrador -> Revisión humana -> Confirmación -> Lote -> Inventory Ledger -> Precio histórico -> Auditoría -> impacto posterior en Finanzas/Contabilidad`.

Inventory must not be affected by OCR/camera capture, draft receiving, or unconfirmed data.

## Root-cause prevention
- Critical state transitions happen in database transactions.
- The application may validate for user experience, but DB constraints/triggers/functions protect invariants.
- Idempotency keys are mandatory for ledger-affecting writes.
- Human confirmation is required before critical inventory mutation.
- Every critical transition has an audit event.

## Pending before production
- Real identity/session context instead of server-only tenant environment.
- RBAC policy enforcement at API/service boundary.
- Row-level tenant isolation and authorization tests.
- Document capture/OCR pipeline with malware scanning and retention rules.
- Full receiving UI.
- Finance integration and tax/document validation.
- End-to-end tests against Neon/PostgreSQL.
