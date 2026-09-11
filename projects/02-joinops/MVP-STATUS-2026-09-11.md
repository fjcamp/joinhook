# JoinOps — estado MVP

Fecha: 2026-09-11

## Estado de implementación

El desarrollo activo continúa sobre la rama `joinops/foundation-2026-09-11` y PR #44.

### Implementado
- Foundation `kernel/core/security/audit/ops`.
- Neon PostgreSQL cloud project `JoinOps`.
- Catálogo de productos con tenant.
- POS no-scroll.
- Carrito y totalización CLP.
- Idempotencia de órdenes.
- Validación server-side de tenant/productos/total.
- Cola local para pérdida de conectividad.
- Replay de la cola al volver la conectividad.
- Audit Ledger para eventos críticos del cobro.
- `ops.payments` como base del Payment & Settlement Hub.
- `ops.cash_sessions` + `ops.cash_movements`.
- Regla de una sola sesión de caja abierta por registro/tenant.
- Apertura de caja desde la interfaz MVP.
- Cobro POS conectado a pago y movimiento de caja.
- Shell Windows Electron + NSIS para instalador `.exe`.
- Workflow CI para typecheck/build web + instalador Windows.

## Arquitectura objetivo

`Windows .exe / PWA → JoinOps UI → API server-side → PostgreSQL cloud`

Offline:

`UI → cola local → recuperación de red → replay idempotente → API → PostgreSQL`

## Control de seguridad

- No incluir secretos en frontend/repositorio.
- `DATABASE_URL` solo server-side.
- Tenant isolation server-side pendiente de identidad real.
- SII permanece fuera de producción hasta certificación.
- Operaciones críticas usan idempotencia y auditoría.

## Antes de declarar MVP productivo

- Identity/RBAC real.
- Cierre de caja, arqueo, diferencias y autorizaciones.
- Payment & Settlement Hub ampliado a múltiples medios y conciliación.
- Inventario físico, lotes, FEFO/FIFO y costo.
- Compras, recepción y proveedores.
- Recetas y producción.
- Migration Factory.
- Tax Core + integración/certificación SII.
- Backup/restore drills.
- Observabilidad, alertas y recuperación.
- Suite automatizada de pruebas de dominio/integración/seguridad/concurrencia/offline recovery.
- Deployment cloud productivo y URL definitiva para `.exe`.

## Backup

Este estado queda respaldado mediante GitHub en el PR #44. Neon mantiene además el snapshot previo `joinops-mvp-2026-09-11`; al 2026-09-11 el proyecto reporta límite de snapshots, por lo que no se creó un segundo snapshot en esta ronda.
