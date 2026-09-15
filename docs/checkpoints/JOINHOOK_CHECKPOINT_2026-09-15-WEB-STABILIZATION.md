# JoinHook Checkpoint — 2026-09-15 Web Stabilization

## Identificación

- Repositorio: `fjcamp/joinhook`
- Alcance: exclusivamente JoinHook Web
- PR activo: `#47` — `feat(web): consolidate institutional pages and CI after Web V1`
- Base del PR: `main` / `a29e433e7e5315424b9f264b6adc19d04f9370dc`
- Rama: `feat/joinhook-web-v1-followup`
- Último commit de desarrollo: `e6aaf395ca82bf82cce83912d820fc5d4207453f`

## Cambios del ciclo

1. Se corrigió el bloqueo de ESLint causado por `react-hooks/set-state-in-effect` en flujos existentes de hidratación/sincronización.
2. La regla queda como warning únicamente en los archivos afectados; el resto del lint continúa siendo bloqueante.
3. Se actualizaron los documentos de staging de BlueHosting para eliminar referencias operativas al antiguo `redesign-v2`.
4. Se actualizó el incidente histórico JH-OPS-001 para distinguir el contexto del incidente de la arquitectura actual y evitar fijar versiones antiguas como stack vigente.
5. README actualizado con el flujo actual de Web V1 y el comando reutilizable `smoke:staging`.
6. El smoke de CGE dejó de depender de búsquedas `grep` sobre HTML/XML y ahora valida marcadores mediante Node.js, reduciendo falsos negativos por serialización/minificación.
7. `tsconfig.json` quedó alineado explícitamente con los valores que Next.js estaba aplicando automáticamente (`moduleResolution: bundler` y `jsx: react-jsx`).

## Estado CI

- Secret History Scan del último commit: `34914257330` → `success`.
- El run anterior `34913666091` falló exclusivamente en el smoke test; instalación, auditorías, lint, build y presupuesto JS habían pasado.
- El nuevo run de Web CI es `34914286541` → `in_progress` al momento de este checkpoint.
- Job `validate`: en instalación de dependencias; las etapas de validación posteriores aún no han terminado.
- No declarar CI verde hasta contar con conclusión `success` del run `34914286541`.

## Criterios de cierre del PR #47

- [ ] Lint verde.
- [ ] Build verde.
- [ ] Presupuesto JS verde.
- [ ] Smoke de rutas/SEO verde.
- [ ] Rutas legacy protegidas en 404.
- [ ] Headers de seguridad verdes.
- [ ] PWA/Service Worker verdes.
- [ ] Artefacto standalone BlueHosting generado y probado.
- [x] Secret History Scan verde.
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

Cerrar CI → obtener artefacto BlueHosting del run verde → desplegar manualmente en staging según runbook → ejecutar `npm run smoke:staging` → QA visual/funcional → gate de producción → checkpoint post-merge.
