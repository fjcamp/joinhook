# JoinOps — Inicio Formal de Desarrollo

**Fecha:** 2026-09-11
**Autorización de inicio:** 4455
**Estado:** DESARROLLO INICIADO

## Objetivo
Iniciar la implementación de JoinOps utilizando como base los requisitos y decisiones documentados en la Bitácora Maestra y documentos de continuidad existentes.

## Orden de desarrollo
1. Foundation / Platform Kernel
2. Seguridad e identidad
3. Business Core y Master Data
4. Event / Workflow / Audit
5. Payment & Settlement Hub
6. Operación gastronómica: POS, Caja, Tesorería, Order Engine, FOH, Routing, KDS
7. Compras / Bodega / Inventario / Recetas / Producción
8. Finanzas / Contabilidad / Tesorería / Tax Core
9. SII Integration Hub
10. Migration & Onboarding Factory
11. Intelligence / AI / Copilot
12. UX y superficies Windows/PWA
13. Integraciones, observabilidad, backups y operación

## Reglas de seguridad
- No secretos en código, frontend ni repositorio.
- Mínimo privilegio.
- RBAC y MFA donde corresponda.
- Auditoría desde el inicio.
- Idempotencia para operaciones críticas.
- Validación server-side.
- Separación de ambientes.
- Staging antes de producción.
- Backups y rollback antes de cambios destructivos.
- IA propone; reglas validan; humano autoriza cuando corresponda.
- SII nunca se implementará directamente contra producción sin certificación y pruebas.

## Regla de implementación
No saltar directamente a módulos aislados. Cada componente debe respetar Platform Kernel, Business Core, eventos, permisos, auditoría, configuración y contratos de integración.

## Control de calidad
Cada incremento debe incluir, según corresponda:
- tests unitarios;
- tests de integración;
- validación de seguridad;
- manejo de errores;
- auditoría;
- migraciones de base de datos reversibles cuando sea viable;
- documentación;
- criterios de aceptación;
- verificación antes de promover ambiente.

## Estado inicial
Este archivo marca el inicio formal del desarrollo. Las decisiones nuevas deben registrarse en la Bitácora Maestra y/o documentos de continuidad correspondientes para mantener continuidad entre IAs y revisiones humanas.
