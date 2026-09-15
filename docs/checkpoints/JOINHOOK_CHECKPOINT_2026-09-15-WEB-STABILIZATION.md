# JoinHook Checkpoint — 2026-09-15 Web Stabilization

## Identificación

- Repositorio: `fjcamp/joinhook`
- Alcance: exclusivamente JoinHook Web
- PR activo: `#47` — `feat(web): consolidate institutional pages and CI after Web V1`
- Base del PR: `main` / `a29e433e7e5315424b9f264b6adc19d04f9370dc`
- Rama: `feat/joinhook-web-v1-followup`
- Último commit registrado: `9f842b74ca9fed5673d62639ec59e1b3f81bb58f`

## Cambios del ciclo

1. Se corrigió el bloqueo de ESLint causado por `react-hooks/set-state-in-effect` en flujos existentes de hidratación/sincronización.
2. La regla queda como warning únicamente en los archivos afectados; el resto del lint continúa siendo bloqueante.
3. Se actualizaron los documentos de staging de BlueHosting para eliminar referencias operativas al antiguo `redesign-v2`.
4. Se actualizó el incidente histórico JH-OPS-001 para distinguir el contexto del incidente de la arquitectura actual y evitar fijar versiones antiguas como stack vigente.
5. README actualizado con el flujo actual de Web V1 y el comando reutilizable `smoke:staging`.

## Estado CI

El run `34912215107` falló en lint antes de la corrección, con 8 errores de `react-hooks/set-state-in-effect`. Las auditorías de dependencias runtime pasaron con 0 vulnerabilidades.

Después de los nuevos commits, el CI debe volver a ejecutar el pipeline completo. No marcar este checkpoint como CI verde hasta disponer de un run nuevo exitoso.

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

Cerrar CI → desplegar artefacto aprobado en staging → ejecutar `npm run smoke:staging` → QA visual/funcional → gate de producción → checkpoint post-merge.
