# JoinHook Web — checkpoint de continuidad

Fecha: 2026-09-15
Repositorio: `fjcamp/joinhook`
Rama: `feat/joinhook-web-v1-followup`
PR: #47
Head verificado: `985a2870e0f652cf2b8937bd1c2dfe6fcae36910`
Base: `main` / Web V1 `a29e433e7e5315424b9f264b6adc19d04f9370dc`

## Estado técnico verificado

- PR #47 abierto, no mergeado y marcado como mergeable.
- `production-artifact.yml` usa `CGE_CHECKOUT_ENABLED` como variable explícita de GitHub y `CGE_CHECKOUT_URL` como secret; el checkout queda desactivado por defecto.
- El workflow de producción exige HTTPS cuando el checkout está habilitado y rechaza una activación sin URL válida.
- El workflow de producción no debe contener una URL de Mercado Pago hardcodeada.
- La construcción de producción comprueba headers, rutas públicas, CGE, PWA y sincronización exacta de `.next/static` con el espejo destinado a `/home/joinhook/public_html`.
- El artifact de Web CI vigente corresponde al head `985a287...` y fue generado en una corrida verde; el staging real todavía no ha sido verificado desde BlueHosting.

## Gate

- [x] PR abierto y mergeable.
- [x] Web CI verde en el head verificado.
- [x] Secret History Scan verde en el ciclo verificado.
- [x] Artifact standalone generado y probado.
- [x] Gate comercial: checkout desactivado por defecto.
- [ ] Instalar artifact en `staging.joinhook.cl`.
- [ ] Ejecutar `npm run smoke:staging` contra staging real.
- [ ] QA visual desktop/móvil.
- [ ] Backup y rollback del servidor.
- [ ] Aprobación explícita de publicación.
- [ ] Merge de PR #47.
- [ ] Verificación externa de producción.
- [ ] Checkpoint post-merge.

## Decisión de continuidad

No se realizará merge ni publicación automática desde este ciclo. El siguiente paso operativo requiere acceso manual a BlueHosting para instalar el artifact en staging y validar la instancia real.

## Observación

Se intentó alinear `package.json` con Node `20.20.2`, pero la API de contenidos de GitHub devolvió conflicto de SHA al escribir el archivo. No se considera ese cambio aplicado y no debe tratarse como realizado hasta obtener un commit verificable.
