# JoinOps — MVP checkpoint 02

Fecha: 2026-09-11

## Estado
El MVP avanza desde POS local-first hacia un circuito operacional con caja y pagos.

## Código
- Branch: `joinops/foundation-2026-09-11`
- PR: #44 (Draft)
- POS local-first con cola offline y replay idempotente.
- API de caja para apertura/cierre y auditoría.
- API POS preparada para exigir caja abierta en pagos en efectivo.
- Payments y cash_movements integrados al flujo de venta.

## Base cloud
Proyecto Neon: `JoinOps` (`dry-meadow-93985554`).
Main contiene las tablas `ops.payments`, `ops.cash_movements` y restricción de una sola sesión OPEN por caja/tenant.

## Principios preservados
- No secrets en frontend/repo.
- Persistencia cloud server-side.
- Idempotencia en operaciones críticas.
- Audit Ledger para cambios críticos.
- Offline como continuidad operacional, no como fuente maestra permanente.
- SII fuera de producción hasta certificación.
- `.exe` y PWA comparten backend y contratos.

## Próximo tramo
RBAC real → cierre de caja probado → inventario/FEFO → compras → recetas/producción → Tax Core/SII → migration factory → pruebas de recuperación → instalador Windows estable.
