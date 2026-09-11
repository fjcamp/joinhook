# JoinOps — checkpoint de continuidad: cierre de caja y conciliación operacional

Fecha: 2026-09-11

## Punto de continuidad
- Repositorio: `fjcamp/joinhook`
- Branch: `joinops/foundation-2026-09-11`
- Checkpoint de entrada: `5d605ebff1f6e76f10b4b421fde60acf76e34550`
- Este bloque continúa exclusivamente sobre ese estado; no se modificó `main`.

## Verificación previa
- El checkpoint de entrada fue verificado por SHA.
- El branch `joinops/foundation-2026-09-11` estaba idéntico al checkpoint antes de iniciar este bloque.
- La documentación de continuidad confirmó como siguiente paso obligatorio el cierre de caja y conciliación operacional.
- El código existente tenía apertura de caja, `ops.payments`, `ops.cash_movements` y cobro efectivo condicionado a caja abierta.
- No existía suite de pruebas JoinOps bajo `projects/02-joinops/app` en el checkpoint de entrada.
- Existían dos endpoints de caja: `/api/mvp/cash` usado por la UI y `/api/cash` con comportamiento divergente; el trabajo de este bloque mantiene el endpoint utilizado por el MVP y no reconstruye la base existente.

## Clasificación del estado antes de implementar
| Capacidad | Estado | Evidencia |
|---|---|---|
| Apertura de caja | IMPLEMENTADO | `/api/mvp/cash` + UI POS |
| Restricción una caja abierta por registro/tenant | IMPLEMENTADO | índice único parcial en `002_payment_cash.sql` |
| Cash movements | IMPLEMENTADO | `ops.cash_movements` + ventas en `/api/mvp` |
| Pago efectivo exige caja abierta | IMPLEMENTADO | validación server-side en `/api/mvp` |
| Cierre de caja | PARCIAL | existía lógica de cierre en endpoint alternativo, pero no estaba integrada al flujo principal |
| Conciliación esperada vs contado | PARCIAL | campos `expected_amount`/`counted_amount` existían, sin cálculo operacional robusto ni estado de conciliación |
| Diferencias sobrante/faltante | DOCUMENTADO-NO-IMPLEMENTADO | requisito explícito del estado MVP, sin contrato completo en UI/pruebas |
| Movimientos operacionales manuales | PLANIFICADO | tabla existente, sin contrato de API/UI |
| Auditoría del cierre | IMPLEMENTADO | evento de cierre existente, ampliado con snapshot de conciliación |
| Pruebas automatizadas de dominio de caja | PENDIENTE DE VALIDACIÓN | no existían tests en el árbol de JoinOps |
| Integración DB/concurrencia/offline del cierre | PENDIENTE DE VALIDACIÓN | requiere CI y entorno PostgreSQL |

## Implementación de este bloque
1. Migración aditiva para `variance_amount` y `reconciliation_status`.
2. Índices operacionales para sesiones y movimientos.
3. Tipos de movimiento controlados: `OPENING`, `SALE`, `REFUND`, `CASH_IN`, `CASH_OUT`.
4. Trigger server-side que impide movimientos sobre una caja cerrada.
5. Motor puro `reconcileCash` para calcular esperado, contado, diferencia y estado `BALANCED/OVER/SHORT`.
6. Tests unitarios del motor de conciliación.
7. Endpoint principal `/api/mvp/cash` con apertura, movimientos, cierre, replay seguro y snapshot de conciliación.
8. UI POS con arqueo, cierre y visualización de diferencia.

## Regla de cálculo
`Esperado = fondo inicial + movimientos posteriores al fondo inicial`.

Los movimientos `CASH_OUT` y `REFUND` se registran con signo negativo; `SALE` y `CASH_IN` con signo positivo. El movimiento `OPENING` se excluye del delta porque `opening_amount` es la fuente canónica del fondo inicial.

## Validación restante
- Ejecutar CI/typecheck/build/test en GitHub.
- Validar migración contra PostgreSQL/Neon real.
- Validar concurrencia de cierre vs movimiento.
- Validar replay offline de ventas después del cierre.
- Validar permisos/RBAC cuando la identidad real reemplace el tenant configurado por entorno.

## Siguiente paso
**Inventory Ledger conectado a ventas y recepción**, sin reconstruir POS/Caja/Pagos existentes.
