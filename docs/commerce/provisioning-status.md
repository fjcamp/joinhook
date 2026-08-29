# JoinHook Commerce — provisioning status

Fecha de actualización: 2026-08-22

## Infraestructura

- Proyecto Supabase dedicado **JoinHook Commerce**: creado y saludable.
- Costo informado por Supabase al momento de creación: **$0 mensual**.
- Región: `sa-east-1`.
- SnowWise permanece en su proyecto/base independiente.
- JoinHook Commerce no comparte tablas, credenciales ni RLS con SnowWise.

## Migraciones aplicadas

1. `commerce_core_v1`
2. `harden_commerce_api_privileges`
3. `index_commerce_foreign_keys`
4. `explicitly_deny_commerce_client_access`
5. `expand_commerce_order_statuses`
6. `index_commerce_provider_payment_id`

El archivo canónico de referencia es `docs/commerce/schema.sql`.

## Seguridad verificada

- RLS habilitado en todas las tablas Commerce.
- `anon` y `authenticated` no tienen privilegios de lectura sobre `commerce_orders`.
- Políticas explícitas de denegación para roles de navegador.
- RPCs `preview_commerce_download_token` y `consume_commerce_download_token` no son ejecutables por `PUBLIC`, `anon` ni `authenticated`.
- El rol backend elevado conserva la ejecución de las RPCs backend-only.
- Supabase Security Advisor: **sin hallazgos** después del hardening.
- Secret History Scan de GitHub debe permanecer verde.
- No se documentan URL interna, claves backend, Access Token ni Webhook Secret reales en este repositorio público.

## Clave server-side de Supabase

La configuración nueva debe preferir una **Secret key moderna de Supabase** (`sb_secret_...`) mediante:

`JOINHOOK_COMMERCE_SUPABASE_SECRET_KEY`

El runtime la envía en el header `apikey`. No se envía como `Authorization: Bearer`, porque las Secret keys modernas no son JWT.

El código conserva soporte temporal para el JWT histórico `service_role` mediante `JOINHOOK_COMMERCE_SUPABASE_SERVICE_ROLE_KEY`, únicamente para migraciones/compatibilidad. Las nuevas instalaciones deben usar la Secret key moderna.

Reglas:

- nunca exponer `sb_secret_...` en variables `NEXT_PUBLIC_*`;
- nunca copiarla a GitHub, documentación, chat o correo;
- configurarla directamente en el runtime/hosting server-side;
- rotarla si existe cualquier sospecha de exposición.

## Prueba de integridad ejecutada

Se ejecutó una prueba transaccional de QA sobre una compra sintética y se verificó:

- preview inicial de 2 usos;
- primer consumo deja 1;
- segundo consumo deja 0;
- tercer consumo devuelve 0 filas;
- contador del token = 2;
- contador global del entitlement = 2;
- datos sintéticos eliminados al finalizar.

Resultado: `commerce_download_atomicity_ok`.

## Enrutamiento comercial

Cuando `NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED=true`, los CTA de Control Express deben permanecer en `joinhook.cl` y dirigir a:

`/checkout/control-gastronomico-express`

Mientras la integración embebida permanezca deshabilitada, puede utilizarse temporalmente el Link de Pago externo mediante:

- `NEXT_PUBLIC_CONTROL_EXPRESS_CHECKOUT_ENABLED`
- `NEXT_PUBLIC_CONTROL_EXPRESS_CHECKOUT_URL`

Las variables históricas con prefijo `CGE` solo se mantienen como aliases de compatibilidad y no deben utilizarse en nuevas configuraciones.

## Doble habilitación necesaria para cobros

Un cobro nuevo solo puede iniciarse cuando ambos controles están habilitados de forma deliberada:

1. `NEXT_PUBLIC_JOINHOOK_COMMERCE_ENABLED=true` — experiencia frontend.
2. `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=true` — autorización server-side.

El segundo debe permanecer `false` hasta completar sandbox y formalización tributaria.

## Pendientes para sandbox real

1. Crear una Secret key moderna de Supabase para JoinHook Commerce y configurarla directamente en el runtime como `JOINHOOK_COMMERCE_SUPABASE_SECRET_KEY`.
2. Crear/configurar la aplicación Mercado Pago de pruebas.
3. Configurar Public Key, Access Token y Webhook Secret de test sin copiarlos al repositorio ni a conversaciones.
4. Ubicar el artefacto privado definitivo fuera de `public_html`.
5. Ejecutar matriz completa de pagos, Webhooks y descargas.
6. Implementar recuperación/correo transaccional y handlers postventa.
