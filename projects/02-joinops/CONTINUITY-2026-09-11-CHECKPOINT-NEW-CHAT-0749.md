# JoinOps — checkpoint de continuidad

Fecha: 2026-09-11 07:49 America/Santiago

## Estado técnico confirmado
- Desarrollo activo en branch `joinops/foundation-2026-09-11` del repo `fjcamp/joinhook`.
- PR #44: `JoinOps MVP: foundation + POS local-first + Windows shell`.
- El PR permanece Draft y no debe fusionarse hasta completar validación.
- Último checkpoint conocido antes de este documento: `9dfad4f9ed803bd15553102f5efaf10b44e158ce`.
- Se incorporaron después cambios funcionales de POS/Caja/Pagos y este checkpoint.

## Base cloud
- Neon project: `JoinOps`.
- Project ID: `dry-meadow-93985554`.
- Default branch: `br-blue-sky-axozi63p`.
- PostgreSQL cloud con schemas `kernel`, `core`, `security`, `audit`, `ops`.
- Existe snapshot manual previo `joinops-mvp-2026-09-11`.
- En una ronda posterior la plataforma mostró limitación de snapshots; no asumir que existe un snapshot más reciente.

## Funcionalidad MVP implementada
- Dashboard Business OS sin scroll.
- Catálogo de productos.
- POS: selección, carrito, cantidades y total CLP.
- Venta con idempotencia.
- Auditoría de creación/pago.
- Cola local para continuidad sin red.
- Replay al recuperar conectividad.
- Validación server-side de tenant, productos, cantidades y total.
- Shell Windows Electron + NSIS preparado para `.exe` x64.
- GitHub Actions preparado para typecheck/build web + instalador Windows.
- Caja: apertura de sesión `POS-01` desde UI.
- Pago en efectivo exige una sesión de caja abierta.
- Payment Hub inicial: `ops.payments`.
- Cash movements: `ops.cash_movements`.
- Restricción: una caja abierta por registro y tenant.

## Arquitectura local/cloud acordada
`Windows .exe / PWA → JoinOps UI → API cloud → PostgreSQL`

Con caída de red:
`UI → cola local → recuperación → replay idempotente → API → PostgreSQL`

El `.exe` nunca debe contener `DATABASE_URL` ni credenciales privilegiadas.

## Próximas prioridades obligatorias
1. Cierre de caja y conciliación operacional.
2. Inventario ledger conectado a ventas y recepción.
3. RBAC/identidad real y tenant isolation basada en sesión.
4. Payment & Settlement Hub más completo.
5. Bodega/lot/FEFO/FIFO.
6. Compras, recetas y producción.
7. Migration & Onboarding Factory.
8. Tax Core + SII certification environment; nunca producción SII sin certificación.
9. Observabilidad, backups y restore drills.
10. Pruebas automatizadas de dominio, integración, concurrencia, seguridad, offline/replay y recuperación.
11. Deploy cloud estable con dominio productivo real.
12. Construcción, prueba y validación final del instalador Windows `.exe`.

## Regla de desarrollo
No declarar el MVP estable/productivo hasta tener pruebas verificables y los controles críticos anteriores. Toda modificación de base debe ser reversible, auditable y preferentemente probada en rama temporal antes de aplicar a `main`.

## Regla de continuidad
Este archivo es un checkpoint técnico para retomar el trabajo en un nuevo chat. Debe leerse junto con:
- `projects/02-joinops/CONTINUITY-2026-09-11-BITACORA-MAESTRA-MIGRACION-SII.md`
- `projects/02-joinops/CONTINUITY-2026-09-11-BODEGA-ABASTECIMIENTO.md`
- `projects/02-joinops/CONTINUITY-2026-09-11-MIGRATION-INTELLIGENCE.md`
- `projects/02-joinops/INTEGRATIONS-SII-CHILE-2026-09-11.md`
- `projects/02-joinops/DEVELOPMENT-2026-09-11-START.md`

## Preferencia del usuario
El usuario solicita que el desarrollo continúe de forma autónoma hasta conseguir un MVP completo y estable, y que se informe diariamente. La comunicación durante el desarrollo debe ser mínima salvo bloqueos o decisiones que requieran autorización.
