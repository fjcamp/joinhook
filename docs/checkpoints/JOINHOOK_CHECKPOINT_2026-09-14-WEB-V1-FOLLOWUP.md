# JoinHook — Checkpoint Web V1 Follow-up — 2026-09-14

## Identificación

- Repositorio: `fjcamp/joinhook`
- Rama de trabajo: `feat/joinhook-web-v1-followup`
- Base: `main`
- Base Web V1 integrada: `a29e433e7e5315424b9f264b6adc19d04f9370dc`
- PR anterior: `#46` — Web V1 — integrado

## Avance realizado en este ciclo

### Sitio institucional

- Se agregó `/info` como página institucional de Sobre mí, alineada con el posicionamiento de JoinHook.
- Se agregó `/blog` como hub editorial inicial para notas y aprendizajes.
- Se mantuvo explícito que las publicaciones futuras se incorporarán de forma gradual, evitando presentar contenido no existente como publicado.

### CI/CD

- Se eliminó el workflow anterior `redesign-ci.yml`, cuya lógica estaba vinculada a la etapa previa de `redesign-v2`.
- Se creó `.github/workflows/web-ci.yml` con validación para `main` y Pull Requests.
- El nuevo CI valida instalación, auditoría runtime, lint, build, presupuesto de JS, rutas públicas, rutas heredadas protegidas, headers de seguridad, PWA y smoke test del artefacto standalone.
- Se conserva la generación del paquete `joinhook-bluehosting-standalone` para despliegue mediante Passenger.

### Documentación

- `README.md` actualizado para reflejar que Web V1 ya está integrada en `main`.
- Se eliminó del README la referencia obsoleta a `redesign-v2` como rama principal del sitio y a Netlify/OpenNext como despliegue actual.
- Se documentó BlueHosting como destino de despliegue y GitHub Actions como origen del artefacto.
- Se agregó `docs/deployment/JOINHOOK-BLUEHOSTING-RUNBOOK.md` con staging, producción, rollback y límites operativos sin terminal/SSH.

## Estado técnico

- Web V1: integrada en `main`.
- `/info`: implementada en esta rama.
- `/blog`: implementada en esta rama.
- Build standalone: mantenido.
- PWA CGE: mantenida.
- Seguridad base: mantenida en CI.
- Auditoría de dependencias runtime: mantenida como gate de alta severidad.
- Producción `joinhook.cl`: **no verificada en este checkpoint**.
- Staging real en BlueHosting: **pendiente de ejecución física del despliegue**.
- Workspace local `C:\Proyectos\joinhook`: no montado en este entorno y no alterado.
- Commerce/pagos reales: no incorporados al flujo del sitio.

## Siguiente gate

1. Ejecutar CI sobre este branch/PR y corregir cualquier fallo real.
2. Revisar resultado del build y smoke test para `/info` y `/blog`.
3. Desplegar el artefacto validado en staging real de BlueHosting.
4. Ejecutar validación post-despliegue y revisión visual responsive.
5. Solo después del gate de staging, evaluar publicación a `joinhook.cl`.

## Regla de continuidad

GitHub es la fuente de verdad. Ningún estado de producción se considera confirmado por la sola existencia de un build exitoso; debe existir evidencia del despliegue y de las pruebas posteriores.
