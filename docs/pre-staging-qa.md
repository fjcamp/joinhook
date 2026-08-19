# Pre-staging QA — JoinHook V2 / CGE Beta 0.3

Este bloque no agrega funciones nuevas. Su objetivo es reducir riesgos antes de exponer la beta en una URL pública de staging.

## Alcance

- Corregir advertencias React que afectan la hidratación/estado inicial de Control Gastronómico Express.
- Validar estructura del manifest PWA y activos mínimos del shell offline.
- Mantener el escenario comercial por defecto sin cobro automático.
- Compilar adicionalmente la landing con checkout habilitado usando exclusivamente datos ficticios de QA.
- Confirmar que el CTA de checkout y la identificación del vendedor aparecen solo cuando se cumplen todos los requisitos de activación.

## Exclusiones

- No se modifica `main`.
- No se cambia DNS ni `joinhook.cl`.
- No se activan pagos reales.
- No se almacenan RUT, direcciones o credenciales reales en el repositorio.
- No se agregan funciones de producto durante el feature freeze.

## Criterio de integración

Integrar a `redesign-v2` únicamente si auditorías, lint, build, presupuesto JS, smoke tests, PWA, headers/CSP, rutas legacy y ambos estados comerciales pasan CI.
