# JH-OPS-002 — WordPress intercepta rutas internas de Next.js en producción

**Fecha:** 2026-08-22  
**Estado:** Diagnóstico confirmado; corrección operativa pendiente en cPanel  
**Entorno:** `joinhook.cl` producción  
**Stack:** Next.js 16.3.0, Node.js 20.20.2, CloudLinux Passenger, Apache/LiteSpeed, WordPress legado en `public_html`.

## Resumen

La Home de JoinHook funciona bajo Passenger, pero al pulsar el CTA **«Conocer y probar»** de Control Gastronómico Express, la ruta:

```text
https://joinhook.cl/herramientas/control-gastronomico-express
```

muestra el 404 del WordPress antiguo (`No Results Found`) en lugar de la página Next.js.

La captura del incidente confirma visualmente que la petición llegó al tema/plantilla de WordPress: navegación `Home / Acerca de mí / Contacto`, buscador, `Recent Posts`, `Hello world!` y footer del sitio legado.

## Evidencia técnica

La página existe en el código fuente de JoinHook:

```text
src/pages/herramientas/control-gastronomico-express.tsx
```

Además, los pipelines de CI prueban la ruta contra el servidor Next.js directo y el build la contiene. Por tanto, este no es un 404 generado por Next.js ni una ausencia de la página.

La arquitectura de producción es:

```text
Runtime Next.js/Passenger: /home/joinhook/joinhook-production
Document root Apache:      /home/joinhook/public_html
```

`public_html/.htaccess` conserva reglas `mod_rewrite` del WordPress legado. Una ruta limpia que no corresponde a un archivo/directorio físico puede ser reescrita hacia `index.php` antes de que Passenger resuelva la aplicación Next.js.

Esto explica por qué `/` puede funcionar y, sin embargo, rutas como `/herramientas/...`, `/privacidad` o `/condiciones-beta` pueden ser interceptadas por WordPress.

## Causa raíz

**Convivencia de dos routers para el mismo dominio.**

- Next.js/Passenger es la aplicación de producción deseada.
- WordPress todavía tiene reglas de rewrite activas en el mismo `document root`.
- Las rutas no físicas son candidatas al rewrite de WordPress y terminan en `index.php`.

Conservar los archivos WordPress como rollback no requiere conservar sus reglas de routing activas.

## Corrección recomendada

En `/home/joinhook/public_html/.htaccess`:

1. Hacer una copia de respaldo del archivo actual.
2. **Desactivar/comentar únicamente el bloque de rewrite de WordPress** (`# BEGIN WordPress` ... `# END WordPress`).
3. Conservar intacto el bloque generado por CloudLinux Passenger:

```apache
PassengerAppRoot "/home/joinhook/joinhook-production"
PassengerBaseURI "/"
PassengerNodejs "/home/joinhook/nodevenv/joinhook-production/20/bin/node"
PassengerAppType node
PassengerStartupFile server.js
PassengerAppLogFile "/home/joinhook/logs/production-passenger.log"
```

4. No borrar todavía `wp-admin`, `wp-content`, `wp-includes`, `index.php` ni el respaldo WordPress.
5. Reiniciar `joinhook.cl` desde **Setup Node.js App**.
6. Probar en ventana privada:
   - `/`
   - `/herramientas/control-gastronomico-express`
   - `/app/control-gastronomico-express`
   - `/privacidad`
   - `/condiciones-beta`
7. Confirmar que ninguna devuelve branding/HTML de WordPress.

## Variante segura de `.htaccess`

Mientras Next.js sea la aplicación principal, la estructura conceptual debe ser:

```apache
# WordPress legacy files retained for rollback.
# WordPress rewrite rules intentionally disabled.

# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home/joinhook/joinhook-production"
PassengerBaseURI "/"
PassengerNodejs "/home/joinhook/nodevenv/joinhook-production/20/bin/node"
PassengerAppType node
PassengerStartupFile server.js
PassengerAppLogFile "/home/joinhook/logs/production-passenger.log"
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END
```

El contenido exacto del bloque Passenger debe conservarse según lo que genere cPanel; no sustituir rutas a ciegas.

## Verificación de cierre

El incidente se considera cerrado cuando:

- el CTA `Conocer y probar` abre la landing CGE de Next.js;
- las rutas internas del smoke test responden desde JoinHook y no desde WordPress;
- `/_next/static` continúa respondiendo `200` con assets del build activo;
- el checkout Mercado Pago sigue accesible desde la landing;
- el WordPress antiguo permanece respaldado fuera del flujo de routing.

## Lecciones

- CI contra el servidor Next.js directo no detecta necesariamente conflictos del router frontal Apache/LiteSpeed.
- Mientras existan dos aplicaciones bajo el mismo dominio, el router frontal debe tener un único propietario.
- Retener archivos de rollback y mantener reglas de rewrite activas son decisiones distintas.
- El smoke test de producción debe revisar HTML/branding, no solo `status 200`.

## Relación con otros incidentes

- **JH-OPS-001:** assets `/_next/static` no disponibles en el document root.
- **JH-OPS-002:** rutas internas no físicas interceptadas por WordPress.

Ambos nacen de la convivencia temporal entre el runtime Next.js y el `public_html` legado.

## Etiquetas

`routing` `wordpress` `nextjs` `passenger` `apache` `litespeed` `cpanel` `bluehosting` `404` `rewrite` `production` `cge` `legacy`