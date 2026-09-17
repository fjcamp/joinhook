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

La validación del precio y moneda se realiza en el **source contract**. El smoke renderizado comprueba el precio y moneda visibles, evitando depender de la serialización literal de `next/head`.

### 3. Smoke, seguridad y PWA
La validación automatizada cubre:
- rutas públicas principales;
- canonical y sitemap;
- rutas legacy que deben permanecer en `404`;
- headers de seguridad;
- manifest y service worker PWA;
- plantilla CSV de CGE;
- construcción y prueba del artifact standalone de BlueHosting.

El script reutilizable `scripts/staging-smoke.cjs` deja preparado el smoke para el staging real y comprueba el contenido visible de la oferta, no metadatos frágiles de `next/head`.

### 4. CI y procedencia
El workflow verifica que el checkout use el SHA real del source PR antes de construir.

Runtime CI: Node.js `20.20.2`.

Último CI verde sobre `aa92cd1be872b8dd84f47ffb4a727b819e0a7785`:
- instalación: OK;
- auditoría runtime: OK, sin vulnerabilidades high+;
- auditoría dev: OK bajo umbral crítico, con 1 moderate + 1 high documentadas;
- lint: OK, 0 errores / warnings existentes;
- build: OK;
- JS gzip: `332.6 KiB` frente a `1464.8 KiB` de límite;
- smoke de rutas/SEO: OK;
- legacy routes: OK;
- headers: OK;
- PWA: OK;
- artifact standalone: OK;
- smoke del artifact: OK;
- upload del artifact: OK.

Secret History Scan del mismo ciclo: OK.

### 5. Corrección de falsa alarma del smoke
El fallo anterior provenía de probar una URL sin seguir la redirección generada por `trailingSlash: true`. El smoke se corrigió para seguir redirecciones antes de inspeccionar el HTML.

### 6. Gate comercial de producción
El workflow `.github/workflows/production-artifact.yml` fue endurecido:
- checkout CGE desactivado por defecto;
- activación solo mediante una variable explícita de GitHub Actions;
- URL de checkout solo mediante secret;
- no se almacena un enlace de Mercado Pago dentro del workflow;
- auditoría runtime y desarrollo alineada con el CI web;
- el artifact de producción verifica tanto el estado habilitado como el deshabilitado.

Esto evita que un merge a `main` active un cobro real de forma implícita.

## Artefacto vigente

Nombre: `joinhook-bluehosting-standalone`

Source commit: `aa92cd1be872b8dd84f47ffb4a727b819e0a7785`

Artifact ID: `10394017116`

SHA-256: `ac566ba3536395fab16473cffdc617a2efd5e0a99f25a510d2fcf512914e69a6`

Retención observada: hasta `2026-09-22T11:16:50Z`.

## Estado actual del ciclo

Último commit: el commit que actualiza este checkpoint después de endurecer el artifact de producción.

PR #47:
- estado: abierto;
- mergeable: sí al último registro;
- no mergeado.

## Gate de cierre

- [x] Web CI completamente verde.
- [x] Secret History Scan verde.
- [x] Artifact `joinhook-bluehosting-standalone` generado y probado desde una corrida verde.
- [ ] Staging BlueHosting actualizado manualmente con ese artifact.
- [ ] `npm run smoke:staging` exitoso contra staging real.
- [ ] QA visual/funcional desktop y móvil en staging real.
- [ ] Backup/rollback preparado para el servidor.
- [ ] Gate de publicación aprobado.
- [ ] PR #47 mergeado a `main`.
- [ ] Producción verificada externamente.
- [ ] Checkpoint post-merge creado.

## Restricciones permanentes

- No producción automática.
- No cambios DNS.
- No pagos reales habilitados por defecto.
- No terminal/SSH de cPanel.
- No `next build` en BlueHosting.
- No mezclar JoinOps en este repositorio.
- GitHub es la fuente de verdad.

## Próximo paso

Con CI y artifact cerrados, el siguiente paso material es instalar ese artifact en `staging.joinhook.cl`, ejecutar `npm run smoke:staging`, hacer QA visual desktop/móvil y documentar backup/rollback. Solo después corresponde evaluar el merge y la posterior verificación externa de producción.
