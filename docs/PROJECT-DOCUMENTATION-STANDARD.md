# Estándar de documentación de proyectos

## Objetivo
Permitir que cualquier desarrollador, auditor o sistema de IA pueda entrar al repositorio sin depender del contexto de conversaciones previas.

## Obligación por archivo
Todo archivo de implementación debe poder responder:
- ¿Qué hace?
- ¿Por qué existe?
- ¿Quién lo consume?
- ¿Qué entradas recibe?
- ¿Qué devuelve o modifica?
- ¿De qué depende?
- ¿Qué riesgos tiene?
- ¿Cómo se prueba?

## Documentos obligatorios
`README.md` identidad; `MANUAL.md` implementación; `ARCHITECTURE.md` arquitectura; `FILE-MAP.md` ubicación de archivos; `DATA-MODEL.md` datos; `API.md` contratos; `SECURITY.md` seguridad; `TESTING.md` pruebas; `DEPLOYMENT.md` despliegue; `DECISIONS.md` decisiones; `CHANGELOG.md` cambios.

## Convención de código
Mantener separación entre dominio, infraestructura, interfaz y pruebas. Evitar archivos gigantes. Cada módulo debe tener una responsabilidad principal.

## Estados
`idea` → `design` → `prototype` → `beta` → `production` → `maintenance` / `archived`.

El estado debe ser explícito y no inferirse por la existencia de una carpeta.
