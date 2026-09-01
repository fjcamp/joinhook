# AI Continuity — JoinHook

Este repositorio contiene varios dominios con ciclos de release distintos. Antes de tocar código, leer el handoff que corresponda:

- Empresa/web: `docs/continuity/JOINHOOK_COMPANY_AND_WEB_HANDOFF_2026-08-31.md`
- Control Gastronómico Express: `docs/continuity/CONTROL_GASTRONOMICO_EXPRESS_HANDOFF_2026-08-31.md`
- JoinHook Local/Pulse: `docs/continuity/JOINHOOK_LOCAL_PULSE_HANDOFF_2026-08-31.md`

Luego revisar `README.md`, docs/runbooks, PR/issues y CI actual.

## Regla de verdad

Separar siempre: MAIN / PR-RAMA / DOCUMENTADO-NO REVALIDADO / PLANIFICADO.

## PR críticos al corte

- #31 Commerce Core — draft; no habilitar pagos productivos por existir el código.
- #40 CGE navigation UX — draft.
- #28 RMDC/routing WordPress — relevante antes de producción.

## Producción

Revisar JH-OPS-001/JH-OPS-002 y runbooks BlueHosting/Passenger/.htaccess antes de cambiar routing o artifacts.

## Seguridad

No secretos en Git, `NEXT_PUBLIC_*`, prompts o docs. Pagos, producción, borrados y cambios irreversibles requieren gates y aprobación humana.

## Cierre de sesión

Registrar bitácora con fecha, branch/commit, pruebas, resultado, riesgos, pendientes y rollback.
