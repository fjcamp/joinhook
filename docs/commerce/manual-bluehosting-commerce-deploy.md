# JoinHook Commerce — despliegue manual seguro en BlueHosting

Este procedimiento es el fallback cuando SSH/Jailed Shell no está disponible. Está diseñado para **no repetir JH-OPS-001, JH-OPS-002 ni JH-OPS-003**.

## Principios

- Nunca compilar con `next build` en BlueHosting.
- Nunca mezclar runtime y `/_next/static` de builds distintos.
- Nunca reemplazar `.htaccess` completo sin respaldo.
- Nunca habilitar pagos durante el despliegue técnico.
- Nunca considerar listo un deploy solo porque `/` responde 200.

## Gate 0 — artifact autorizado

Antes de abrir cPanel:

1. Identificar el SHA exacto del head aprobado del PR.
2. Confirmar CI verde: Security, Routing, Secret History, Sandbox Artifact y Redesign.
3. Descargar el artifact `joinhook-commerce-sandbox-productionlike` correspondiente **a ese mismo SHA**.
4. Revisar `RELEASE-METADATA.json` y `DEPLOYMENT.txt`.
5. Verificar `SHA256SUMS.txt` antes de copiar archivos.
6. Confirmar que el ZIP no contiene `.env`, llaves privadas ni secretos.

Si cualquier identidad/hash no coincide, detener el deploy.

## Gate 1 — backup de BlueHosting

Respaldar fuera de las rutas activas:

- `/home/joinhook/joinhook-production` completo o al menos el runtime activo;
- `/home/joinhook/public_html/_next/static`;
- assets públicos que serán sobrescritos;
- `/home/joinhook/public_html/.htaccess`;
- registrar fecha/hora y build previo.

No borrar WordPress legado durante este procedimiento.

## Gate 2 — variables y política segura

Antes de reiniciar:

- `JOINHOOK_COMMERCE_ENV=test`
- `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false`
- `JOINHOOK_COMMERCE_CHECKOUT_ENABLED=false` hasta el tramo deliberado de sandbox
- URL/secret key de Supabase Commerce server-side configuradas
- credenciales TEST de Mercado Pago server-side

Los secretos auxiliares de descarga/recuperación y el archivo privado se configuran solo cuando corresponda probar esa fase. Nunca colocar el archivo vendido dentro de `public_html`.

## Gate 3 — reemplazo del runtime

Destino:

`/home/joinhook/joinhook-production`

1. Extraer el artifact en una carpeta temporal primero si cPanel lo permite.
2. Verificar que existan `server.js`, `.next`, `node_modules`, `public`, `document-root-assets` y metadatos de release.
3. Sustituir el runtime de forma completa y coherente; evitar una mezcla parcial con archivos del build anterior.
4. No tocar `.htaccess` en esta etapa.

## Gate 4 — sincronización del document root (JH-OPS-001)

Copiar **el contenido** de:

`/home/joinhook/joinhook-production/document-root-assets/`

hacia:

`/home/joinhook/public_html/`

Debe quedar, entre otros:

`/home/joinhook/public_html/_next/static/...`

No crear `_next/static/static`.

Runtime y document-root-assets deben venir del mismo artifact.

## Gate 5 — routing heredado (JH-OPS-002)

Revisar `.htaccess`:

- conservar bloque CloudLinux Passenger;
- no reintroducir el rewrite global de WordPress que interceptaba rutas Next.js;
- si existe cualquier duda, comparar con el respaldo antes de editar;
- no hacer cambios amplios de routing durante el mismo deploy salvo que exista evidencia.

## Gate 6 — restart Passenger

Desde `Setup Node.js App`, reiniciar `joinhook.cl`.

Luego revisar:

`/home/joinhook/logs/production-passenger.log`

Esperar arranque normal de Next.js/Passenger y ausencia de crash loop.

## Gate 7 — smoke test obligatorio

### Sitio

- `/` → 200
- `/herramientas/control-gastronomico-express/` → 200
- `/checkout/control-gastronomico-express/` → 200
- `/privacidad/` → 200
- `/_next/static/...` de un hash real → 200 + MIME correcto
- asset público nuevo → 200

### Commerce

- `/api/commerce/health/` → 200
- `/api/commerce/public-config/` → 200 con checkout deshabilitado inicialmente
- GET `/api/commerce/mercadopago/webhook/` → 405
- GET `/api/commerce/webhooks/mercadopago/` → 405
- la forma sin slash puede redirigir 308, pero Mercado Pago debe usar la forma canónica con `/`
- POST `/api/commerce/create-order/` con kill switch false → 503 `commerce_payments_disabled`

Si Webhook da 404: revisar JH-OPS-003.  
Si CSS/JS dan 404: revisar JH-OPS-001.  
Si rutas son capturadas por WordPress: revisar JH-OPS-002.

## Gate 8 — revisión visual

- Home desktop y móvil.
- Carrusel JoinOps/SnowWise/Mi Gestión.
- CTA de Control Express.
- Tema claro/oscuro.
- PWA existente.
- DevTools Network sin cascada de 404 de assets.

## Gate 9 — solo después: sandbox deliberado

Una vez estable producción técnica:

1. registrar en Mercado Pago exactamente `https://joinhook.cl/api/commerce/mercadopago/webhook/`;
2. habilitar checkout TEST cuando corresponda;
3. mantener credenciales productivas ausentes;
4. ejecutar matriz aprobada/rechazada/pending/idempotencia/webhooks/reembolsos/contracargos;
5. volver a cerrar el switch si se interrumpe la sesión de pruebas.

## Rollback

Ante smoke test fallido:

1. restaurar runtime anterior;
2. restaurar `_next/static`/document-root assets del mismo build anterior;
3. restaurar `.htaccess` solo si fue modificado;
4. reiniciar Passenger;
5. repetir smoke test;
6. documentar el fallo antes del próximo intento.

## Criterio de éxito

Un deploy manual solo se declara exitoso cuando:

- identidad del artifact verificada;
- runtime + document root sincronizados;
- Passenger estable;
- assets 200;
- rutas dinámicas correctas;
- Webhook 405 en GET;
- health 200;
- create-order bloqueado por política antes del sandbox;
- revisión visual mínima aprobada.
