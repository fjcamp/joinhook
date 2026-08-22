# Mercado Pago Checkout API — preparación sandbox JoinHook

## Objetivo

Probar Commerce Core sin cobros reales antes de formalizar JoinHook para producción.

## Aplicación Mercado Pago

Crear una aplicación específica para JoinHook Commerce en **Tus integraciones** de Mercado Pago. No reutilizar credenciales de otra aplicación/producto.

Separar estrictamente pruebas y producción.

## Variables requeridas

Nunca guardar valores reales en GitHub.

```bash
# Frontend público
NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED=false
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=

# Kill switch server-side para creación de pagos
JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false

# Entorno
JOINHOOK_COMMERCE_ENV=test
JOINHOOK_SITE_URL=https://joinhook.cl

# Mercado Pago — SERVER ONLY
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=

# Base dedicada JoinHook Commerce — SERVER ONLY
JOINHOOK_COMMERCE_SUPABASE_URL=
JOINHOOK_COMMERCE_SUPABASE_SERVICE_ROLE_KEY=

# Fulfillment — SERVER ONLY
JOINHOOK_DOWNLOAD_TOKEN_SECRET=
JOINHOOK_DOWNLOAD_IP_HASH_SALT=
JOINHOOK_DOWNLOAD_TTL_HOURS=72
JOINHOOK_DOWNLOAD_MAX_USES=3

# Artefacto privado fuera de public_html y fuera del repositorio
JOINHOOK_GASTRO_EXPRESS_PRIVATE_FILE=/home/joinhook/private-products/control-express/control-gastronomico-express.zip
```

La referencia canónica de variables es `.env.commerce.example`.

`NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED` controla la interfaz. `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS` controla el backend y es la última barrera para crear cobros. Para pruebas reales en sandbox deben habilitarse conscientemente ambas; en producción permanecen `false` hasta el GO formal.

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

Commerce crea primero la orden local con su `order_code` y la clave de idempotencia ya persistida. Esa misma clave se usa en el request a Mercado Pago y en cualquier reintento transitorio del mismo intento de compra. El `order_code` se usa como `external_reference`.

Si el proveedor responde con un rechazo inequívoco, JoinHook puede marcar la orden como fallida. Si la comunicación termina en un estado ambiguo (timeout/red/5xx incluso después del reintento), JoinHook conserva la orden para verificación y **no invita al cliente a volver a pagar**, evitando un posible cobro duplicado.

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

## Política de descarga segura

El límite efectivo es por **compra/entitlement**, no solo por token. Aunque se emita un token nuevo, no se reinicia el número total de descargas disponibles.

El endpoint hace un preview del token, abre/verifica el artefacto privado y **recién después** consume atómicamente un uso. Así una falla de almacenamiento no debe gastar una descarga del cliente.

`JOINHOOK_DOWNLOAD_IP_HASH_SALT` es opcional para auditoría seudonimizada; si no existe, no se guarda hash de IP. Nunca usar una sal pública/predecible.

## Pruebas obligatorias

### Pago
- aprobado;
- rechazado;
- pendiente/acción requerida si aplica;
- reintento del cliente;
- refresh del navegador;
- doble click en pagar;
- misma `X-Idempotency-Key` repetida;
- timeout/5xx y reintento con la misma clave;
- resultado ambiguo sin sugerir un segundo cobro;
- kill switch server-side en `false` aunque frontend esté habilitado;
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
- tópico opcional recibido en endpoint de Orders → ignorado sin procesarlo como orden;
- Webhook válido pero orden todavía pendiente.

### Entrega
- token válido;
- token inválido;
- token expirado;
- máximo global de descargas alcanzado aunque existan varios tokens;
- dos descargas concurrentes en el último uso;
- entitlement revocado;
- archivo inexistente/no legible sin consumir allowance;
- traversal de ruta (`../`) bloqueado;
- auditoría fallida sin impedir una descarga ya autorizada.

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
