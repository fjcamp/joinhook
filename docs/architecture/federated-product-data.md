# Arquitectura federada de datos de productos JoinHook

## Decisión

Cada producto es dueño de sus datos. JoinHook observa, coordina y consolida mediante contratos de integración, APIs y eventos.

No se construirá una base monolítica compartida por SnowWise, JoinOps, Commerce, Revenue Intelligence y futuros microproductos.

## Límites de datos

### SnowWise
Base propia para identidad de producto, destinos, clima, GPS, mapas, pasaporte, checklist/equipamiento, comunidad y telemetría específica de montaña.

### JoinOps
Base propia para empresas, sucursales, inventario, recetas/producción, RR.HH., proveedores, operaciones, Audit Ledger, eventos y trazabilidad.

### JoinHook Commerce
Base corporativa independiente para catálogo, órdenes, pagos, eventos de pago, entitlements, descargas, reembolsos y conciliación.

### Revenue Intelligence
Base/almacén separado para sesiones, navegación, campañas, chat, leads, funnels, conversiones, scoring y modelos derivados.

### Plataforma de Conocimiento Empresarial Regional
Base propia para fuentes, procedencia, vigencias, territorio, legislación, turismo, gastronomía, RR.HH., capacitación y conocimiento estructurado/RAG aprobado.

## JoinHook como Control Plane

`joinhook.cl` no tendrá acceso irrestricto a todas las tablas de cada producto. Consumirá únicamente contratos explícitos.

Tipos de contrato iniciales:

- `ProductHealthSnapshot`
- `ProductReleaseSnapshot`
- `ProductUsageSnapshot`
- `ProductIncidentSnapshot`
- `ProductRevenueSnapshot`
- `DomainEventEnvelope`

Los contratos se versionan. Un producto puede evolucionar internamente sin romper JoinHook mientras mantenga el contrato publicado.

## Principio de mínimo privilegio

JoinHook recibe solo datos necesarios para observabilidad y gestión. Datos personales, operacionales sensibles o secretos de cada producto permanecen en su dominio salvo necesidad explícita y autorizada.

Preferencias de integración:

1. métricas agregadas antes que registros personales;
2. APIs read-only para observabilidad;
3. eventos para cambios de estado;
4. identificadores opacos/globales para correlación;
5. credenciales separadas por producto y entorno;
6. scopes mínimos y rotación independiente;
7. staging y producción completamente separados.

## Modelo de eventos

Ejemplo:

```json
{
  "event_id": "evt_...",
  "event_type": "commerce.order.paid",
  "event_version": 1,
  "occurred_at": "2026-08-22T00:00:00Z",
  "source_product": "joinhook-commerce",
  "environment": "production",
  "correlation_id": "JH-20260822-ABC123",
  "subject_id": "opaque-id",
  "data": {}
}
```

Reglas:

- IDs de evento globalmente únicos.
- Eventos append-only.
- Consumidores idempotentes.
- `correlation_id` permite seguir una operación entre servicios.
- No insertar secretos, tokens ni datos de tarjetas en eventos.
- Versionar esquemas al cambiar semántica.

## Lectura centralizada

El futuro Portfolio/Control Plane de JoinHook podrá mostrar, según autorización:

- salud del producto;
- versión desplegada;
- última liberación;
- usuarios activos agregados;
- disponibilidad de APIs;
- incidencias abiertas;
- métricas de uso;
- ventas y conversiones agregadas;
- estado de integraciones;
- estado de backups;
- alertas de seguridad/compliance.

Esto no implica replicar todas las bases en JoinHook.

## Integración con Commerce

Los productos consumidores no implementan Mercado Pago directamente. Solicitan al servicio JoinHook Commerce crear/cobrar una orden mediante un contrato estable.

Ejemplos futuros:

`SnowWise -> Commerce API -> Mercado Pago`

`JoinOps -> Commerce API -> Mercado Pago`

`Microproducto -> Commerce API -> Mercado Pago`

Commerce emite eventos como `order.created`, `order.paid`, `entitlement.granted`, `download.completed`, `refund.completed` y `chargeback.received`.

## Integración con Revenue Intelligence

Revenue Intelligence recibe eventos permitidos de todos los productos, pero no se convierte en fuente de verdad operacional.

Los modelos de atribución, funnel, scoring y cohortes son derivados y pueden recalcularse desde eventos originales.

## Regla para n8n y agentes

n8n y los agentes pueden orquestar flujos y reaccionar a eventos, pero no son fuente de verdad.

Las acciones de alto riesgo deben volver al servicio propietario del dato y respetar su Agent Contract/autoridad.

## Evolución

Fase 1: contratos TypeScript + endpoints read-only + Commerce Core.

Fase 2: event gateway/outbox + dashboard privado JoinHook.

Fase 3: observabilidad unificada, Revenue Intelligence y agentes de Control Plane.

Fase 4: catálogo de contratos, lineage, data quality y gobierno transversal.
