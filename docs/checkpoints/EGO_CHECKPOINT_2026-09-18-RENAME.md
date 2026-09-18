# EGO — Checkpoint de renombrado y actualización documental

**Checkpoint ID:** EGO-RENAME-2026-09-18
**Fecha:** 2026-09-18
**Repositorio actual:** fjcamp/joinhook
**Rama:** main

## Cambio aprobado

El producto anteriormente denominado **Control Gastronómico Express (CGE)** pasa a denominarse oficialmente **EGO — Estado de Gastos Operacionales**.

## Estado técnico

- MVP existente conservado; no se reconstruyó la funcionalidad.
- Landing pública trasladada a \`src/pages/herramientas/estado-gastos-operacionales.tsx\`.
- Aplicación trasladada a \`src/pages/app/estado-gastos-operacionales.tsx\`.
- La ruta pública nueva es \`/herramientas/estado-gastos-operacionales\`.
- La ruta de aplicación nueva es \`/app/estado-gastos-operacionales\`.
- Manifest/PWA y service worker fueron actualizados para la nueva ruta.
- Landing, metadatos SEO/JSON-LD, mensajes comerciales, navegación, documentación de beta, checkout, lanzamiento, staging/producción y continuidad fueron actualizados al nombre EGO.
- Workflows de CI/producción fueron actualizados para las nuevas rutas y variables de checkout EGO.

## Identificadores técnicos heredados

Se mantienen temporalmente algunos identificadores internos \`cge_*\`, \`CGE*\`, archivos de estilos y recursos PWA heredados para evitar un refactor destructivo del núcleo MVP. Esto es deliberado y no representa el nombre comercial del producto.

## Pendiente

1. Ejecutar CI completo y Browser QA con las rutas nuevas.
2. Verificar PWA/offline real en staging.
3. Verificar checkout y datos comerciales antes de habilitar venta real.
4. Separar EGO a repositorio independiente, preservando este historial como origen.
5. Realizar una segunda pasada para decidir si conviene renombrar los identificadores internos \`cge\` a \`ego\`.

## Regla de continuidad

No mezclar EGO con JoinOps. EGO continúa siendo un producto independiente en alcance y evolución, aunque temporalmente su código permanezca dentro de \`fjcamp/joinhook\`.
