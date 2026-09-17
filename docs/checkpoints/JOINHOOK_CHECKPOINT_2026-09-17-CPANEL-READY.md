# JoinHook Web — checkpoint cPanel readiness

Fecha: 2026-09-17
Repositorio: `fjcamp/joinhook`
Rama: `feat/joinhook-web-v1-followup`
PR: #47
HEAD de trabajo: `69d572596b09dc357913ba4e466ed04c8e833c4d`
Base: `main` / Web V1 `a29e433e7e5315424b9f264b6adc19d04f9370dc`

## Objetivo

Dejar JoinHook Web listo para una publicación controlada en BlueHosting/cPanel, evitando los fallos conocidos de Passenger, `/_next/static`, indexación de staging y mezcla de artifacts.

## Revisión técnica completada

- `next.config.js` usa `output: 'standalone'`, `trailingSlash: true` y desactiva `X-Powered-By`.
- Staging se distingue mediante `JOINHOOK_DEPLOY_TARGET=staging` y agrega `X-Robots-Tag: noindex, nofollow, noarchive`.
- Producción no debe usar el artifact de staging: el build de producción se genera separadamente por `production-artifact.yml`.
- `server.js` es el startup compatible con Passenger y toma `HOST`/`PORT` del entorno.
- `package.json` declara Node `>=20.20.2`, coincidente con el runtime de CI/BlueHosting.
- El flujo de producción prepara runtime Passenger y un espejo `document-root-assets/` con los mismos hashes de `/_next/static` y los mismos assets públicos del build.
- El flujo de producción verifica que el espejo de document root sea idéntico a `.next/static` y `public` antes de generar el artifact.
- El runbook de BlueHosting exige backup, rollback, runtime/asset del mismo build, reinicio Passenger y smoke test real.
- El incidente `JH-OPS-001` queda como control explícito contra el fallo conocido de HTML/404 en `/_next/static`.
- CGE permanece con checkout desactivado por defecto; no se incorpora ninguna URL de pago hardcodeada.

## Validación automatizada del HEAD

Para `69d572596b09dc357913ba4e466ed04c8e833c4d`:

- JoinHook Web CI #64: `success`.
- Secret History Scan #353: `success`.
- Build, lint, audit de runtime, presupuesto JS, rutas públicas, SEO/CGE, descubribilidad IA, JSON-LD, sitemap, robots, rutas legacy, headers de seguridad, PWA y smoke del artifact: validados por CI.

Artifact staging verificado localmente:

- Nombre: `joinhook-bluehosting-standalone`
- Artifact ID: `10489564841`
- Tamaño: `26,940,492` bytes
- SHA-256: `7face7adf07d43e0ad0c8426af343c6501e9c9a813c79679947984ac6f4879ff`
- Expiración: 2026-09-24

## Arquitectura cPanel objetivo

- Aplicación Passenger: `/home/joinhook/staging-joinhook` para staging.
- Aplicación Passenger: `/home/joinhook/joinhook-production` para producción.
- Document root: `/home/joinhook/public_html`.
- Startup: `server.js`.
- Node: `20.20.2`.
- No ejecutar `next build` en BlueHosting.

## Gate operativo

- [x] Código y rutas validados por CI.
- [x] Artifact reproducible de staging generado.
- [x] Artifact inspeccionado y checksum verificado.
- [x] Control contra mezcla de hashes documentado y automatizado para producción.
- [ ] Cargar artifact en staging mediante File Manager de cPanel.
- [ ] Reiniciar Passenger en staging.
- [ ] Ejecutar smoke test externo contra staging.
- [ ] QA visual desktop/móvil.
- [ ] Backup verificable de producción.
- [ ] Obtener artifact de producción generado desde `main` después del merge.
- [ ] Aprobación explícita para merge/publicación.
- [ ] Publicar en producción.
- [ ] Verificar `joinhook.cl` externamente y registrar resultado.

## Procedimiento físico sin SSH

1. Respaldar el contenido actual de `/home/joinhook/staging-joinhook` antes de reemplazarlo.
2. Subir `joinhook-bluehosting-standalone.zip` al directorio de staging.
3. Extraer el ZIP de forma que `server.js`, `package.json`, `.next/`, `public/` y `node_modules/` queden en la raíz de la aplicación.
4. No crear una segunda carpeta anidada accidentalmente.
5. En Passenger, seleccionar Node `20.20.2` y startup `server.js` según la configuración existente.
6. Reiniciar Passenger desde cPanel.
7. Ejecutar el smoke test real y revisar al menos un recurso `/_next/static/...` con HTTP 200 y contenido JS/CSS.
8. Si staging falla, restaurar el backup antes de continuar.

## Regla de publicación

El artifact de staging no se debe reutilizar como artifact de producción. Producción debe recibir el artifact generado por `production-artifact.yml` desde `main`, después del merge aprobado, y el runtime y `document-root-assets` deben provenir del mismo build.

Este checkpoint no declara producción desplegada. Declara el proyecto técnicamente preparado para el siguiente paso físico: carga y validación de staging en cPanel.
