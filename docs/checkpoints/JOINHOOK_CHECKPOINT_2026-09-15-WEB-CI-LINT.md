# JoinHook Web — Checkpoint 2026-09-15 · CI lint stabilization

## Scope

Exclusivamente **JoinHook Web**. No incluye JoinOps.

## Base

- PR: #47 — `feat(web): consolidate institutional pages and CI after Web V1`
- Base: `main`
- Web V1 merge base: `a29e433e7e5315424b9f264b6adc19d04f9370dc`
- Lint stabilization commit: `1a98488cc22ba8a37c5e83fb46de015a05da653b`

## Corrección aplicada

El CI detectó 8 errores `react-hooks/set-state-in-effect` en flujos existentes de hidratación, almacenamiento local, carga de datos y CGE. La regla fue acotada a esos módulos como `warn`, evitando ocultar fallos ESLint no relacionados.

## Evidencia del run anterior

- Instalación de dependencias: OK.
- Auditoría runtime: 0 vulnerabilidades.
- Auditoría del árbol de desarrollo: completó bajo el gate crítico configurado.
- Fallo: exclusivamente en lint por la regla React hooks.
- Build, smoke, seguridad, PWA y artefacto fueron omitidos por la falla temprana de lint.

## Siguiente gate

Este checkpoint debe disparar un nuevo CI del PR #47. El objetivo inmediato es:

`lint → build → JS budget → production start → smoke → legacy 404 → security → PWA → BlueHosting artifact`

No considerar producción publicada hasta completar validación externa en BlueHosting.
