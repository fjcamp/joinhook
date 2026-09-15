# JoinHook Web — checkpoint de progreso

Fecha: 2026-09-15
Repositorio: `fjcamp/joinhook`
Rama: `feat/joinhook-web-v1-followup`
PR: #47
Base del PR: `a29e433e7e5315424b9f264b6adc19d04f9370dc`

## Objetivo
Registrar el estado real del ciclo de consolidación de JoinHook Web y mantener una ruta de continuidad verificable entre conversaciones y herramientas.

## Avance consolidado

### 1. Web V1 institucional
La versión institucional posterior al merge de Web V1 está integrada y el PR #47 mantiene las páginas `/info`, `/blog`, CGE, privacidad y condiciones beta, junto con la documentación operativa de BlueHosting.

### 2. Contrato comercial CGE
La landing de Control Gastronómico Express mantiene un contrato de origen explícito para:
- título SEO;
- canonical;
- precio fundador `4990`;
- moneda `CLP`;
- oferta JSON-LD `SoftwareApplication`.

La validación del precio y moneda se realiza en el **source contract**, no mediante una aserción frágil sobre la serialización HTML de `next/head`.

### 3. Smoke y seguridad
La validación automatizada cubre:
- rutas públicas principales;
- canonical y sitemap;
- rutas legacy que deben permanecer en `404`;
- headers de seguridad;
- manifest y service worker PWA;
- plantilla CSV de CGE;
- construcción y prueba del artifact standalone de BlueHosting.

El script reutilizable `scripts/staging-smoke.cjs` además deja preparado el smoke para el staging real.

### 4. CI y procedencia
El workflow verifica que el checkout use el SHA real del source PR antes de construir.

Runtime CI: Node.js `20.20.2`.

En la última ejecución observada sobre `eb1d22a...`:
- instalación: OK;
- auditoría runtime: 0 vulnerabilidades high+;
- auditoría dev: 1 moderate + 1 high, sin critical;
- lint: 0 errores / warnings existentes;
- build: OK;
- JS gzip: `332.6 KiB` frente a `1464.8 KiB` de límite;
- fallo restante: smoke CGE por una comprobación de contenido renderizado demasiado específica.

Ese comportamiento se corrigió en el commit posterior `2067a115ce8507e95b67f30dab704f2801b2d0dc`, retirando del smoke renderizado la dependencia del precio/moneda.

## Estado actual del ciclo

Último commit de código: `2067a115ce8507e95b67f30dab704f2801b2d0dc`.

PR #47:
- estado: abierto;
- mergeable: temporalmente no determinado mientras se actualizan checks;
- no mergeado.

Nuevas ejecuciones disparadas sobre `2067a115...`:
- JoinHook Web CI #39: `queued` al último registro;
- Secret History Scan #328: `queued` al último registro.

## Gate de cierre

- [ ] Web CI completamente verde.
- [ ] Secret History Scan verde.
- [ ] Artifact `joinhook-bluehosting-standalone` generado y probado desde una corrida verde.
- [ ] Staging BlueHosting actualizado manualmente con ese artifact.
- [ ] `npm run smoke:staging` exitoso contra staging real.
- [ ] QA visual/funcional desktop y móvil.
- [ ] Backup/rollback preparado.
- [ ] Gate de publicación aprobado.
- [ ] PR #47 mergeado a `main`.
- [ ] Producción verificada externamente.
- [ ] Checkpoint post-merge creado.

## Restricciones permanentes

- No producción automática.
- No cambios DNS.
- No pagos reales habilitados como parte de este ciclo.
- No terminal/SSH de cPanel.
- No `next build` en BlueHosting.
- No mezclar JoinOps en este repositorio.
- GitHub es la fuente de verdad.

## Próximo paso

Cerrar CI → conservar artifact verde → staging real → smoke + QA → gate de publicación → merge controlado → verificación externa de producción → checkpoint post-merge.
