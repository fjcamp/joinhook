# JoinHook — Runbook de despliegue en BlueHosting

## Objetivo

Publicar en BlueHosting la versión de JoinHook generada y validada por GitHub Actions, sin depender de terminal o SSH en cPanel.

## Artefacto oficial

El workflow `JoinHook Web CI` genera `joinhook-bluehosting-standalone` a partir del commit validado. El paquete incluye `.next/standalone`, `.next/static`, `public`, `node_modules`, `package.json`, `server.js` y `DEPLOYMENT.txt`.

No ejecutar `next build` dentro de BlueHosting. El build se realiza en GitHub Actions para mantener un artefacto reproducible.

## Staging primero

1. Descargar desde GitHub Actions el artefacto correspondiente al commit aprobado.
2. Extraerlo localmente y conservar una copia del ZIP como respaldo.
3. En BlueHosting/cPanel, preparar el espacio de staging sin sobrescribir producción.
4. Subir los archivos mediante las herramientas de administración disponibles en cPanel/gestor de archivos.
5. Configurar el proceso Passenger para usar `server.js` como startup del proyecto.
6. Mantener `NODE_ENV=production` y una versión Node compatible con el build; la referencia de CI es Node.js 20.20.2.
7. Iniciar o reiniciar la aplicación desde la interfaz disponible en el hosting.
8. Verificar primero la URL de staging y registrar fecha, commit y resultado de las pruebas.

## Gate de staging

Antes de considerar una publicación válida, comprobar como mínimo:

- `/` carga correctamente.
- `/info` y `/blog` cargan correctamente.
- `/herramientas/control-gastronomico-express` carga y conserva su estado beta.
- `/app/control-gastronomico-express` carga.
- `/privacidad` y `/condiciones-beta` cargan.
- `robots.txt` y `sitemap.xml` responden.
- Los recursos PWA principales responden.
- No hay errores visibles de runtime en las páginas principales.
- En staging debe mantenerse `X-Robots-Tag: noindex, nofollow, noarchive`.

## Producción

La producción `joinhook.cl` solo se actualiza después de aprobar staging.

Procedimiento recomendado:

1. Tomar respaldo del estado productivo actual antes de reemplazar archivos.
2. Confirmar el commit exacto aprobado en staging.
3. Reutilizar el mismo artefacto validado; no reconstruir manualmente otro paquete.
4. Publicar en la aplicación Passenger productiva.
5. Reiniciar el proceso desde la interfaz del hosting.
6. Ejecutar smoke test público y revisión visual.
7. Verificar encabezados de seguridad y comportamiento del sitio.
8. Registrar el resultado y conservar la referencia del artefacto utilizado.

## Rollback

Ante errores posteriores al despliegue, restaurar el respaldo anterior o volver a desplegar el artefacto productivo inmediatamente anterior que haya sido validado.

No borrar el respaldo previo hasta completar la aceptación de la nueva versión.

## Límites conocidos

- No basar el procedimiento en terminal/SSH en cPanel.
- No almacenar secretos en el repositorio.
- No activar pagos reales desde este workflow de QA.
- No considerar un despliegue como exitoso solo porque GitHub Actions terminó en verde: la disponibilidad de `joinhook.cl` debe verificarse externamente tras publicar.
