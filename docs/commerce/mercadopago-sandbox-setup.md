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

## Webhooks

### Tópico principal: Order (Mercado Pago)

```text
https://<host>/api/commerce/webhooks/mercadopago
```

Mercado Pago envía `x-signature`, `x-request-id` y `data.id`. El backend valida HMAC y, aun después de una firma válida, consulta `/v1/orders/{id}` para verificar el estado autoritativo.

### Tópicos opcionales de postventa

```text
https://<host>/api/commerce/webhooks/mercadopago-optional
```

Activar y simular, cuando corresponda:

- `topic_claims_integration_wh` — reclamos;
- `topic_chargebacks_wh` — contracargos;
- `stop_delivery_op_wh` — alertas de fraude.

El endpoint opcional valida la firma con el mismo principio, nunca trata el ID de un claim/chargeback como si fuera un Order ID y almacena solo metadata mínima. Cuando una alerta trae `payment_id` y puede correlacionarse con una compra JoinHook, Commerce coloca la compra en hold/revisión o contracargo y revoca inmediatamente el entitlement.

Mercado Pago indica que las alertas de fraude deben reconocerse rápidamente y que no siguen el comportamiento de reintento habitual. Por eso esta ruta debe mantenerse corta, idempotente y enfocada primero en impedir la entrega.

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

## Normalización de estados

Commerce no interpreta `processed` de forma genérica como pago válido. La combinación `status/status_detail` se normaliza de forma conservadora:

- `processed/accredited` → `paid`;
- `processed/partially_refunded` → `partially_refunded` + revocación/hold;
- `refunded` → `refunded` + revocación;
- `charged_back/*` → `charged_back` + revocación;
- `failed/*` → `failed`;
- `canceled` o `expired` → `cancelled`;
- `created`, `processing` o `action_required` → `pending`;
- cualquier estado futuro/desconocido → `review`, nunca fulfillment automático.

Los estados locales de disputa/reembolso/revisión son **sticky**: un Webhook posterior genérico no puede reactivar una descarga automáticamente. La regularización exige revisión explícita.

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
4. validar importe exacto contra orden local y catálogo;
5. validar producto activo;
6. clasificar `status/status_detail`;
7. entregar solo en `processed/accredited`;
8. crear/recuperar entitlement activo;
9. emitir token de descarga limitado.

Cada vez que el comprador consulta `/mi-compra`, si existe una orden de proveedor se vuelve a reconciliar su estado antes de emitir un token nuevo. Así un reembolso o contracargo posterior puede cortar el acceso.

## Política de descarga segura

El límite efectivo es por **compra/entitlement**, no solo por token. Aunque se emita un token nuevo, no se reinicia el número total de descargas disponibles.

El endpoint hace un preview del token, abre/verifica el artefacto privado y **recién después** consume atómicamente un uso. Así una falla de almacenamiento no debe gastar una descarga del cliente.

`JOINHOOK_DOWNLOAD_IP_HASH_SALT` es opcional para auditoría seudonimizada; si no existe, no se guarda hash de IP. Nunca usar una sal pública/predecible.

## Pruebas obligatorias

### Pago
- aprobado `processed/accredited`;
- rechazado;
- `processing/in_process`;
- `action_required`;
- reintento del cliente;
- refresh del navegador;
- doble click en pagar;
- misma `X-Idempotency-Key` repetida;
- timeout/5xx y reintento con la misma clave;
- resultado ambiguo sin sugerir un segundo cobro;
- kill switch server-side en `false` aunque frontend esté habilitado;
- orden con monto alterado;
- `external_reference` incorrecta.

### Webhook Order
- firma correcta;
- firma inválida;
- `x-request-id` faltante;
- `data.id` faltante;
- mismo evento repetido;
- eventos fuera de orden temporal;
- orden desconocida;
- tópico opcional recibido en endpoint de Orders → ignorado sin procesarlo como orden;
- Webhook válido pero orden todavía pendiente.

### Webhooks opcionales
- claim simulado y firma válida/incorrecta;
- chargeback simulado y firma válida/incorrecta;
- fraude `stop_delivery_op_wh` correlacionado por `payment_id`;
- fraude con compra desconocida;
- alerta correlacionada revoca acceso antes de nueva descarga;
- evento duplicado no restaura acceso;
- claim/chargeback sin `payment_id` se registra como no correlacionado sin confundir su resource ID con un Order ID;
- respuesta dentro del plazo exigido por Mercado Pago.

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
- refund total;
- refund parcial → hold/revisión;
- claim;
- chargeback;
- alerta de fraude/stop delivery;
- revocación de entitlement;
- `/mi-compra` no emite token después de revocación;
- Webhook Order posterior no reactiva un hold;
- reemisión controlada de acceso solo después de revisión explícita.

## Criterio READY

La feature flag no se habilita en producción hasta que:

- CI esté verde;
- sandbox completo esté verde;
- no existan secretos en repo/historial;
- base Commerce dedicada esté provisionada y endurecida;
- Webhooks HTTPS estén validados desde Mercado Pago;
- producto privado esté almacenado fuera de `public_html`;
- recuperación de compra y correo transaccional estén operativos;
- refunds/chargebacks/fraude revoquen acceso correctamente;
- exista runbook de rollback al Link de Pago anterior;
- cumplimiento tributario/productivo esté resuelto.

## Fuentes oficiales revisadas

- Mercado Pago Checkout API vía Orders API.
- Estado de Order: `payment-management/status/order-status`.
- Webhooks del tópico Order y validación `x-signature`.
- Notificaciones opcionales de reclamos, contracargos y alertas de fraude.
- Documentación de contracargos y recomendaciones de prevención/stop-delivery.
