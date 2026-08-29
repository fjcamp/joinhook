# RMDC — 2026-08-23 — JoinHook Commerce sandbox, Webhook y recuperación

## Propósito

Continuidad operativa del desarrollo de JoinHook Commerce después de provisionar la base dedicada y configurar la aplicación de pruebas de Mercado Pago. Este registro complementa `2026-08-22-rmdc-commerce-federated.md`.

## Autorización vigente

El usuario autorizó continuar el desarrollo, integración, documentación, QA y preparación de despliegue sin volver a solicitar permisos sobre decisiones ya aprobadas. Solo corresponde detenerse cuando haga falta una credencial/permiso externo no disponible, exista costo nuevo, una acción irreversible, aceptación contractual/legal o un riesgo de seguridad que requiera intervención humana.

## Configuración externa completada

### Supabase

- Proyecto independiente: **JoinHook Commerce**.
- Región: `sa-east-1`.
- Estado: `ACTIVE_HEALTHY`.
- Secret API key moderna creada por el titular y configurada directamente en cPanel como `JOINHOOK_COMMERCE_SUPABASE_SECRET_KEY` sin compartir su valor en conversación/GitHub.
- URL del proyecto configurada en cPanel como `JOINHOOK_COMMERCE_SUPABASE_URL`.
- SnowWise permanece en su base/proyecto separado.

### Mercado Pago TEST

Aplicación creada por el titular con:

- Nombre: **JoinHook Commerce**.
- Tipo: Pagos online.
- Desarrollo propio.
- Solución: Checkout API.
- API: Orders.
- Credenciales de prueba activadas.

Configurado directamente en cPanel, sin compartir secretos:

- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` (TEST).
- `MERCADOPAGO_ACCESS_TOKEN` (TEST).
- `MERCADOPAGO_WEBHOOK_SECRET` (TEST).

Webhook de prueba registrado en Mercado Pago:

`https://joinhook.cl/api/commerce/mercadopago/webhook`

Evento habilitado inicialmente:

- `Order (Mercado Pago)`.

Los tópicos de fraude, reclamos y contracargos quedan para una fase de postventa controlada una vez que el flujo base esté probado.

## JH-OPS-003 — Webhook aún no presente en deployment productivo

Al abrir la URL registrada del Webhook, `joinhook.cl` respondió con su 404 personalizado. Passenger y el sitio estaban operativos; la causa fue que el runtime productivo aún no contiene la rama Commerce.

Además se detectó una diferencia de ruta entre la URL externa registrada y el handler inicial. Se corrigió agregando un alias estable:

- URL externa/canónica: `/api/commerce/mercadopago/webhook`.
- handler autoritativo interno: `/api/commerce/webhooks/mercadopago`.

Ambas rutas comparten una sola implementación de firma, idempotencia y fulfillment. Commerce Routing CI exige ahora `405` ante GET en ambas rutas para impedir regresiones a 404.

Documento: `docs/knowledge-base/incidents/JH-OPS-003-commerce-webhook-route-not-deployed.md`.

## Runtime config sin recompilar

Se detectó que depender exclusivamente de variables `NEXT_PUBLIC_*` en un artifact Next.js precompilado no es apropiado para activar/desactivar sandbox desde cPanel. Se implementó configuración pública segura en runtime:

- `GET /api/commerce/public-config`.
- `JOINHOOK_COMMERCE_CHECKOUT_ENABLED` como switch runtime preferido.
- `MERCADOPAGO_PUBLIC_KEY` como nombre runtime preferido, manteniendo compatibilidad con `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`.

El endpoint solo expone datos seguros para el navegador: estado del checkout, ambiente y Public Key. Access Token, Webhook Secret y claves Supabase nunca salen del backend.

El kill switch real continúa independiente:

`JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false`

Por lo tanto, mostrar/cargar el Brick y autorizar la creación de pagos son dos decisiones separadas.

## Data Pass — metodología codificada

Se formalizó `DataPassContractV1` en el Control Plane. Todo pase entre proyecto/microservicio debe declarar como mínimo:

- origen y consumidor;
- propósito;
- clasificación del dato;
- campos explícitamente permitidos;
- transporte;
- dirección (`read-only`, `event-only` o `command`);
- retención;
- scope de autenticación;
- auditoría;
- mecanismo de revocación;
- fundamento/política cuando corresponda.

Regla: ausencia del campo en el contrato = denegado. No se utilizará acceso DB-to-DB indiscriminado como integración ordinaria.

Primeros Data Pass registrados:

- SnowWise → JoinHook Control Plane: salud/versión/uso agregado/incidencias.
- JoinHook Commerce → Revenue Intelligence: eventos comerciales minimizados, sin secretos de pago ni correo por defecto.
- SnowWise → JoinHook Commerce: comando para crear una orden, sin acceso a la DB de Commerce.

## Recuperación segura de compra

Se implementó una primera versión completa en código y persistencia:

- `/recuperar-compra`.
- `POST /api/commerce/recovery/request`.
- `POST /api/commerce/recovery/claim`.
- `commerce_recovery_requests`.
- `commerce_recovery_tokens`.
- RPC `consume_commerce_recovery_token`.

Propiedades:

- misma respuesta ante match/no-match para reducir enumeración;
- rate limit persistido por fingerprint HMAC;
- token crudo nunca guardado en Postgres;
- expiración y revocación;
- consumo único atómico;
- token ligado al código de orden esperado en la misma operación atómica;
- al recuperar, se rota el claim de compra y se emite una nueva cookie HttpOnly;
- políticas RLS explícitas de denegación para `anon`/`authenticated`;
- Security Advisor de Supabase volvió a quedar sin hallazgos tras el hardening.

La entrega del correo usa un adapter HTTPS server-to-server preparado para un servicio transaccional/n8n aprobado. El token crudo solo existe en memoria durante la construcción del mensaje.

Variables externas todavía no configuradas:

- `JOINHOOK_RECOVERY_TOKEN_SECRET`.
- `JOINHOOK_TRANSACTIONAL_EMAIL_WEBHOOK_URL`.
- `JOINHOOK_TRANSACTIONAL_EMAIL_WEBHOOK_SECRET`.

## Entrega digital — variables externas aún pendientes

Antes de una compra sandbox aprobada real se deberá configurar directamente en cPanel, sin compartir valores en conversaciones:

- `JOINHOOK_DOWNLOAD_TOKEN_SECRET`.
- `JOINHOOK_DOWNLOAD_IP_HASH_SALT` (recomendado para auditoría seudonimizada).
- `JOINHOOK_GASTRO_EXPRESS_PRIVATE_FILE` con una ruta fuera de `public_html`.

El producto no se libera hasta que Orders API confirme `processed/accredited`, coincidan monto y `external_reference`, y exista un entitlement activo.

## Artifact específico para sandbox sobre BlueHosting

Se agregó workflow **Commerce Sandbox Artifact** que genera:

`joinhook-commerce-sandbox-productionlike`

Características:

- build production-like, no staging/noindex;
- Webhook canónico incluido;
- kill switch de pagos deshabilitado por defecto;
- Link de Pago externo preservado como fallback;
- runtime standalone;
- `document-root-assets/` para sincronizar exactamente `/_next/static` y `public`, evitando JH-OPS-001.

Runbook: `docs/commerce/bluehosting-sandbox-deploy.md`.

## Despliegue automatizado — preparado, pendiente de acceso SSH

Se creó workflow manual **BlueHosting Commerce Deploy**:

`.github/workflows/deploy-bluehosting-commerce.yml`

Características:

- `workflow_dispatch` con frase de confirmación explícita;
- build/audit/lint previo;
- prueba local de Webhook y kill switch;
- SSH con `known_hosts` fijado;
- upload de release a `/home/joinhook/releases`;
- switch del runtime Passenger;
- sincronización exacta de document-root assets;
- smoke test público de home + Webhook 405;
- rollback automático del runtime y assets si falla el smoke test.

No puede ejecutarse todavía porque el asistente no tiene acceso SSH/SFTP de BlueHosting. Para habilitarlo en el futuro se requieren GitHub Actions Secrets:

- `BLUEHOSTING_SSH_HOST`.
- `BLUEHOSTING_SSH_PORT`.
- `BLUEHOSTING_SSH_USER`.
- `BLUEHOSTING_SSH_PRIVATE_KEY`.
- `BLUEHOSTING_SSH_KNOWN_HOSTS`.

No se solicitarán ni almacenarán contraseñas/llaves en el repositorio o conversación.

## Referencias oficiales verificadas para postventa

Mercado Pago Orders permite reembolsos totales/parciales con endpoint propio y `X-Idempotency-Key`. Los Webhooks opcionales de reclamos y contracargos deben llevar a una lectura server-side del recurso (`/post-purchase/v1/claims/{id}` y `/v1/chargebacks/{id}` respectivamente) antes de automatizar una decisión de postventa. Alertas de fraude requieren una respuesta rápida y deben impedir la entrega.

La implementación mantiene por ahora una postura conservadora: cualquier señal postventa correlacionada suspende/revoca acceso; recursos que aún no pueden correlacionarse de forma segura quedan auditados para reconciliación, no se adivina la relación.

## Próximo gate operativo

1. Esperar CI verde del head actual del PR #31.
2. Obtener el artifact `joinhook-commerce-sandbox-productionlike` correspondiente exactamente a ese head.
3. Desplegar a BlueHosting. Mientras no exista SSH habilitado, este paso requiere intervención en cPanel.
4. Confirmar que GET `https://joinhook.cl/api/commerce/mercadopago/webhook` devuelve 405, no 404.
5. Simular Webhook Order desde Mercado Pago.
6. Configurar secretos de entrega + paquete privado.
7. Habilitar conscientemente el checkout TEST y el kill switch de pagos solo durante la matriz sandbox.
8. Ejecutar aprobado/rechazado/pending, duplicados, firma inválida, monto/reference incorrectos, refund/chargeback y descarga.
9. Configurar/probar canal transaccional de recuperación.
10. Solo después considerar READY técnico; formalización tributaria precede cobros productivos.
