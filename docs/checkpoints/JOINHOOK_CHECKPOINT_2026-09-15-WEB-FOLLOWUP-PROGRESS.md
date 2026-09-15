# JoinHook Web — checkpoint de progreso

Fecha: 2026-09-15
Repositorio: `fjcamp/joinhook`
Rama: `feat/joinhook-web-v1-followup`
PR: #47
Base del PR: `a29e433e7e5315424b9f264b6adc19d04f9370dc`

## Objetivo de este checkpoint
Registrar el avance realizado después de Web V1 mientras el PR #47 continúa en validación. Este documento **no declara producción desplegada ni etapa cerrada**.

## Avance consolidado

### 1. Contrato comercial CGE estabilizado
- La landing mantiene el precio fundador de `4990 CLP` en el modelo JSON-LD `SoftwareApplication`.
- Se añadieron metadatos HTML estables para pruebas renderizadas:
  - `cge-founder-price = 4990`
  - `cge-founder-currency = CLP`
- El CI valida estos metadatos tanto en el source contract como después de renderizar la aplicación.
- Se eliminó la dependencia del smoke respecto de cómo Next.js serializa el JSON-LD.

### 2. Smoke de staging ampliado
`scripts/staging-smoke.cjs` ahora valida:
- rutas públicas principales;
- headers base de seguridad;
- canonical y oferta de CGE;
- entradas críticas del sitemap;
- service worker y plantilla CSV de CGE;
- rutas heredadas que deben responder `404`;
- manifest PWA y su content-type.

### 3. CI / procedencia
- El workflow valida explícitamente el SHA fuente del PR antes de construir.
- Runtime objetivo de CI: Node.js `20.20.2`.
- Audit de dependencias de runtime: sin vulnerabilidades `high` o superiores en la ejecución observada.
- Lint: `0 errors`, con warnings existentes.
- Build: correcto en la última corrida observada antes del nuevo patch.
- Presupuesto JS: `332.6 KiB` gzip frente a un límite interno de `1464.8 KiB`.
- Secret History Scan: ejecuciones observadas exitosas.

## Estado CI actual
Commit de trabajo: `af07064d17611dfb5fb0338e0f94115604c1b798`.

Al momento del checkpoint:
- JoinHook Web CI #36: `in_progress`.
- Secret History Scan #325: `in_progress`.

El siguiente cierre debe esperar el resultado de estas ejecuciones.

## Bloqueo corregido
La ejecución anterior fallaba exclusivamente porque el smoke intentaba interpretar el JSON-LD renderizado y la serialización producida por Next.js no era estable para ese parser. El contrato ahora se comprueba mediante metadatos HTML explícitos y estables.

## Próxima etapa
1. Confirmar CI verde del commit `af07064d...`.
2. Obtener y conservar el artifact `joinhook-bluehosting-standalone` de una ejecución verde.
3. Realizar despliegue manual a staging de BlueHosting siguiendo `docs/bluehosting-production.md`.
4. Ejecutar `npm run smoke:staging` contra `https://staging.joinhook.cl` cuando el staging esté actualizado.
5. Realizar QA visual/funcional desktop y móvil.
6. Sólo después de esas verificaciones evaluar merge de PR #47 y el gate de producción.

## Restricciones vigentes
- No producción automática.
- No cambios DNS.
- No pagos reales habilitados por este checkpoint.
- No uso de terminal/SSH de cPanel.
- No ejecutar `next build` en BlueHosting.
- JoinOps permanece fuera de este trabajo.
