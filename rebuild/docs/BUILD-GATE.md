# Gate para pruebas, instalación y compilación

**No ejecutar durante la fase cloud-first actual.**

## Entrada al gate
- Páginas, rutas, contenido y activos visuales revisados.
- Contratos API y frontend/backend coherentes.
- Arquitectura hexagonal y límites de módulos revisados.
- Modelo de datos y decisión de persistencia aprobados.
- Variables por ambiente y secretos fuera del repositorio.
- Lockfile creado en CI al abrir esta fase.
- Pruebas y criterios de aceptación definidos.

## Secuencia futura
1. Revisar compatibilidad y runtime.
2. Instalación reproducible en CI.
3. Auditoría, lint y pruebas unitarias/integración.
4. Build Angular y NestJS en nube/CI.
5. Inspección de artefactos, rutas, accesibilidad y seguridad.
6. Staging aislado y no indexable.
7. QA funcional y prueba PostgreSQL con datos de prueba.
8. Rollback ensayado antes de publicar.

Código versionado no significa que compile. Un build verde no significa que staging esté validado. Un health endpoint no verifica PostgreSQL.
