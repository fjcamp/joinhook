# JH-OPS-002 — WordPress legado intercepta rutas Next.js en BlueHosting

**Fecha:** 2026-08-22  
**Estado:** Resuelto y validado en producción  
**Entorno:** `joinhook.cl`  
**Stack:** Next.js 16.3.0, CloudLinux Passenger, Apache/LiteSpeed, WordPress legado en `public_html`.

## Resumen

Después de desplegar JoinHook como aplicación Next.js/Passenger, una ruta interna que debía resolver el runtime nuevo era interceptada por las reglas de reescritura de WordPress que todavía permanecían en `/home/joinhook/public_html/.htaccess`.

El problema no estaba en la compilación Next.js ni en Passenger. El document root seguía conservando reglas del sitio WordPress anterior y Apache/LiteSpeed aplicaba ese routing antes de que la solicitud llegara a la aplicación esperada.

## Síntoma

- La Home podía estar operativa.
- Determinadas rutas internas del nuevo sitio no llegaban correctamente a Next.js.
- Existían archivos y reglas WordPress heredadas en `public_html`.
- Reiniciar Passenger por sí solo no modificaba el comportamiento.

## Causa raíz

El `.htaccess` combinaba el bloque requerido por CloudLinux Passenger con reglas de WordPress heredadas. Las reglas WordPress podían capturar solicitudes que ya debían pertenecer a la aplicación Next.js.

## Solución validada

1. Respaldar primero `/home/joinhook/public_html/.htaccess`.
2. Identificar el bloque de Passenger y conservarlo intacto.
3. Retirar **solo** las reglas de rewrite de WordPress que ya no correspondían al routing productivo de JoinHook.
4. No borrar WordPress ni otros archivos históricos durante el diagnóstico.
5. Reiniciar la aplicación Passenger.
6. Volver a probar la ruta que estaba siendo interceptada.
7. Confirmar que Home y recursos estáticos continúen operativos.

La corrección funcionó después de eliminar únicamente el rewrite legado y mantener Passenger.

## Lecciones

- No reemplazar `.htaccess` completo a ciegas.
- No mezclar el diagnóstico de routing con el de `/_next/static`: son incidentes distintos aunque ambos puedan producir 404.
- `JH-OPS-001`: comprobar mirror de assets cuando falla CSS/JS.
- `JH-OPS-002`: comprobar `.htaccess`/routing cuando una ruta dinámica o API es interceptada.
- Conservar siempre una copia del `.htaccess` anterior antes de cualquier cambio.
- No borrar WordPress legado hasta tener rollback y respaldo final; retirar primero solo las reglas que interfieren.

## Preflight obligatorio en futuros despliegues

Antes de declarar un despliegue exitoso:

1. Confirmar que el `.htaccess` mantiene el bloque Passenger esperado.
2. Confirmar que no reaparecieron reglas WordPress que capturen el sitio completo.
3. Probar una ruta dinámica Next.js y una API además de `/`.
4. Probar un asset real de `/_next/static` por separado para descartar JH-OPS-001.
5. Si el deploy incluye Commerce, probar el Webhook GET y esperar `405`, no `404`.

## Rollback

Si una modificación de `.htaccess` rompe producción:

1. restaurar el respaldo exacto;
2. reiniciar Passenger si corresponde;
3. volver a probar Home, ruta dinámica y assets;
4. hacer una nueva modificación mínima, nunca una reescritura global sin evidencia.

## Etiquetas

`bluehosting` `cpanel` `passenger` `apache` `litespeed` `wordpress` `htaccess` `rewrite` `routing` `nextjs` `404` `rollback`
