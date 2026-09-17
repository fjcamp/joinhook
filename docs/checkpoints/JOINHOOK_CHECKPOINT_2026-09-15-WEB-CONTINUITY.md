# JoinHook Web — checkpoint de continuidad

Fecha de actualización: 2026-09-17
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

## CI y corrección reciente

- El build de producción llegó a compilación exitosa y generó `/para-ia` como ruta estática.
- El smoke de CGE y sitemap pasó.
- El fallo demostrado en Web CI #61 estaba aislado en la expresión de prueba del JSON-LD: el test esperaba exactamente `<script type="application/ld+json">`, demasiado estricto para el HTML renderizado.
- Se corrigió la prueba para detectar `script` con `type="application/ld+json"` independientemente de otros atributos y seguir parseando cada bloque JSON-LD encontrado.
- El nuevo commit `328504d...` contiene esta corrección; requiere una nueva ejecución de CI antes de considerar el estado como verde.
- El audit de dependencias de desarrollo mostró 1 vulnerabilidad alta y 1 moderada; el gate configurado permite el nivel `critical`, por lo que no bloqueó la ejecución. No se debe ejecutar un `npm audit fix` indiscriminado sin revisar el árbol y el impacto.

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
- [x] Pruebas automatizadas añadidas para descubribilidad IA.
- [x] Corrección del test JSON-LD aplicada tras fallo demostrado.
- [ ] Nueva Web CI verde después de la corrección.
- [ ] Secret History Scan del estado actual.
- [ ] Instalar artifact en `staging.joinhook.cl`.
- [ ] Ejecutar `npm run smoke:staging` contra staging real.
- [ ] QA visual desktop/móvil.
- [ ] Backup y rollback del servidor.
- [ ] Aprobación explícita de publicación.
- [ ] Merge de PR #47.
- [ ] Verificación externa de producción.
- [ ] Checkpoint post-merge.

## Estrategia de aceleración hacia publicación

1. Obtener CI verde del HEAD actual sin introducir cambios no relacionados.
2. Usar el artifact `joinhook-bluehosting-standalone` producido por CI.
3. Instalarlo primero en `/home/joinhook/staging-joinhook` mediante File Manager de BlueHosting; no ejecutar `next build` en el servidor.
4. Reiniciar Passenger y ejecutar el smoke externo de staging.
5. Realizar QA visual desktop/móvil y revisar headers, rutas, assets estáticos y CGE.
6. Crear backup del estado productivo y conservar rollback antes de tocar `/home/joinhook/joinhook-production` / `public_html`.
7. Solo con aprobación explícita, publicar el mismo artifact validado y sincronizado, seguido de verificación externa.

## Decisión de continuidad

El objetivo prioritario es reducir el tiempo hasta que la web esté operativa sin saltarse las comprobaciones que evitan una publicación rota. La ruta más rápida segura es: CI → artifact reproducible → staging → smoke/QA → backup → publicación aprobada. No realizar merge ni publicación automática.
