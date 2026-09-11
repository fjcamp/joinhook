# JoinOps — checkpoint de continuidad: Resiliencia y Continuidad Operacional

Fecha: 2026-09-11

## Estado de referencia
- Repositorio: `fjcamp/joinhook`
- Branch de trabajo: `joinops/foundation-2026-09-11`
- PR: #44 (Draft, base `main`)
- `main` no debe modificarse directamente.
- El checkpoint anterior documentó como siguiente bloque obligatorio: **Inventory Ledger conectado a ventas y recepción**.

## Bloque analizado
Antes de continuar con Inventory Ledger se realizó un análisis arquitectónico específico sobre el comportamiento de JoinOps ante errores, fallas técnicas, pérdida de conectividad, inconsistencias de datos y eventos de seguridad.

## Decisión arquitectónica
JoinOps debe diseñarse como un sistema **modular, resiliente y degradable**, donde una falla en un módulo no provoque automáticamente la caída del resto del sistema.

La continuidad no significa mantener todas las funciones disponibles a cualquier costo. La prioridad será:

**Integridad de datos > Seguridad > Trazabilidad > Continuidad operacional > Disponibilidad total.**

Ninguna operación en contingencia podrá continuar si no es posible garantizar su integridad, seguridad o trazabilidad.

## Capa transversal propuesta
Se establece como requisito arquitectónico futuro una capa común denominada provisionalmente:

**JoinOps Resilience & Continuity Layer**

Componentes previstos:
1. Health Monitor.
2. Service Registry.
3. Dependency Manager.
4. Circuit Breaker.
5. Offline/Local Operation Queue.
6. Retry Engine.
7. Idempotency Engine.
8. Event Bus.
9. Reconciliation Engine.
10. Incident Manager.
11. Audit Trail.
12. Backup/Recovery Controller.
13. Safe Mode.
14. Disaster Recovery Procedures.

Esta capa será transversal y no deberá ser reinventada independientemente por cada módulo.

## Estados operacionales de los módulos
Cada módulo deberá poder operar bajo estados explícitos:

- `OPERATIVO`: funcionamiento normal.
- `DEGRADADO`: una capacidad secundaria está afectada.
- `CONTINGENCIA`: una dependencia relevante no está disponible y se aplican políticas alternativas.
- `AISLADO`: existe riesgo para integridad/seguridad y se bloquean capacidades afectadas.
- `RECUPERACIÓN`: el servicio regresó y está sincronizando/reconciliando antes de normalizarse.

## Tipos de fallo
Se distinguen tres clases principales:

### Fallo técnico
API caída, timeout, pérdida de Internet, servidor inaccesible, etc.

Respuesta típica: contingencia controlada, cola local, reintento y sincronización.

### Fallo de datos
Duplicación, inconsistencia, operación incompleta o conflicto de sincronización.

Respuesta: aislamiento de la operación afectada, preservación del estado, reconciliación y auditoría.

### Fallo de seguridad
Acceso no autorizado, credenciales comprometidas, comportamiento anómalo o modificación sospechosa.

Respuesta: bloqueo selectivo, preservación de evidencia, alerta y recuperación controlada.

## Independencia entre módulos
Los módulos deben comunicarse mediante contratos claros y eventos/servicios desacoplados cuando corresponda.

Ejemplo conceptual:

`Venta confirmada → evento → Caja / Inventory Ledger / Analytics`

Si Inventory Ledger está temporalmente indisponible, la venta no debe quedar necesariamente anulada si las reglas de negocio permiten continuar; el movimiento de inventario queda pendiente y debe procesarse posteriormente mediante una operación idempotente y reconciliable.

No se debe reconstruir POS/Caja/Pagos para implementar esta arquitectura.

## Operación offline y contingencia
Offline no significa permitir cualquier operación.

Se definen tres categorías:

### A — Continuidad automática
Operaciones de bajo riesgo que pueden continuar y sincronizarse.

### B — Continuidad controlada
Operaciones que pueden registrarse, pero quedan pendientes de validación/reconciliación.

### C — Bloqueo seguro
Operaciones que deben detenerse cuando no puede garantizarse integridad, seguridad o trazabilidad, especialmente operaciones financieras o de alto riesgo.

## Idempotencia y trazabilidad
Las operaciones críticas deberán poder identificarse mediante conceptos como:

- Operation ID.
- Correlation ID.
- Idempotency Key.
- Actor.
- Device ID.
- Timestamp.
- Audit Event.

El reintento de una operación nunca debe producir una duplicación lógica.

## Circuit Breaker
Las dependencias que fallen repetidamente deberán poder aislarse temporalmente mediante un patrón Circuit Breaker (`OPEN → HALF-OPEN → CLOSED`) para evitar cascadas de errores y permitir recuperación controlada.

## Kill Switch / bloqueo selectivo
JoinOps deberá poder deshabilitar selectivamente una capacidad peligrosa sin apagar todo el sistema.

Ejemplo:

- Ventas: operativo.
- Caja: operativo.
- Inventario: degradado.
- Devoluciones: bloqueadas.
- Descuentos: restringidos.

Esto permite contener errores de negocio sin producir una caída global.

## Recuperación
La recuperación de un módulo no equivale simplemente a volver a responder.

Secuencia prevista:

`detectar pendientes → validar integridad → aplicar idempotencia → reprocesar → reconciliar → auditar → normalizar`

El módulo solo vuelve a estado `OPERATIVO` después de completar las validaciones necesarias.

## Failure Contract obligatorio
Todo módulo nuevo deberá definir, antes de considerarse terminado:

- Dependencias críticas y opcionales.
- Qué ocurre si cada dependencia falla.
- Modo degradado.
- Operaciones permitidas offline.
- Operaciones prohibidas offline.
- Idempotencia.
- Cola y reintentos.
- Auditoría.
- Reconciliación.
- Recuperación.
- Alertas.
- Aislamiento.
- Pruebas de fallo.
- Procedimiento de recuperación.

## Prioridad para el siguiente bloque
El siguiente bloque continúa siendo:

**Inventory Ledger conectado a ventas y recepción.**

Inventory Ledger deberá construirse desde el inicio bajo los principios de este checkpoint, especialmente:

- ledger auditable;
- idempotencia;
- desacoplamiento de POS/Caja/Pagos;
- eventos/operaciones pendientes cuando corresponda;
- comportamiento definido ante pérdida de dependencia;
- reconciliación posterior;
- no inventar stock ni confirmar movimientos inexistentes.

## Clasificación
- Resilience & Continuity Layer: **PLANIFICADO / ARQUITECTURA DEFINIDA**.
- Implementación de la capa transversal: **DOCUMENTADO-NO-IMPLEMENTADO**.
- Failure Contract por módulo: **REQUISITO ARQUITECTÓNICO**.
- Inventory Ledger: **PENDIENTE DE IMPLEMENTACIÓN**.
- Validación PostgreSQL/Neon, concurrencia, offline/replay y recuperación: **PENDIENTE DE VALIDACIÓN**.

## Regla de continuidad
Este checkpoint no reemplaza ni modifica el checkpoint anterior de Cierre de Caja y Conciliación. Agrega una directriz transversal para los próximos bloques.

**No reconstruir módulos ya implementados. Incorporar resiliencia progresivamente a cada módulo nuevo y posteriormente endurecer los módulos existentes mediante contratos y pruebas de fallo.**
