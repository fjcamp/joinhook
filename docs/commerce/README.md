# JoinHook Commerce Core

## Objetivo
Procesar compras digitales de JoinHook con verificación server-side, código de compra propio, trazabilidad, entitlement y entrega privada. La primera pasarela es Mercado Pago Checkout API vía Orders API; el núcleo no debe quedar acoplado a una sola pasarela.

## Identidad del producto
El nombre público sigue siendo **Control Gastronómico Express**. Se deja de usar `CGE` como sigla pública/interna nueva para evitar colisión de marca en Chile. El nombre corto recomendado es **Control Express** y el código canónico de integración es `JH-GASTRO-EXPRESS-FOUNDERS`.

## Flujo objetivo
1. El comprador entra a `/checkout/control-gastronomico-express`.
2. El checkout consulta `/api/commerce/public-config` para obtener en runtime la Public Key de prueba y el estado del switch; no exige recompilar para cambiar configuración de cPanel.
3. MercadoPago.js / Card Payment Brick captura y tokeniza los datos de tarjeta. JoinHook no recibe ni almacena PAN/CVV.
4. `POST /api/commerce/create-order` crea primero una orden JoinHook con código `JH-YYYYMMDD-XXXXXXXX` y secreto temporal de reclamo.
5. El backend crea la Order de Mercado Pago con `external_reference = order_code` y `X-Idempotency-Key`.
6. Mercado Pago procesa el pago y envía Webhook firmado a la URL registrada `/api/commerce/mercadopago/webhook`.
7. Esa ruta reutiliza el handler autoritativo `/api/commerce/webhooks/mercadopago`; no existen dos implementaciones de firma o fulfillment.
8. JoinHook valida HMAC `x-signature`, consulta la Orders API y compara referencia, monto, producto y estado.
9. Solo con `processed/accredited` la orden pasa a `paid` y se crea el entitlement digital.
10. `/mi-compra` consulta el estado mediante la cookie HttpOnly de claim; cuando la compra está pagada genera acceso temporal.
11. `/api/commerce/download?token=...` consume de forma atómica un token con expiración y límite global por entitlement, registra el evento y transmite el archivo desde almacenamiento privado.
12. Si el comprador pierde la cookie, `/recuperar-compra` permite iniciar un flujo de recuperación por código + correo sin revelar si la combinación existe.

## Seguridad
- Access Token, Webhook Secret, Supabase Secret key y secretos de entrega/recuperación son exclusivamente server-side.
- No registrar payloads que incluyan datos sensibles de tarjeta. El Card Payment Brick entrega un token de un solo uso.
- El monto nunca se acepta desde el navegador: se obtiene del catálogo server-side.
- La orden remota se vuelve a consultar antes del fulfillment.
- `external_reference` debe coincidir con el código interno.
- Los Webhooks se validan con HMAC SHA-256 y comparación constante.
- Los eventos de pago tienen deduplicación por ID/tipo.
- El archivo vendible vive fuera de `public_html` y no se publica con URL permanente.
- El token de descarga se almacena solo como hash y se consume mediante RPC atómica.
- Las tablas Commerce y recovery tienen RLS y políticas explícitas deny para roles de navegador.
- La recuperación rota la credencial de compra después de consumir un token de recuperación de un solo uso.
- El endpoint de recuperación devuelve la misma respuesta ante coincidencia/no coincidencia para reducir enumeración de pedidos/correos.
- El correo de recuperación se entrega mediante un adapter server-to-server; el token crudo no se guarda en Postgres.

## Persistencia
La base dedicada **JoinHook Commerce** ya fue provisionada separada de SnowWise. El esquema base está en `docs/commerce/schema.sql` y las migraciones posteriores en `docs/commerce/migrations/`.

## Switches de seguridad
Mantener durante sandbox:

```env
JOINHOOK_COMMERCE_CHECKOUT_ENABLED=false
JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false
JOINHOOK_COMMERCE_ENV=test
```

`JOINHOOK_COMMERCE_CHECKOUT_ENABLED` controla la experiencia embebida en runtime. `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS` es un kill switch server-side independiente y debe continuar en `false` hasta iniciar conscientemente las pruebas de pago.

El Link de Pago actual permanece como fallback y no debe eliminarse hasta pasar el gate de integración.

## Recuperación de compra
Implementado en código y base:

- `commerce_recovery_requests` para auditoría/rate limiting sin guardar datos de tarjeta;
- `commerce_recovery_tokens` con hash, expiración, revocación y uso único;
- RPC atómica `consume_commerce_recovery_token`;
- `/api/commerce/recovery/request` con respuesta anti-enumeración;
- `/api/commerce/recovery/claim` que rota la cookie HttpOnly de compra;
- `/recuperar-compra` para autoservicio;
- adapter de correo transaccional server-to-server preparado para n8n u otro proveedor aprobado.

Pendiente externo: configurar `JOINHOOK_RECOVERY_TOKEN_SECRET` y el webhook/proveedor transaccional de correo.

## Gate de pruebas antes de producción
- [x] Crear base de datos dedicada y aplicar esquema/hardening.
- [x] Crear aplicación Mercado Pago de prueba: Checkout API + Orders.
- [x] Configurar Public Key, Access Token y Webhook Secret de prueba en cPanel según el procedimiento operativo.
- [x] Configurar Webhook de test `Order (Mercado Pago)` en la aplicación.
- [x] Añadir alias de ruta que coincide con la URL registrada en Mercado Pago.
- [x] Build/lint/Commerce CI protegidos por GitHub Actions; revalidar cada head antes de despliegue.
- [ ] Desplegar el runtime Commerce en `joinhook-production` y verificar que GET del Webhook devuelva 405, no 404.
- [ ] Configurar secreto de descarga y artefacto privado definitivo.
- [ ] Habilitar deliberadamente sandbox embebido y Card Payment Brick.
- [ ] Pago de prueba aprobado.
- [ ] Pago rechazado no genera entitlement.
- [ ] Pago pendiente no genera entitlement.
- [ ] Webhook con firma inválida devuelve 401.
- [ ] Webhook duplicado no duplica venta/entitlement.
- [ ] Monto alterado desde cliente no cambia el precio server-side.
- [ ] `external_reference` incorrecta bloquea fulfillment.
- [ ] Orden aprobada genera código de compra y entitlement.
- [ ] Token de descarga vencido/ag agotado devuelve 410.
- [ ] Archivo inexistente -> 503 sin consumir una entrega.
- [ ] Reembolso/contracargo/fraude revoca o mantiene hold del entitlement.
- [ ] Configurar canal de correo transaccional y probar recuperación extremo a extremo.
- [ ] QA de seguridad, routing, artifact y secret-history scan verdes.
- [ ] Solo después: formalización tributaria y credenciales productivas.

## Deploy de sandbox
La rama Commerce incluye `Commerce Sandbox Artifact`, un workflow que genera un paquete production-like específico para BlueHosting con:

- runtime standalone;
- ruta Webhook configurada;
- Link de Pago externo conservado como fallback;
- pagos server-side apagados por defecto;
- `document-root-assets/` con los hashes exactos de `/_next/static` y `public` para evitar JH-OPS-001.

No compilar Next.js en BlueHosting.
