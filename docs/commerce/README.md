# JoinHook Commerce Core

## Objetivo
Procesar compras digitales de JoinHook con verificación server-side, código de compra propio, trazabilidad, entitlement y entrega privada. La primera pasarela es Mercado Pago Checkout API vía Orders API; el núcleo no debe quedar acoplado a una sola pasarela.

## Identidad del producto
El nombre público sigue siendo **Control Gastronómico Express**. Se deja de usar `CGE` como sigla pública/interna nueva para evitar colisión de marca en Chile. El nombre corto recomendado es **Control Express** y el código canónico de integración es `JH-GASTRO-EXPRESS-FOUNDERS`.

## Flujo objetivo
1. El comprador entra a `/checkout/control-gastronomico-express`.
2. MercadoPago.js / Card Payment Brick captura y tokeniza los datos de tarjeta. JoinHook no recibe ni almacena PAN/CVV.
3. `POST /api/commerce/create-order` crea primero una orden JoinHook con código `JH-YYYYMMDD-XXXXXXXX` y secreto temporal de reclamo.
4. El backend crea la order de Mercado Pago con `external_reference = order_code` y `X-Idempotency-Key`.
5. Mercado Pago procesa el pago y envía Webhook firmado a `/api/commerce/webhooks/mercadopago`.
6. JoinHook valida HMAC `x-signature`, consulta la Orders API y compara referencia, monto, producto y estado.
7. Solo con pago aprobado la orden pasa a `paid` y se crea el entitlement digital.
8. `/mi-compra` consulta el estado usando `orderCode + claimToken`; cuando la compra está pagada genera acceso temporal.
9. `/api/commerce/download?token=...` consume de forma atómica un token con expiración y límite de usos, registra el evento y transmite el archivo desde almacenamiento privado.

## Seguridad
- Access Token, Webhook Secret, service-role key y secretos de entrega son exclusivamente server-side.
- No registrar payloads que incluyan datos sensibles de tarjeta. El Card Payment Brick entrega un token de un solo uso.
- El monto nunca se acepta desde el navegador: se obtiene del catálogo server-side.
- La orden remota se vuelve a consultar antes del fulfillment.
- `external_reference` debe coincidir con el código interno.
- Los Webhooks se validan con HMAC SHA-256 y comparación constante.
- Los eventos de pago tienen deduplicación por ID/tipo.
- El archivo vendible vive fuera de `public_html` y no se publica con URL permanente.
- El token de descarga se almacena solo como hash y se consume mediante RPC atómica.
- Las tablas de comercio tienen RLS habilitado y ninguna policy para navegador; solo accede el backend con service role.

## Persistencia
Aplicar `docs/commerce/schema.sql` a una base dedicada antes de habilitar pagos. No reutilizar la base operacional de SnowWise.

## Feature flag
Mientras no estén completadas las pruebas, mantener:

```env
NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED=false
JOINHOOK_COMMERCE_ENV=test
```

El Link de Pago actual permanece como fallback y no debe eliminarse hasta pasar el gate de integración.

## Gate de pruebas antes de producción
- [ ] Crear aplicación Mercado Pago y credenciales de prueba.
- [ ] Crear base de datos dedicada y aplicar `schema.sql`.
- [ ] Configurar Webhook de test y secreto.
- [ ] Build/lint sin errores.
- [ ] Card Payment Brick carga en desktop y móvil.
- [ ] Pago de prueba aprobado.
- [ ] Pago rechazado no genera entitlement.
- [ ] Pago pendiente no genera entitlement.
- [ ] Webhook con firma inválida devuelve 401.
- [ ] Webhook duplicado no duplica venta/entitlement.
- [ ] Monto alterado desde cliente no cambia el precio server-side.
- [ ] `external_reference` incorrecta bloquea fulfillment.
- [ ] Orden aprobada genera código de compra y entitlement.
- [ ] Token de descarga vencido devuelve 410.
- [ ] Token agotado devuelve 410.
- [ ] Archivo no existe -> 503 sin consumir entrega adicional en una futura revisión del RPC.
- [ ] Reembolso/contracargo revoca entitlement (fase previa a producción real).
- [ ] Recuperación de compra por correo o cuenta implementada antes de volumen real.
- [ ] QA de seguridad y secret-history scan verde.
- [ ] Solo después: activar credenciales de producción y formalización tributaria.

## Pendientes deliberados
1. Provisionar base dedicada (requiere decisión/proyecto externo).
2. Crear aplicación Mercado Pago y credenciales de prueba en la cuenta del titular.
3. Elegir el artefacto digital exacto que se entregará y ubicarlo en almacenamiento privado.
4. Implementar correo transaccional de compra y recuperación de acceso.
5. Modelar refund/chargeback -> revocación.
6. Conectar eventos `order_paid`, `download_granted`, `download_used`, `refund` a Revenue Intelligence.
