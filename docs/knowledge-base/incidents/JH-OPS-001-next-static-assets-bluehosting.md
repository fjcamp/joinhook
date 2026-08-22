# JH-OPS-001 — Next.js carga sin estilos en BlueHosting/cPanel

**Fecha:** 2026-08-21  
**Estado:** Resuelto y validado en producción  
**Entornos afectados:** `staging.joinhook.cl` (antecedente) y `joinhook.cl` (producción)  
**Stack:** Next.js 16.3.0, Node.js 20.20.2, cPanel, CloudLinux Passenger, Apache/LiteSpeed, WordPress legado en `public_html`.

## Resumen

Al promover la nueva web JoinHook desde staging hacia `joinhook.cl`, la aplicación Next.js arrancaba y generaba correctamente el HTML, pero el sitio se mostraba prácticamente sin diseño. Los recursos CSS/JS solicitados bajo `/_next/static/...` devolvían 404.

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

1. `https://joinhook.cl/` entregaba el contenido HTML correcto de la nueva web.
2. El diseño, estilos e interacción no cargaban.
3. DevTools/Network mostraba múltiples CSS/JS fallando bajo `/_next/static/...`.
4. Una petición concreta, por ejemplo `/_next/static/chunks/<hash>.js`, respondía `404 Not Found` y `Content-Type: text/html`.

## Evidencia que descartó un fallo de Node/Next

El log de Passenger mostraba arranque normal:

```text
Next.js 16.3.0
Local:   http://0.0.0.0:3000
Network: http://0.0.0.0:3000
Ready
Running next.config
```

Además, el artifact contenía `.next/static`, `chunks` y el Build ID. Por tanto, el build no estaba incompleto y Passenger no estaba fallando al iniciar.

## Causa raíz

El runtime de Next.js y el document root público de Apache estaban en directorios diferentes.

Los assets existían físicamente en:

```text
/home/joinhook/joinhook-production/.next/static
```

pero el navegador los solicitaba como:

```text
https://joinhook.cl/_next/static/...
```

Apache buscaba esa ruta dentro de:

```text
/home/joinhook/public_html/_next/static
```

El `.htaccess` de `public_html` todavía contenía reglas de WordPress. Cuando el archivo solicitado no existía físicamente en el document root, la petición podía terminar en el routing legado/HTML, explicando el `404` con `Content-Type: text/html`.

## Solución validada

Crear/sincronizar la ruta pública:

```text
/home/joinhook/public_html/_next/static
```

con **el contenido exacto del build activo** ubicado en:

```text
/home/joinhook/joinhook-production/.next/static
```

Procedimiento que resolvió producción:

1. Crear `public_html/_next/static` si no existe.
2. Copiar **el contenido de** `joinhook-production/.next/static` hacia `public_html/_next/static`.
3. No crear accidentalmente `static/static`.
4. Confirmar físicamente un asset cuyo nombre/hash esté siendo solicitado por DevTools.
5. Abrir directamente `https://joinhook.cl/_next/static/chunks/<archivo-real>.js` y comprobar que deja de responder 404/HTML.
6. Recargar `joinhook.cl` con `Ctrl + F5`.
7. Resultado: estilos y JavaScript cargaron correctamente.

## Intentos que no bastaron / lecciones

- Reiniciar Passenger no resuelve un asset que Apache no encuentra en su document root.
- El hecho de que `.next/static` exista dentro del runtime no garantiza que Apache lo exponga en `/_next/static`.
- Copiar assets sin comprobar los hashes del build activo puede dejar un conjunto desactualizado y mantener los 404.
- No conviene modificar `.htaccess` a ciegas. Primero comprobar la URL exacta fallida, status code y `Content-Type` en DevTools.
- No era necesario recompilar, ejecutar `npm install` ni reemplazar `node_modules` para este incidente.

## Diagnóstico rápido si reaparece

1. Revisar Passenger log: si Next está `Ready`, continuar.
2. DevTools → Network → filtrar CSS/JS.
3. Tomar una URL real `/_next/static/...` que falle.
4. Verificar que ese archivo exista en el `.next/static` del build activo.
5. Verificar que el mismo archivo exista en el document root público bajo `_next/static`.
6. Si existe y aún devuelve 404, revisar `.htaccess`, permisos y routing Apache/LiteSpeed.
7. Si devuelve `200` + MIME correcto, investigar caché/build mismatch en lugar de Passenger.

## Recurrencia 2026-08-22 — despliegue del asistente

El incidente reapareció al extraer un nuevo artifact en `/home/joinhook/joinhook-production` y reiniciar Passenger **antes de sincronizar el document root**. El video de diagnóstico mostró además `404 Not Found` para assets públicos nuevos como `/project-covers/joinops-cover.svg` y `/project-covers/mi-gestion-cover.svg`.

La conclusión operativa es más amplia que el incidente original: **cada despliegue de producción debe tratar el runtime y el document root como una unidad inseparable del mismo build**.

El artifact actual ya contiene `document-root-assets/`, preparado por CI con:

- `document-root-assets/_next/static/` → mirror exacto del build activo.
- assets públicos de `public/`, incluidos `project-covers`, iconos, manifest, favicon y demás recursos estáticos.

### Orden obligatorio de despliegue desde ahora

1. Extraer el artifact en `/home/joinhook/joinhook-production`.
2. Copiar/mezclar **todo el contenido de** `/home/joinhook/joinhook-production/document-root-assets/` hacia `/home/joinhook/public_html/`, sobrescribiendo los assets del build anterior pero sin borrar todavía WordPress legado ni `.htaccess`.
3. Verificar al menos una URL `/_next/static/chunks/<hash>.js` y un asset público nuevo, por ejemplo `/project-covers/joinops-cover.svg`.
4. Reiniciar Passenger si cambió el runtime.
5. Ejecutar `Ctrl + F5` y smoke test de Home, carrusel, chat, CGE y checkout.

**Regla:** no declarar un deploy completado ni pedir revisión visual hasta que runtime + `document-root-assets` estén sincronizados.

## Mejora pendiente

Automatizar la promoción staging → producción para que cada despliegue sincronice los assets del build activo hacia el document root. Esto evita que un nuevo Build ID/hash deje `public_html/_next/static` desfasado.

## Etiquetas

`nextjs` `nextjs-16` `cpanel` `cloudlinux` `passenger` `apache` `litespeed` `bluehosting` `static-assets` `_next` `404` `wordpress` `document-root` `production` `staging` `deploy` `project-covers` `document-root-assets`