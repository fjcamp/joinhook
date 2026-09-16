# JoinHook Web — checkpoint de continuidad

Fecha de actualización: 2026-09-16
Repositorio: `fjcamp/joinhook`
Rama: `feat/joinhook-web-v1-followup`
PR: #47
Base: `main` / Web V1 `a29e433e7e5315424b9f264b6adc19d04f9370dc`

## Estado técnico

- PR #47 continúa abierto y no mergeado.
- Web V1 permanece integrado en `main`; este ciclo sigue separado para revisión antes del merge.
- `production-artifact.yml` usa `CGE_CHECKOUT_ENABLED` como variable explícita de GitHub y `CGE_CHECKOUT_URL` como secret; el checkout permanece desactivado por defecto.
- El workflow de producción exige HTTPS cuando el checkout está habilitado y no contiene una URL de Mercado Pago hardcodeada en la configuración actual.
- La construcción de producción comprueba headers, rutas públicas, CGE, PWA y sincronización exacta de `.next/static` con el espejo destinado a `/home/joinhook/public_html`.
- `package.json` declara Node `>=20.20.2`, alineado con el runtime utilizado por CI.
- El blog tiene una primera nota editorial publicada como ruta propia: `/blog/ordenar-antes-de-digitalizar`.
- El hub `/blog` distingue explícitamente contenido publicado de contenido en preparación.
- `public/sitemap.xml` incorpora la nueva nota y la nueva página `/para-ia`.

## Capa de descubribilidad para IA y agentes

- Nueva página oficial `/para-ia`: resumen estructurado de identidad, propuesta, servicios, áreas, proyectos y fuentes canónicas.
- Nuevo `/llms.txt`: índice Markdown compacto siguiendo la propuesta llms.txt, con enlaces canónicos y contexto explícito sobre cómo debe interpretarse JoinHook.
- `robots.txt` mantiene el acceso general y declara explícitamente `OAI-SearchBot` y `Claude-SearchBot` con `Allow: /`.
- La página `/para-ia` incluye `WebPage`, `WebSite`, `Organization` e `ItemList` en JSON-LD, manteniendo los datos alineados con el contenido visible.
- Esta capa complementa SEO convencional; no garantiza posiciones, citas o recomendaciones de ningún motor.

## Evidencia CI

- Web CI y Secret History Scan estaban verdes para el head `b29da72...` antes de esta nueva capa.
- Los cambios posteriores requieren una nueva corrida de CI antes de considerar el estado actual como verde.

## Gate de publicación

- [x] PR abierto.
- [x] Arquitectura Web V1 consolidada.
- [x] Checkout CGE desactivado por defecto.
- [x] Runtime Node del package alineado con CI.
- [x] Primera nota editorial publicada en una ruta propia.
- [x] Hub editorial enlaza la nota publicada.
- [x] Sitemap actualizado.
- [x] Página `/para-ia` creada.
- [x] `/llms.txt` creado.
- [x] Robots actualizado para crawlers de búsqueda de IA documentados.
- [ ] Nueva Web CI verde después de los cambios posteriores.
- [ ] Secret History Scan del estado actual.
- [ ] Instalar artifact en `staging.joinhook.cl`.
- [ ] Ejecutar `npm run smoke:staging` contra staging real.
- [ ] QA visual desktop/móvil.
- [ ] Backup y rollback del servidor.
- [ ] Aprobación explícita de publicación.
- [ ] Merge de PR #47.
- [ ] Verificación externa de producción.
- [ ] Checkpoint post-merge.

## Decisión de continuidad

No realizar merge ni publicación automática. El desarrollo continúa en la rama de feature. Antes de cualquier merge se debe obtener CI verde del estado actual y completar los gates de staging/QA.

## Próximo bloque

1. Verificar la nueva corrida de CI sobre el head actual.
2. Corregir únicamente fallos demostrados por CI.
3. Añadir pruebas automáticas de `/para-ia`, `/llms.txt` y robots si el CI actual no las cubre.
4. Continuar fortaleciendo contenido institucional y editorial sin convertir el blog en contenido de relleno.
5. Preparar staging y QA cuando exista acceso operativo a BlueHosting.
