# JoinHook Control Plane — contrato federado v1

## Propósito

Permitir que `joinhook.cl` observe y gestione el portafolio sin compartir bases de datos ni entregar acceso irrestricto entre productos.

Cada producto conserva su propia base y publica solo snapshots/health autorizados mediante endpoints internos autenticados.

## Seguridad

- HTTPS obligatorio en producción.
- Token server-to-server distinto por producto y entorno.
- Nunca incluir el token en JavaScript público.
- Rotación independiente por producto.
- Lectura por defecto; cualquier acción futura requiere un contrato separado y autoridad explícita.
- Los endpoints no deben retornar credenciales, tokens, ubicaciones precisas, datos laborales sensibles ni registros personales crudos.
- Preferir métricas agregadas.

## Endpoints v1

### `GET /api/internal/control-plane/health`

Devuelve `ProductHealthSnapshot`.

```json
{
  "contractVersion": 1,
  "productId": "snowwise",
  "environment": "production",
  "observedAt": "2026-08-22T12:00:00Z",
  "state": "healthy",
  "version": "0.8.0",
  "checks": [
    { "key": "database", "state": "healthy" },
    { "key": "weather", "state": "healthy", "latencyMs": 145 }
  ]
}
```

### `GET /api/internal/control-plane/usage?from=<ISO>&to=<ISO>`

Devuelve `ProductUsageSnapshot` con conteos agregados.

### `GET /api/internal/control-plane/revenue?from=<ISO>&to=<ISO>`

Opcional. Solo productos con ingresos propios o Commerce deben implementarlo.

### `GET /api/internal/control-plane/incidents`

Devuelve `ProductIncidentSnapshot` agregado.

## Autenticación

Formato inicial:

```http
Authorization: Bearer <PRODUCT_CONTROL_PLANE_TOKEN>
```

El producto valida el token con comparación constante y lo obtiene únicamente desde variables de entorno/secret manager.

Fase posterior: migrar a credenciales de servicio de corta duración o mTLS si el riesgo/escala lo justifica.

## Versionado

- `contractVersion: 1` es obligatorio.
- Los cambios compatibles pueden añadir campos opcionales.
- Cambios semánticos incompatibles crean v2.
- JoinHook valida `contractVersion` y `productId` antes de aceptar un snapshot.

## Fallos

Si un producto no responde:

- JoinHook muestra `unknown/degraded`, no inventa datos.
- Se conserva el último snapshot válido con timestamp explícito si el dashboard lo requiere.
- La caída del Control Plane nunca debe impedir que el producto continúe operando.

## Eventos

Los cambios relevantes se emiten con `DomainEventEnvelope`:

```json
{
  "eventId": "uuid",
  "eventType": "commerce.order.paid",
  "eventVersion": 1,
  "occurredAt": "2026-08-22T12:00:00Z",
  "sourceProduct": "joinhook-commerce",
  "environment": "production",
  "correlationId": "JH-20260822-ABC123",
  "subjectId": "opaque-id",
  "data": {}
}
```

Los consumidores deben ser idempotentes. Los eventos no contienen secretos, datos de tarjeta ni tokens de descarga.

## Implementación JoinHook

`RemoteProductControlPlaneAdapter` consume estos endpoints desde el servidor de JoinHook con timeout y validación básica del contrato.

Variables futuras por producto, por ejemplo:

```bash
JOINHOOK_CP_SNOWWISE_URL=https://...
JOINHOOK_CP_SNOWWISE_TOKEN=SERVER_ONLY
JOINHOOK_CP_JOINOPS_URL=https://...
JOINHOOK_CP_JOINOPS_TOKEN=SERVER_ONLY
```

Los nombres definitivos se incorporarán al archivo de entorno cuando cada producto implemente el contrato.
