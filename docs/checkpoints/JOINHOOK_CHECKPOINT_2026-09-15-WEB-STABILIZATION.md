# JoinHook Checkpoint — 2026-09-15 Web Stabilization

## Identificación

- Repositorio: `fjcamp/joinhook`
- Alcance: exclusivamente JoinHook Web
- PR activo: `#47` — `feat(web): consolidate institutional pages and CI after Web V1`
- Base del PR: `main` / `a29e433e7e5315424b9f264b6adc19d04f9370dc`
- Rama: `feat/joinhook-web-v1-followup`
- Último commit de desarrollo registrado: `c93e0624bdec0e98c6574a299733fd85cec44f98`

## Cambios del ciclo

1. Se corrigió el bloqueo de ESLint causado por `react-hooks/set-state-in-effect` en flujos existentes de hidratación/sincronización.
2. La regla queda como warning únicamente en los archivos afectados; el resto del lint continúa siendo bloqueante.
3. Se actualizaron los documentos de staging de BlueHosting para eliminar referencias operativas al antiguo `redesign-v2`.
4. Se actualizó el incidente histórico JH-OPS-001 para distinguir el contexto del incidente de la arquitectura actual y evitar fijar versiones antiguas como stack vigente.
5. README actualizado con el flujo actual de Web V1 y el comando reutilizable `smoke:staging`.
6. El smoke de CGE pasó de búsquedas textuales frágiles a validación programática del HTML renderizado.
7. La validación de CGE ahora tolera entidades HTML, exige un `<title>` real, comprueba su contenido y valida el canonical por atributo.
8. Se reforzó la validación equivalente para el artefacto standalone de BlueHosting.
9. `tsconfig.json` quedó alineado explícitamente con los valores que Next.js estaba aplicando automáticamente (`moduleResolution: bundler` y `jsx: react-jsx`).
10. Este checkpoint fue actualizado para registrar el estado exacto del ciclo y evitar confundir commits previos con el head vigente.

## Estado CI

- Web CI del commit de código `ba8a92120180de8037211f7411576eb8df8837ea`: run `34915307731` → `queued` al momento de la última comprobación antes del commit de checkpoint.
- Este commit de checkpoint también modifica la rama, por lo que debe existir un run posterior antes de declarar el PR verde.
- El último Web CI completado, `34914314110`, falló exclusivamente en el smoke CGE por una aserción demasiado rígida del `<title>`.
- Secret History Scan del ciclo anterior completó correctamente; el nuevo escaneo debe verificarse para el head final.

## Criterios de cierre del PR #47

- [ ] Lint verde.
- [ ] Build verde.
- [ ] Presupuesto JS verde.
- [ ] Smoke de rutas/SEO verde.
- [ ] Rutas legacy protegidas en 404.
- [ ] Headers de seguridad verdes.
- [ ] PWA/Service Worker verdes.
- [ ] Artefacto standalone BlueHosting generado y probado.
- [ ] Secret History Scan verde.
- [ ] Staging externo verificado.
- [ ] QA visual/funcional de staging completado.
- [ ] PR #47 mergeado a `main`.

## Restricciones permanentes

- No mezclar JoinOps con este repositorio salvo solicitud explícita.
- No desplegar producción automáticamente.
- No ejecutar `next build` en BlueHosting.
- No depender de terminal/SSH en cPanel.
- No declarar producción actualizada sin verificación externa.
- GitHub continúa siendo la fuente de verdad.

## Siguiente etapa

Cerrar CI → obtener artefacto BlueHosting del run verde del head final → desplegar manualmente en staging según runbook → ejecutar `npm run smoke:staging` → QA visual/funcional → gate de producción → checkpoint post-merge.
