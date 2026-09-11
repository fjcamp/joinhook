# JoinOps — Checkpoint Inventory Ledger — 2026-09-11

## Estado
IMPLEMENTADO — primera base ejecutable del Inventory Ledger y Product Master.

## Implementado
- `ops.products` como Product Master con identidad JoinOps independiente del SKU del proveedor.
- `ops.supplier_products` para relación producto ↔ proveedor/SKU/barcode/presentación.
- `ops.inventory_locations`.
- `ops.inventory_lots` para lote, proveedor, documento, recepción y vencimiento.
- `ops.inventory_movements` como ledger append-only.
- `ops.inventory_balance` como vista derivada del ledger.
- Reglas TypeScript para signo de movimientos, balance, control de stock y orden FEFO.
- Pruebas unitarias de reglas de dominio.
- API MVP `/api/mvp/inventory` para Product Master, consulta de balances y movimientos idempotentes.
- Control server-side de tenant mediante `JOINOPS_TENANT_ID`.
- Rechazo de salidas superiores al balance conocido.

## Reglas preservadas
- El SKU/código del proveedor no es la identidad principal.
- Las correcciones se registran como nuevos movimientos; no se sobrescribe silenciosamente el historial.
- FEFO es la regla preferente para productos con vencimiento.
- La IA/OCR futura solo propondrá datos y requerirá confirmación humana antes de afectar datos críticos.

## Pendiente
- Recepción completa y matching documental.
- Compras/órdenes de compra.
- Supplier Management completo.
- Motor de lotes y reservas FEFO transaccionales.
- Transferencias entre ubicaciones con atomicidad.
- integración Recetas/Producción/POS.
- Valorización y costo de inventario.
- captura OCR/cámara.
- RBAC/identidad real.
- auditoría de cada operación y controles de Security & Trust.
- Failure Contract y pruebas de resiliencia específicas del módulo.
- Ejecución de migraciones y suite CI contra base de datos real.

## Clasificación
Inventory Ledger: IMPLEMENTADO — foundation.
Bodega/Abastecimiento completo: PARCIAL.
MVP productivo: PENDIENTE DE VALIDACIÓN.
