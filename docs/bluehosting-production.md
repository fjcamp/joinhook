# JoinHook — producción en BlueHosting/cPanel

Este runbook es la referencia operativa para publicar `joinhook.cl` desde el artifact validado de GitHub Actions.

## Arquitectura actual

- Dominio público: `https://joinhook.cl`
- Runtime Next.js/Passenger: `/home/joinhook/joinhook-production`
- Document root Apache/LiteSpeed: `/home/joinhook/public_html`
- Node.js: `20.20.2`
- Modo: `Production`
- Startup: `server.js`
- Log Passenger: `/home/joinhook/logs/production-passenger.log`
- Staging: `https://staging.joinhook.cl` → `/home/joinhook/staging-joinhook`

## Flujo autoritativo

```text
cambio de código
  ↓
rama + Pull Request
  ↓
GitHub Actions: audit + lint + build + QA
  ↓
artifact versionado y verificado
  ↓
BlueHosting Passenger + sincronización document root
  ↓
smoke test real
```

No ejecutar `next build` en BlueHosting: el hosting compartido ya mostró límites de memoria LVE/WASM.

## Regla de identidad del release

Antes de desplegar un artifact:

1. el SHA del head aprobado debe coincidir con `RELEASE-METADATA.json`/`DEPLOYMENT.txt`;
2. `SHA256SUMS.txt` debe validar el contenido del paquete cuando esté disponible;
3. CI correspondiente a ese mismo head debe estar verde;
4. no se reutiliza un artifact de un commit anterior solo porque tiene el mismo nombre.

## Contenido del artifact

El artifact de producción contiene dos piezas distintas:

1. **Runtime Passenger**: `server.js`, `.next`, `node_modules`, `public`, `package.json`, etc. Se instala en `/home/joinhook/joinhook-production`.
2. **Mirror para document root**: `document-root-assets/`. Se copia a `/home/joinhook/public_html` y contiene los assets públicos + `/_next/static` del **mismo build**.

Esto es obligatorio porque Passenger ejecuta Next.js fuera del document root y Apache/LiteSpeed debe poder resolver directamente los hashes de `/_next/static`.

## Incidentes históricos que deben revisarse antes de cada deploy

- **JH-OPS-001:** runtime desplegado sin sincronizar `document-root-assets` → CSS/JS/recursos `/_next/static` en 404.
- **JH-OPS-002:** rewrite WordPress legado en `.htaccess` interceptó rutas Next.js → conservar Passenger y eliminar solo reglas heredadas conflictivas.
- **JH-OPS-003:** Webhook Commerce probado contra un runtime que aún no contenía Commerce y URL no canónica → validar ruta desplegada y usar slash final.

Referencias:

- `docs/knowledge-base/incidents/JH-OPS-001-next-static-assets-bluehosting.md`
- `docs/knowledge-base/incidents/JH-OPS-002-wordpress-rewrite-intercepts-next-routes.md`
- `docs/knowledge-base/incidents/JH-OPS-003-commerce-webhook-route-not-deployed.md`

## Despliegue

1. Confirmar CI verde para el commit objetivo.
2. Descargar artifact del mismo SHA y verificar metadata/checksums.
3. Mantener un ZIP/copia del runtime anterior como rollback.
4. Respaldar `.htaccess` y el mirror activo de `_next/static`.
5. Reemplazar el contenido operativo de `/home/joinhook/joinhook-production` por el nuevo runtime del artifact.
6. Copiar el **contenido** de `document-root-assets/` dentro de `/home/joinhook/public_html/`.
7. No crear accidentalmente `_next/static/static`.
8. Confirmar que `.htaccess` conserva Passenger y no reintroduce el rewrite global de WordPress.
9. Reiniciar la aplicación `joinhook.cl` en Setup Node.js App.
10. Abrir `production-passenger.log`; Next.js debe quedar `Ready` sin crash.
11. Abrir `joinhook.cl` con recarga forzada.
12. En DevTools → Network verificar que una URL real `/_next/static/chunks/<hash>.js` responde `200`, no `404`/HTML.

## Smoke test mínimo

- `/`
- `/#proyectos`
- `/herramientas/control-gastronomico-express/`
- `/app/control-gastronomico-express/`
- `/privacidad/`
- `/condiciones-beta/`
- `/robots.txt`
- `/sitemap.xml`
- `/cge-manifest.webmanifest`
- `/project-covers/joinops-cover.svg`
- `/project-covers/snowwise-cover.svg`
- `/project-covers/mi-gestion-cover.svg`

Si el release incluye Commerce, agregar obligatoriamente:

- `/api/commerce/health/` → 200
- `/api/commerce/public-config/` → 200
- GET `/api/commerce/mercadopago/webhook/` → 405
- GET `/api/commerce/webhooks/mercadopago/` → 405
- POST `/api/commerce/create-order/` con `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false` → 503 `commerce_payments_disabled`

La URL externa de Mercado Pago debe quedar en forma canónica:

`https://joinhook.cl/api/commerce/mercadopago/webhook/`

No depender del `308` de la variante sin slash para un Webhook POST.

Comprobar además:

- Home desktop y móvil.
- Carrusel de proyectos.
- Cambio JoinOps ↔ SnowWise ↔ Mi Gestión.
- Modo claro/oscuro.
- CTA de Control Gastronómico Express.
- Checkout/fallback según política de la fase.
- PWA de Control Express y continuidad offline.
- Headers de seguridad.

## Fallback manual de Commerce

Mientras BlueHosting no habilite SSH/Jailed Shell, usar el procedimiento específico:

`docs/commerce/manual-bluehosting-commerce-deploy.md`

Ese checklist obliga a verificar artifact, backup, runtime, document-root, `.htaccess`, kill switch y smoke test antes de iniciar sandbox.

## WordPress legado

Mientras exista necesidad de rollback, no eliminar de inmediato los archivos antiguos de WordPress en `public_html`. Una vez cerrada la validación y respaldado el sitio anterior:

- retirar el runtime/archivos WordPress que ya no sean necesarios;
- conservar el respaldo fuera de `public_html`;
- simplificar `.htaccess` sin tocar el bloque CloudLinux Passenger;
- revisar que ninguna regla WordPress intercepte rutas Next.js.

## Rollback

1. Conservar el runtime anterior de `joinhook-production`.
2. Conservar el mirror anterior de `_next/static` si se necesita reversión exacta.
3. Conservar copia de `.htaccess` anterior.
4. Si el despliegue falla, restaurar runtime + document-root assets del mismo build.
5. Restaurar `.htaccess` solo si fue modificado.
6. Reiniciar Passenger.
7. Repetir smoke test.

Nunca mezclar runtime de un commit con `_next/static` de otro commit: los hashes deben corresponder al mismo build.
