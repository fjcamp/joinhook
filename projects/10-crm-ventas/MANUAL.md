# 10 — CRM / Ventas

## Propósito
Gestionar prospectos, clientes, contactos, oportunidades, propuestas, seguimiento y cierre comercial.

## Tecnologías candidatas
- Ruby on Rails — dominio CRM y API.
- Next.js + TypeScript — pipeline visual y dashboard.
- Django + Python — scoring, analítica y automatizaciones.
- Laravel + PHP — alternativa administrativa.

## Estructura prevista
```text
leads/; contacts/; accounts/; opportunities/; quotes/; activities/; reports/
```
Cada archivo debe registrarse en `FILE-MAP.md` con ruta, responsabilidad, entradas, salidas y dependencias.

## Reglas
Toda oportunidad debe tener estado, responsable, fecha de actualización y trazabilidad. Los agentes pueden sugerir acciones, pero no modificar datos críticos fuera de sus permisos.
