# JoinOps — Checkpoint Inventory Hardening — 2026-09-11

## Estado
- Inventory Ledger foundation: IMPLEMENTADO.
- Concurrency guard: IMPLEMENTADO en DB mediante lock por bucket y trigger de no-stock-negativo.
- Reason Code Engine foundation: IMPLEMENTADO.
- FEFO allocation domain: IMPLEMENTADO + tests.
- Suppliers/Procurement/Receiving schema: IMPLEMENTADO como foundation.
- Production authentication/RBAC on these new APIs: PENDIENTE DE VALIDACIÓN / IMPLEMENTACIÓN ANTES DE EXPOSICIÓN PRODUCTIVA.

## Correcciones realizadas
### Error 1 — clave primaria con columnas nullable
La primera versión de `005_inventory_concurrency_and_reason_codes.sql` intentó usar `(tenant_id, product_id, lot_id, location_id)` como clave primaria. `lot_id` y `location_id` pueden ser NULL, por lo que ese diseño era inválido para una PK de PostgreSQL.

Corrección: lock con `id` UUID y unique index `NULLS NOT DISTINCT` para representar correctamente el bucket `(tenant, product, lot nullable, location nullable)`.

### Error 2 — control de stock solo en aplicación
El endpoint inicial calculaba saldo y luego insertaba el movimiento. Dos operaciones concurrentes podían leer el mismo saldo antes de insertar y producir una carrera.

Corrección: el control crítico se trasladó a PostgreSQL. El trigger serializa el bucket con `FOR UPDATE` y luego rechaza un saldo negativo. La aplicación sigue validando para UX, pero la base de datos es la última línea de integridad.

### Regla aprendida
Nunca considerar suficiente un `SELECT balance` seguido de `INSERT` para una operación financiera/inventario crítica. Toda invariante crítica debe estar protegida también en la capa transaccional de la base de datos.

## Seguridad
- No se deben exponer nuevos endpoints operacionales a producción sin autenticación, autorización/RBAC, tenant isolation y auditoría.
- `JOINOPS_TENANT_ID` es contexto server-side de foundation/MVP, no sustituto de identidad/autorización productiva.
- IA/OCR puede proponer datos, pero no debe modificar stock, costos, lotes o documentos críticos sin confirmación autorizada.

## Próximo bloque
1. Identity/Auth + RBAC + tenant context.
2. Supplier/Procurement/Receiving service layer.
3. Receipt confirmation transaction: document -> lot -> inventory ledger -> audit.
4. FEFO issue transaction with DB allocation/locking.
5. Audit/event ledger for all critical changes.
6. Security tests and resilience tests.
7. UI Bodega/Compras/Recepción.
