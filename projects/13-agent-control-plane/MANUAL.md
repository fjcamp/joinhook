# 13 — Agent Control Plane

## Propósito
Capa de gobierno que registra agentes, capacidades, permisos, herramientas, ejecuciones, estados, límites y auditoría.

## Tecnologías candidatas
- Ruby on Rails — API de control y políticas.
- Next.js + TypeScript — consola de administración.
- Django + Python — evaluación/telemetría avanzada.
- Laravel + PHP — alternativa administrativa.

## Estructura
```text
registry/; policies/; permissions/; runs/; tools/; audit/; evaluations/
```

## Regla
Separar identidad del agente de identidad humana. Toda acción sensible debe tener autorización explícita y trazabilidad.
