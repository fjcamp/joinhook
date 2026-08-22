# Mercado Pago Checkout API — preparación sandbox JoinHook

## Objetivo

Probar Commerce Core sin cobros reales antes de formalizar JoinHook para producción.

## Aplicación Mercado Pago

Crear una aplicación específica para JoinHook Commerce en **Tus integraciones** de Mercado Pago. No reutilizar credenciales de otra aplicación/producto.

Separar estrictamente pruebas y producción.

## Variables requeridas

Nunca guardar valores reales en GitHub.

```bash
NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED=false
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
JOINHOOK_COMMERCE_SUPABASE_URL=
JOINHOOK_COMMERCE_SUPABASE_SERVICE_ROLE_KEY=
JOINHOOK_COMMERCE_TOKEN_SECRET=
JOINHOOK_COMMERCE_PRIVATE_PRODUCT_ROOT=
```

## Webhook

Tópico principal: **Order (Mercado Pago)**.

URL prevista:

```text
https://<host>/api/commerce/webhooks/mercadopago
```

Mercado Pago envía `x-signature`, `x-request-id` y `data.id`. El backend debe validar HMAC antes de procesar el evento y, aun después de una firma válida, consultar `/v1/orders/{id}` para verificar el estado real de la orden.

El `id` de la notificación se utiliza como clave de idempotencia del evento cuando esté disponible.

## Orders API

Endpoint utilizado:

```text
POST https://api.mercadopago.com/v1/orders
```

Headers relevantes:

- `Authorization: Bearer <ACCESS_TOKEN>`
- `X-Idempotency-Key: <UUID>`

Commerce guarda una orden local antes de solicitar la orden al proveedor y utiliza su `order_code` como `external_reference`.

## Regla de fulfillment

Nunca entregar un archivo por:

- redirect del navegador;
- query params de resultado;
- respuesta visual del Brick;
- body del Webhook sin verificar.

Antes de otorgar entitlement:

1. localizar orden JoinHook por `provider_order_id`;
2. consultar la orden a Mercado Pago server-side;
3. validar `external_reference`;
4. validar importe exacto;
5. validar producto activo;
6. validar estado aprobado/procesado;
7. marcar orden como pagada idempotentemente;
8. crear/recuperar entitlement;
9. emitir token de descarga limitado.

## Pruebas obligatorias

### Pago
- aprobado;
- rechazado;
- pendiente/acción requerida si aplica;
- reintento del cliente;
- refresh del navegador;
- doble click en pagar;
- misma `X-Idempotency-Key` repetida;
- orden con monto alterado;
- `external_reference` incorrecta.

### Webhooks
- firma correcta;
- firma inválida;
- `x-request-id` faltante;
- `data.id` faltante;
- mismo evento repetido;
- eventos fuera de orden temporal;
- orden desconocida;
- Webhook válido pero orden todavía pendiente.

### Entrega
- token válido;
- token inválido;
- token expirado;
- máximo de descargas alcanzado;
- dos descargas concurrentes en el último uso;
- entitlement revocado;
- archivo inexistente;
- traversal de ruta (`../`) bloqueado.

### Postventa
Antes de producción agregar pruebas de:
- refund;
- claim;
- chargeback;
- alerta de fraude/stop delivery;
- revocación de entitlement;
- reemisión controlada de acceso.

## Criterio READY

La feature flag no se habilita en producción hasta que:

- CI esté verde;
- sandbox completo esté verde;
- no existan secretos en repo/historial;
- base Commerce dedicada esté provisionada;
- Webhook HTTPS esté validado desde Mercado Pago;
- producto privado esté almacenado fuera de `public_html`;
- recuperación de compra y correo transaccional estén operativos;
- refunds/chargebacks revoquen acceso correctamente;
- exista runbook de rollback al Link de Pago anterior.

## Fuentes oficiales revisadas

- Mercado Pago Checkout API vía Orders API.
- Referencia `POST /v1/orders` y `X-Idempotency-Key` obligatorio.
- Configuración de Webhooks del tópico Order y validación `x-signature`.
- Notificaciones opcionales para claims, chargebacks y alertas de fraude.
