# Nueva web JoinHook

**Estado:** fundación de código en desarrollo; pendiente de instalación, pruebas y compilación.  
**Rama:** `rebuild/angular-nestjs-cloud-first`

Este workspace mantiene la reconstrucción institucional separada del sitio Next.js histórico que permanece en la raíz del repositorio.

## Aplicaciones
- `apps/web`: frontend público Angular.
- `apps/api`: backend NestJS con arquitectura hexagonal.

## Arquitectura base
- Angular + TypeScript.
- NestJS + TypeScript.
- Arquitectura hexagonal (Ports and Adapters).
- PostgreSQL como persistencia objetivo; sin conexión activa ni ORM seleccionado.
- GitHub como fuente de verdad.
- Canva como referencia visual y editorial.

## Alcance de esta primera entrega
Incluye navegación, Home, páginas editoriales iniciales, configuración base del frontend, módulo de salud de API y documentación técnica. Los formularios son solo contenido y recorrido visual; no guardan ni envían datos.

## Fases
1. Construcción de código fuente en GitHub.
2. Revisión de páginas, contratos, datos, seguridad y configuración.
3. Instalación reproducible, pruebas y compilación en CI/cloud.
4. Staging y QA.
5. Publicación controlada con rollback.

No declarar compilación, ejecución o despliegue verificados hasta obtener evidencia.
