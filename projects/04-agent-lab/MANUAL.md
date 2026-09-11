# 04 — JoinHook Agent Lab

## Propósito
Entorno separado para diseñar, implementar, probar, evaluar y documentar agentes especializados que puedan integrarse con JoinHook sin convertir al agente en fuente de verdad del negocio.

## Roles de agentes
Orchestrator; Product Manager; Research & Market; UX/UI; Solution Architect; Engineering; Data & Integration; QA; Security; Compliance & Privacy; DevOps/SRE; Documentation; Marketing & Growth; Customer Success.

## Tecnologías candidatas
- **Ruby on Rails:** APIs, registro de agentes, permisos y workflows.
- **Next.js + TypeScript:** consola de agentes y observabilidad.
- **Django + Python:** AI/data tooling, evaluaciones y pipelines.
- **Laravel + PHP:** alternativa de administración y APIs.

## Estructura
```text
agents/                    # definiciones y contratos
orchestration/             # coordinación
prompts/                   # instrucciones versionadas
evals/                     # evaluaciones y datasets
policies/                  # seguridad y límites
connectors/                # integraciones
docs/                      # documentación
```

## Regla
Los agentes ejecutan tareas dentro de permisos definidos. Los sistemas de dominio mantienen los datos canónicos.

## Calidad
Toda capacidad de agente debe tener objetivo, herramientas permitidas, límites, casos de prueba, evaluación y mecanismo de auditoría.
