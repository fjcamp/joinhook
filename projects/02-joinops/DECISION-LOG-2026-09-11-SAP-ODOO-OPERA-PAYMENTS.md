# JoinOps — Continuidad y decisiones arquitectónicas — 2026-09-11

## Propósito
Documento de continuidad para retomar JoinOps en un chat o sesión posterior sin perder las decisiones tomadas durante la investigación de SAP, Odoo y Oracle Hospitality OPERA, ni la decisión de preparar desde el inicio las bases para pagos online y presenciales.

## Benchmark oficial
JoinOps toma como referencias arquitectónicas:

- **SAP:** integración empresarial, procesos, finanzas, supply chain, producción, control y trazabilidad.
- **Odoo:** modularidad, aplicaciones integradas, personalización y datos compartidos.
- **Oracle Hospitality OPERA PMS:** profundidad operacional hotelera: reservas, perfiles, front desk, habitaciones, housekeeping, grupos, eventos, revenue, reportes e integraciones.
- **OPERA Cloud Distribution / OHIP:** distribución hotelera, OTA, Channel Managers, CRS/GDS, APIs, ARI (Availability, Rates, Inventory), Shop & Book y Business Events.
- **ERP/soluciones chilenas:** localización, SII, operación de PYMES y necesidades del mercado chileno.
- **Soluciones verticales de gastronomía/turismo/hotelería:** profundidad operacional sectorial.

JoinOps NO debe copiar SAP, Odoo u OPERA. Debe tomar patrones sólidos y construir una plataforma configurable de gestión operacional y empresarial.

## Modelo conceptual JoinOps
La unidad de diseño debe poder representar:

**Organización → Sucursal → Módulo → Sección → Proceso → Operación → Evento → Registro → KPI/Costo/Informe**

Los módulos y secciones deben ser configurables y poder relacionarse mediante contratos/eventos sin mezclar arbitrariamente sus reglas de negocio.

## Principio de fuente de verdad
JoinOps Core es la fuente de verdad transaccional y operacional.

- Las integraciones externas transportan/sincronizan información.
- Una OTA no es fuente de verdad del núcleo operacional.
- Un Channel Manager no reemplaza JoinOps Core.
- n8n puede automatizar/orquestar, pero nunca debe ser la fuente de verdad.
- Los eventos deben quedar registrados y auditables.

## Integration Hub
Se incorpora como componente transversal de arquitectura:

```text
JOINOPS
├── CORE
│   ├── Organization
│   ├── Identity & RBAC
│   ├── Module Builder
│   ├── Workflow Engine
│   ├── Event Engine
│   └── Audit / Traceability
├── BUSINESS
│   ├── Operations
│   ├── Inventory
│   ├── Procurement
│   ├── Production
│   ├── Sales / POS
│   ├── CRM
│   ├── Finance
│   ├── HR
│   ├── Assets / Maintenance
│   └── BI
├── VERTICALS
│   ├── Gastronomy
│   ├── Hotel
│   ├── Tourism
│   └── Events
└── INTEGRATION HUB
    ├── REST API
    ├── Webhooks
    ├── Event Bus
    ├── OTA
    ├── Channel Managers
    ├── CRS / GDS
    ├── POS
    ├── Payments
    ├── Revenue Management
    ├── Maps/GIS
    ├── SII
    └── External Systems
```

## OPERA / OTA / Distribution
La arquitectura objetivo debe permitir:

### Hacia canales
- Availability
- Rates
- Inventory (ARI)
- restricciones y condiciones aplicables

### Desde canales
- nueva reserva
- modificación
- cancelación
- sincronización de estados

### Patrones de integración
1. **Push / eventos:** JoinOps publica cambios de disponibilidad/tarifas/inventario hacia el canal o intermediario.
2. **API / Shop & Book:** un canal consulta disponibilidad/tarifas y posteriormente crea/consulta/modifica/cancela una reserva mediante APIs.
3. **Channel Manager / CRS / GDS:** JoinOps se integra mediante adaptadores, sin acoplar el Core a un proveedor concreto.

La arquitectura debe soportar mapeos entre recursos internos y recursos externos: propiedades, habitaciones/tipos de habitación, tarifas, planes, inventario, reservas y estados.

## Event Engine
Se establece como pieza transversal y prioritaria.

Ejemplos:
- ReservationCreated
- ReservationModified
- ReservationCancelled
- GuestCheckedIn
- GuestCheckedOut
- RoomCleaned
- RoomInspected
- InventoryRequested
- InventoryTransferred
- PurchaseReceived
- ProductionCompleted
- SaleCompleted
- PaymentInitiated
- PaymentAuthorized
- PaymentCaptured
- PaymentFailed
- PaymentCancelled
- PaymentRefunded
- PaymentPartiallyRefunded
- CashReceived
- CashRegisterClosed
- PaymentReconciled
- IncidentCreated

Cada evento debe conservar, según corresponda:
- event_id
- organization_id
- branch_id
- module_id
- section_id
- entity_type
- entity_id
- action
- user_id
- role_id
- timestamp
- previous_state
- new_state
- origin
- destination
- quantity/amount
- references
- metadata

El sistema debe permitir recorrer un KPI o resultado consolidado hasta el registro operacional que lo originó.

## Payment & Settlement Hub — PRIORIDAD OBLIGATORIA
Esta decisión es crítica y NO debe omitirse al iniciar la configuración ni el desarrollo del código.

Debe existir desde la arquitectura base, aunque el MVP implemente solo una parte de las integraciones.

### Alcance
Pagos:
- online/web
- aplicaciones/PWA
- APIs
- links de pago
- POS/terminal presencial
- QR
- efectivo
- tarjetas
- transferencias
- pagos mixtos
- anticipos
- pagos parciales
- devoluciones
- anulaciones
- propinas cuando corresponda
- cierres de caja y arqueos
- conciliación

### Arquitectura
```text
Payment & Settlement Hub
├── Payment Core
├── Provider Adapter Layer
│   ├── MercadoPagoAdapter
│   ├── Webpay/TransbankAdapter
│   ├── FlowAdapter
│   ├── StripeAdapter
│   ├── POSAdapter
│   └── futuros proveedores
├── Webhooks / callbacks
├── Payment State Machine
├── Cash / POS / Shifts
├── Settlement
├── Reconciliation
└── Audit / Events
```

Los nombres de adaptadores son capacidades previstas; no significan que todos estén implementados en el MVP.

### Regla de seguridad
JoinOps NO debe almacenar datos sensibles de tarjetas. Los datos sensibles y procesos PCI deben permanecer en el proveedor de pago correspondiente. JoinOps conserva identificadores/tokenización cuando corresponda, estado, monto, moneda, referencias, timestamps, comprobantes y demás datos operacionales no sensibles necesarios para auditoría y conciliación.

### Estados mínimos previstos
- initiated
- pending
- authorized
- captured/paid
- failed
- cancelled/voided
- refunded
- partially_refunded
- reconciled
- disputed, si posteriormente se incorpora gestión de contracargos

### Integración transversal
El Payment Hub debe poder relacionarse con:
- Sales/POS
- Reservations
- Hotel
- Tourism
- Events
- CRM
- Finance
- Cash management
- Accounting/tax, según integraciones futuras

Ejemplo:

**Venta → Pago → Caja/Adquirente → Liquidación → Conciliación → Finanzas → KPI**

## Casos de uso demostrativos
### Gastronomía
Comanda → receta → consumo de ingredientes → inventario → venta → pago → costo → margen → dashboard.

### Hotel
Reserva → inventario de habitación → depósito → estancia → cargos → checkout → pago → conciliación.

### Turismo
Reserva de actividad → capacidad → guía → equipo/recurso → ejecución → pago → cierre.

### Evento
Cotización → presupuesto → contrato → anticipo → compras/producción → ejecución → pagos parciales → cierre → rentabilidad.

## Reglas de arquitectura
1. No iniciar el desarrollo del MVP sin reflejar estas decisiones en arquitectura y modelo de datos.
2. No acoplar el Core a un proveedor de pago, OTA, Channel Manager o PMS externo.
3. No tratar n8n como fuente de verdad.
4. Las integraciones deben utilizar adaptadores/contratos.
5. Los eventos deben ser auditables e idempotentes cuando corresponda.
6. Las modificaciones importantes de estados deben conservar trazabilidad.
7. Los datos externos deben validarse y mapearse antes de entrar al Core.
8. Las capacidades futuras pueden dejarse como interfaces/contratos aunque no se implementen en el MVP.
9. El diseño debe soportar organizaciones con múltiples sucursales, servicios y áreas interconectadas.
10. La arquitectura debe servir para gastronomía, hotelería, turismo, eventos y otros negocios configurables.

## Prioridad para el concurso
El MVP no debe intentar implementar todos los dominios de SAP/Odoo/OPERA. La arquitectura debe quedar preparada para ellos.

Demostración recomendada:
- Core de organización y sucursales
- módulo/servicio configurable
- usuarios/roles/permisos
- operaciones/tareas
- inventario/bodega
- compras
- recetas/producción/costos
- ventas/POS
- eventos y trazabilidad
- Payment Core con al menos una integración o mock seguro
- Integration Hub preparado para OTA/Channel Manager
- dashboard con drill-down a registros de origen

## Continuidad
Este archivo existe para que una nueva sesión pueda recuperar las decisiones de esta conversación sin depender del historial del chat.

Fecha: 2026-09-11
Proyecto: JoinOps
Repositorio: fjcamp/joinhook
