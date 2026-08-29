# Registro — Commerce sandbox artifact trazable al head exacto

Fecha: 2026-08-23

## Motivo

El workflow `pull_request` de GitHub Actions usa normalmente un merge ref sintético. Esto provocaba que `DEPLOYMENT.txt` mostrara el SHA del merge de prueba mientras la metadata del artifact mostraba el SHA del head del PR. No era una corrupción del paquete, pero sí una ambigüedad operativa inaceptable para un despliegue manual.

## Corrección

`Commerce Sandbox Artifact` ahora:

- hace checkout explícito del `pull_request.head.sha` cuando se ejecuta sobre un PR;
- usa `git rev-parse HEAD` como `Source commit` del paquete;
- conserva por separado `CI event SHA` para trazabilidad del evento GitHub;
- incluye `Next build ID`;
- incorpora `RELEASE-METADATA.json`;
- incorpora `SHA256SUMS.txt` para `server.js`, `package.json`, `DEPLOYMENT.txt`, `RELEASE-METADATA.json` y `.next/BUILD_ID`;
- mantiene pagos y checkout embebido desactivados durante el build production-like.

## Artifact validado

Workflow: `Commerce Sandbox Artifact` run #41 / run id `32659897083`.

- artifact id: `9498452321`;
- nombre: `joinhook-commerce-sandbox-productionlike`;
- tamaño: `28,523,142` bytes;
- GitHub artifact digest: `sha256:cbbb85c229abf58113efb92b7b019db5513d3e14812c9dddb4121dd43737cb32`;
- source/head commit: `1c7b921f3dfa9cefd89e6fdb30e179608620637e`;
- CI event/merge SHA: `18a30d7aaddb7e395430319032f7027817dff62b`;
- Next build ID: `9ZBbbBNnfGFf4Fpe-rt9I`;
- expiración del artifact en GitHub: 2026-09-06.

## Verificación local del ZIP descargado

Se descomprimió el artifact y se verificó:

- `Source commit` coincide exactamente con el head `1c7b921f...`;
- `sha256sum -c SHA256SUMS.txt` → todos los archivos `OK`;
- no existen archivos `.env*`, `.pem` ni `id_rsa*`;
- no se encontraron marcadores `sb_secret_`, `APP_USR-`, token TEST de Mercado Pago, `MERCADOPAGO_ACCESS_TOKEN=` ni `JOINHOOK_COMMERCE_SUPABASE_SECRET_KEY=`.

Smoke del runtime standalone con `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false`:

- `/` → HTTP 200;
- `/api/commerce/health/` → HTTP 200;
- `/checkout/control-gastronomico-express/` → HTTP 200;
- `GET /api/commerce/mercadopago/webhook/` → HTTP 405;
- `GET /api/commerce/webhooks/mercadopago/` → HTTP 405;
- `POST /api/commerce/create-order/` → HTTP 503 `commerce_payments_disabled`.

El comportamiento anterior confirma que el paquete ejecutable mantiene el kill switch cerrado y que ambas rutas Webhook están presentes antes de cualquier despliegue en BlueHosting.

## Gate

Este registro **no autoriza producción ni cobros reales**. El paquete solo queda preparado para sandbox controlado. El paso externo pendiente continúa siendo desplegarlo en BlueHosting y ejecutar smoke sobre el servidor real antes de activar cualquier prueba de pago TEST.
