# 03 — Mi Gestión Admin

## Propósito
Aplicación personal de gestión profesional para un administrador o encargado que trabaja dentro de una empresa. Es una herramienta individual de apoyo a la gestión; no es un ERP, no es inicialmente multiusuario y no sustituye el sistema corporativo de la empresa.

## Modelo funcional
Propósito → Responsabilidad → Capacidad → Proceso → Ejecución → Resultado → Control → Decisión → Aprendizaje → Mejora.

## Alcance funcional inicial
- Perfil y contexto profesional.
- Responsabilidades y capacidades.
- Objetivos.
- Procesos.
- Tareas y seguimiento de ejecución.
- Registro de resultados.
- Controles e indicadores.
- Decisiones.
- Aprendizajes.
- Mejoras.
- Auditoría de actividad.
- Exportación y respaldo de datos.

## Arquitectura objetivo
- PWA para PC y dispositivos móviles.
- Backend desacoplado de la interfaz.
- PostgreSQL como persistencia principal cuando exista backend.
- Diseño local-first como objetivo; sincronización cloud como capacidad adicional.
- Integraciones mediante adaptadores independientes: correo, Drive, Notion y calendario.
- Agent Core como capacidad posterior y con permisos explícitos, trazabilidad y control del usuario.

## Tecnología
No se fija todavía un framework definitivo. Ruby on Rails, Django, Laravel u otras alternativas quedan como candidatas hasta completar la investigación técnica sobre mantenimiento, PWA, PostgreSQL, autenticación, seguridad, coste inicial, portabilidad y capacidad de desarrollo local.

No utilizar Replit ni Vercel como dependencia de infraestructura para Mi Gestión Admin.

## Separación de proyectos
Mi Gestión Admin debe mantener su implementación ejecutable en un repositorio/proyecto independiente de JoinOps. El repositorio `fjcamp/joinhook` puede contener documentación estratégica de la iniciativa, pero no se debe introducir aquí la aplicación ejecutable si ello rompe la separación establecida.

## Criterio de terminado del MVP
- Configurar contexto profesional.
- Crear y gestionar responsabilidades, objetivos y procesos.
- Crear, ejecutar y completar tareas.
- Registrar resultados.
- Definir controles/indicadores.
- Consultar pendientes y actividad.
- Exportar/restaurar datos.
- Registrar eventos de auditoría.
- Ejecutar build, lint/typecheck y pruebas automatizadas sobre el repositorio de aplicación.
- Documentar y respaldar cada checkpoint verificable.

## Estado
La especificación funcional, ERD y requisitos de seguridad/compliance están diseñados en `mga/foundation-2026-09-18`. No se declara una aplicación ejecutable como implementada ni verificada hasta localizar o crear su repositorio independiente y comprobar su estado real.