# JH-OPS-001 — Next.js carga sin estilos en BlueHosting/cPanel

**Fecha de origen:** 2026-08-21  
**Estado:** Incidente histórico documentado; solución incorporada al flujo de despliegue  
**Entornos afectados:** `staging.joinhook.cl` (antecedente) y `joinhook.cl` (producción)  
**Stack del incidente histórico:** Next.js 16.3.x, Node.js 20.20.2, cPanel, CloudLinux Passenger, Apache/LiteSpeed, WordPress legado en `public_html`.

## Resumen

Durante una promoción de la nueva web JoinHook desde staging hacia `joinhook.cl`, la aplicación Next.js arrancaba y generaba correctamente el HTML, pero los recursos estáticos bajo `/_next/static/...` devolvían 404. El sitio aparecía prácticamente sin diseño.

El aprendizaje permanente de este incidente es que el **runtime Next.js y el document root público deben desplegarse como una unidad del mismo build** cuando Apache/LiteSpeed sirve los assets públicos desde `public_html`.

## Arquitectura relevante

Producción:

- Aplicación Node/Next: `/home/joinhook/joinhook-production`
- Document root del dominio: `/home/joinhook/public_html`
- Passenger log: `/home/joinhook/logs/production-passenger.log`
- Node: `20.20.2`
- Startup: `server.js`

Staging equivalente:

- Aplicación: `/home/joinhook/staging-joinhook`
- Document root: `/home/joinhook/public_html/staging.joinhook.cl`
- Log: `/home/joinhook/logs/staging-passenger.log`

## Síntomas

1. `https://joinhook.cl/` entregaba el HTML correcto de la nueva web.
2. El diseño, estilos e interacción no cargaban.
3. DevTools/Network mostraba errores bajo `/_next/static/...`.
4. Una petición de ejemplo `/_next/static/chunks/<hash>.js` respondía 404 con `Content-Type: text/html`.

## Causa raíz

El runtime de Next.js y el document root público estaban en directorios diferentes.

Los assets existían en:

```text
/home/joinhook/joinhook-production/.next/static
```

pero el navegador solicitaba:

```text
https://joinhook.cl/_next/static/...
```

Apache buscaba esa ruta dentro de:

```text
/home/joinhook/public_html/_next/static
```

Las reglas heredadas del sitio anterior también podían dirigir las peticiones faltantes hacia HTML/WordPress en lugar del archivo estático esperado.

## Solución validada en el incidente

Se sincronizó la ruta pública:

```text
/home/joinhook/public_html/_next/static
```

con el contenido exacto del `.next/static` perteneciente al build activo.

También se verificaron assets públicos específicos y se recargó el sitio después de reiniciar Passenger cuando correspondía.

## Lecciones operativas

- Reiniciar Passenger no corrige un asset que Apache no encuentra en su document root.
- La existencia de `.next/static` dentro del runtime no garantiza por sí sola que Apache exponga `/_next/static`.
- Los hashes del build activo deben coincidir entre runtime y document root.
- No modificar `.htaccess` a ciegas: primero identificar URL, status y `Content-Type` del recurso fallido.
- No asumir que un nuevo deploy está completo hasta probar al menos un chunk JS real y un asset público real.

## Recurrencia y corrección de proceso

El incidente volvió a aparecer después de extraer un nuevo artefacto en `/home/joinhook/joinhook-production` y reiniciar Passenger **antes de sincronizar el document root**. También se observaron 404 en assets públicos nuevos como `/project-covers/joinops-cover.svg`.

La corrección de proceso quedó incorporada al packaging de BlueHosting: el artefacto puede incluir una carpeta `document-root-assets/` con los recursos que deben reflejarse en `public_html` para el mismo build.

### Orden obligatorio de despliegue

1. Extraer el artefacto aprobado en el directorio runtime correspondiente.
2. Sincronizar el contenido de `document-root-assets/` con el document root público antes de declarar terminado el deploy.
3. Verificar un asset real de `/_next/static/chunks/<hash>.js`.
4. Verificar un asset público nuevo, por ejemplo `/project-covers/joinops-cover.svg`.
5. Reiniciar Passenger cuando haya cambios de runtime.
6. Ejecutar smoke test y QA.

**Regla:** no declarar un despliegue completado ni solicitar revisión visual hasta que runtime + assets del document root correspondan al mismo SHA/build.

## Estado actual del proceso

Este incidente ya no representa una instrucción para compilar en BlueHosting. El flujo vigente es:

```text
GitHub Actions
    ↓
next build / standalone
    ↓
smoke tests
    ↓
artefacto BlueHosting
    ↓
runtime + document-root-assets
    ↓
BlueHosting / Passenger
    ↓
smoke test externo
```

La versión concreta del stack debe consultarse siempre en el commit/artefacto desplegado; este documento no fija la versión actual de Next.js.

## Diagnóstico rápido si reaparece

1. Revisar Passenger: si Next está `Ready`, continuar.
2. DevTools → Network → filtrar CSS/JS.
3. Tomar una URL real `/_next/static/...` que falle.
4. Verificar que el archivo exista en `.next/static` del build activo.
5. Verificar que el mismo archivo exista bajo `public_html/_next/static`.
6. Si existe y sigue devolviendo 404, revisar permisos, `.htaccess` y routing Apache/LiteSpeed.
7. Si responde 200 con MIME correcto, investigar caché o mismatch de build.

## Etiquetas

`nextjs` `cpanel` `cloudlinux` `passenger` `apache` `litespeed` `bluehosting` `static-assets` `_next` `404` `wordpress` `document-root` `production` `staging` `deploy` `document-root-assets`
