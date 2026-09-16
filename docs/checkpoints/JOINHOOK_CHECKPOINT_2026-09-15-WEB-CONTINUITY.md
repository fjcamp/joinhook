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
- `package.json` ahora declara Node `>=20.20.2`, alineado con el runtime utilizado por CI.
- El cambio de `package.json` fue aplicado y verificado mediante commit; no debe tratarse como pendiente.

## Evidencia CI previa

- El ciclo anterior tuvo Web CI verde en el head `985a2870...`.
- Secret History Scan también quedó verde en ese ciclo.
- Se generó un artifact standalone de BlueHosting.
- Estos commits posteriores requieren una nueva corrida de CI antes de considerar el estado actual como verde.

## Gate de publicación

- [x] PR abierto.
- [x] Arquitectura Web V1 consolidada.
- [x] Checkout CGE desactivado por defecto.
- [x] Runtime Node del package alineado con CI.
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

1. Esperar/verificar CI del nuevo head.
2. Corregir únicamente fallos demostrados por CI.
3. Revisar la experiencia institucional y las rutas públicas después de la validación técnica.
4. Preparar staging y QA cuando exista acceso operativo a BlueHosting.
5. Mantener respaldo y trazabilidad de cada ciclo.
