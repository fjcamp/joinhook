# JoinHook V2 — Production release

Fecha: 2026-08-21

- Fuente: `main` posterior al merge de PR #2.
- Runtime objetivo: Node.js 20.20.2 + Passenger en BlueHosting.
- Build: GitHub Actions, no compilar en BlueHosting.
- Artifact esperado: `joinhook-bluehosting-production`.
- Producción no debe incluir `JOINHOOK_DEPLOY_TARGET=staging` ni `X-Robots-Tag: noindex`.
- Antes del corte: respaldar el sitio actual y conservar rollback.
- Startup file: `server.js`.
- Checkout real permanece deshabilitado hasta configurar datos reales del vendedor y medio de pago.
