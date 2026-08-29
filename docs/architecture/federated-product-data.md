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

## Restricción de capacidad del plan gratuito

Al provisionar JoinHook Commerce, Supabase informó un costo de **$0 mensual**, pero también confirmó el límite vigente de **dos proyectos gratuitos activos** para el miembro propietario/administrador. Actualmente ese cupo queda ocupado por:

1. `SnowWise`.
2. `JoinHook Commerce`.

Esta restricción **no cambia** el principio de aislamiento. No se compartirán bases solo para eludir un límite del proveedor. Antes de crear un tercer producto con backend independiente se deberá evaluar la alternativa de infraestructura más conveniente y legítima para ese producto: plan superior, otro proveedor compatible, o mantenerlo en desarrollo local hasta que exista capacidad. No se pausará ni eliminará un proyecto activo sin revisión explícita del impacto.

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

## Pases de datos entre proyectos y microservicios

Todo intercambio de datos se diseña explícitamente por producto o microservicio. No existe un bus de datos con acceso general ni una credencial transversal que permita leer todas las bases.

Cada **Data Pass** debe definir como mínimo:

- `source`: servicio propietario del dato;
- `consumer`: servicio autorizado a consumirlo;
- `purpose`: finalidad operacional o analítica;
- `contract_version`: versión del contrato;
- `data_classification`: pública, interna, confidencial o sensible;
- `fields`: campos exactos permitidos;
- `transport`: API HTTPS, webhook/evento, cola u otro mecanismo aprobado;
- `direction`: read-only, event-only o comando autorizado;
- `retention`: cuánto tiempo puede persistir el consumidor la copia derivada;
- `legal_basis_or_policy`: regla de privacidad/compliance aplicable cuando corresponda;
- `auth_scope`: credencial y alcance mínimo;
- `audit`: cómo se registra el acceso o transferencia;
- `revocation`: cómo se corta el pase sin romper al servicio propietario.

Reglas:

1. **Default deny:** si un campo no está declarado en el Data Pass, no se transfiere.
2. **Minimización:** preferir agregados y referencias opacas antes que datos personales.
3. **No DB-to-DB directo** entre productos como mecanismo ordinario; usar APIs/eventos versionados.
4. **No replicar secretos** ni credenciales dentro de eventos o payloads funcionales.
5. **Correlación controlada:** usar `correlation_id`, `customer_ref` u otros identificadores opacos; evitar exponer IDs internos innecesarios.
6. **Idempotencia:** eventos y comandos reintentables deben soportar procesamiento repetido sin duplicar efectos.
7. **Trazabilidad:** productor y consumidor deben poder reconstruir cuándo, por qué y bajo qué versión se movió la información.
8. **Entornos separados:** un pase de staging nunca usa credenciales ni datos productivos por defecto.
9. **Revocación independiente:** cortar acceso de un consumidor no debe requerir rotar secretos de todos los productos.
10. **Contratos antes que conveniencia:** nuevos microservicios no obtienen acceso amplio por estar dentro del ecosistema JoinHook.

Ejemplos iniciales:

`SnowWise -> JoinHook Control Plane`: Health, versión, incidencias y métricas agregadas; read-only.

`SnowWise -> JoinHook Commerce`: solicitud de creación de orden/entitlement; nunca acceso a tablas de Commerce.

`JoinHook Commerce -> Revenue Intelligence`: eventos de funnel, pago aprobado, reembolso y entrega con referencias opacas; sin tarjeta, CVV ni secretos.

`JoinOps -> JoinHook Control Plane`: salud, versión, integraciones y métricas operacionales agregadas; sin exponer inventario o RR.HH. detallado salvo contrato específico.

`Plataforma Regional -> microproducto`: consultas de conocimiento por API/RAG con fuente, vigencia y territorio; el microproducto no obtiene acceso directo al repositorio completo.

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
