# CHECKPOINT — Auditoría de respaldo cPanel desde Windows
Fecha: 2026-10-13
Proyecto: JoinHook
Estado: PAUSADO A SOLICITUD DEL USUARIO; inventario aún no generado.

## Objetivo
Preparar una auditoría segura del respaldo completo descargado desde cPanel, para identificar estructura y rutas de JoinHook (producción, staging, WordPress y aplicaciones) sin tocar el hosting.

## Ruta local informada por el usuario
`C:\Proyectos\joinhook\respaldo_total_1`

La ruta fue proporcionada por el usuario, pero el contenido de la carpeta no ha sido inspeccionado desde esta conversación.

## Último paso propuesto (todavía NO ejecutado ni verificado)
Generar desde PowerShell un inventario de nombres de archivo, rutas relativas y tamaños, guardado en:
`C:\Proyectos\joinhook\joinhook-inventario.txt`

El usuario aún no ha confirmado que ejecutó el comando ni adjuntado el inventario. No afirmar que el archivo existe.

## Procedimiento de continuación
1. Preguntar si pudo ejecutar el comando de PowerShell o si apareció algún error.
2. Si lo generó, pedir que adjunte `joinhook-inventario.txt` a la conversación.
3. Revisar el inventario para separar rutas y componentes relevantes: producción, staging, WordPress, aplicaciones Node y recursos públicos.
4. Después, seleccionar archivos específicos para revisión, retirando secretos antes de compartirlos.
5. Mantener los artefactos de auditoría en la rama separada de GitHub:
   `audit/cpanel-snapshot-2026-10-13`
   carpeta:
   `audits/cpanel-snapshot-2026-10-13/`
   URL:
   https://github.com/fjcamp/joinhook/tree/audit/cpanel-snapshot-2026-10-13/audits/cpanel-snapshot-2026-10-13

## Seguridad y límites
- El repositorio `fjcamp/joinhook` es público; no subir el ZIP completo de cPanel ni archivos que contengan credenciales.
- No compartir `.env*`, tokens, claves privadas/certificados, sesiones `cpsess`, credenciales de WordPress, dumps de bases de datos, correos ni datos privados.
- Conservar el respaldo original intacto y trabajar con una copia.
- No ejecutar cambios en producción ni en staging durante esta etapa.
- No copiar recursos a `/home/joinhook/public_html`, no editar `.htaccess`, no arrancar ni modificar la aplicación de staging sin un plan y autorización explícita.
- No ejecutar `npm install` ni `next build` en BlueHosting.

## Contexto de despliegue relacionado
Existe un trabajo separado de auditoría PR49 staging con checkpoint anterior. Estado reportado: preparación y respaldo; despliegue no ejecutado. Rutas previamente informadas:
- Producción Node: `/home/joinhook/joinhook-production` (protegida, no modificar).
- Raíz pública principal: `/home/joinhook/public_html` (protegida).
- Aplicación staging: `/home/joinhook/staging-joinhook`.
- Raíz pública del subdominio: `/home/joinhook/public_html/staging.joinhook.cl`.
- Artefacto PR49: `/home/joinhook/joinhook-pr49-staging-2026-10-12`.
Estos datos proceden de informes anteriores y deberán verificarse contra el inventario/evidencia antes de actuar.

## Regla de evidencia
No declarar que el inventario, los archivos o las rutas están verificados hasta recibir evidencia observable. Continuar paso a paso y pausar al final de cada acción que requiera participación del usuario.
