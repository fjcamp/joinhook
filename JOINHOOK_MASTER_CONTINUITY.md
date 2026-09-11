# JOINHOOK — MASTER CONTINUITY

**Fecha de cierre:** 2026-09-11  
**Propósito:** permitir recuperar el contexto operativo de JoinHook sin depender de la memoria de ChatGPT.

## 1. Regla fundamental

La memoria de ChatGPT es un espacio de trabajo, no la única fuente de verdad. Toda decisión, código, documentación y activo importante debe existir en un sistema persistente.

- **GitHub:** fuente de verdad técnica y versionada.
- **Google Drive:** archivo maestro de originales y binarios pesados.
- **Notion:** índice maestro, estado, relaciones y enlaces.
- **ChatGPT:** análisis, diseño, investigación y ejecución temporal.

GitHub conserva código, archivos y su historial de versiones; las ramas permiten trabajar sin modificar directamente la línea principal. citeturn0search0turn0search4

## 2. Orden de recuperación

Ante una nueva conversación o pérdida de contexto:

1. Abrir este archivo.
2. Abrir `PROJECTS.md`.
3. Consultar el índice de continuidad en Notion.
4. Abrir el repositorio indicado por cada proyecto.
5. Consultar Drive para originales/binaries.
6. Revisar `DECISIONS.md`, `CHANGELOG.md`, `FILE-MAP.md` y handoffs del proyecto.
7. Sólo después continuar desarrollo.

## 3. Catálogo oficial

El catálogo oficial contiene 21 proyectos y establece explícitamente que la documentación no implica que todo el código exista. Ver `PROJECTS.md`.

### Proyectos

01. JoinHook Business OS
02. JoinOps
03. Mi Gestión
04. JoinHook Agent Lab
05. Directorio Nacional
06. SnowWise
07. JoinHook Audio Player
08. JoinHook.cl
09. Marketing & Growth
10. CRM / Ventas
11. Finance & Tax
12. Legal & Compliance
13. Agent Control Plane
14. Digital Assets Lab
15. Alianzas y Colaboración
16. Comunidad / Emprendimiento
17. Startup Validation / Agent Discovery
18. Turismo & Estacionalidad
19. Gestión y comunidades locales
20. Observatorio de mercado
21. Cumbre Brava

## 4. Repositorios confirmados

### `fjcamp/joinhook`
Fuente principal del sitio corporativo, documentación maestra, catálogo de proyectos y activos web. JoinHook V2 se encuentra en la rama `redesign-v2`. También contiene la implementación verificable actual de **JoinHook Local/Pulse**, evolución del espacio de producto históricamente denominado Directorio Nacional.

### `fjcamp/joinhook-os`
Fuente principal del Business OS y sus módulos internos.

### `fjcamp/snowwise`
Fuente principal del código de SnowWise.

### `fjcamp/landing`
Starter/legado. No usar como fuente de verdad de JoinHook sin auditoría.

### `fjcamp/Habitante`
Repositorio Android real con código y documentación propia. Su relación con el catálogo de 21 proyectos de JoinHook **no está identificada**; no asignarlo por inferencia.

## 5. Estado de implementación conocido al cierre

| Proyecto | Estado de código conocido | Documentación | Activos visuales |
|---|---|---|---|
| Business OS | Confirmado en `joinhook-os` | Sí | Pendiente de matriz completa |
| JoinOps | Código dedicado no confirmado | Sí | Portada confirmada |
| Mi Gestión | Código dedicado no confirmado | Sí | Portada confirmada |
| Agent Lab | Parcial/conceptual dentro de OS | Sí | Pendiente |
| Directorio Nacional | **Implementación verificable bajo JoinHook Local/Pulse en `joinhook`** | Sí | Pendiente de paquete dedicado |
| SnowWise | Confirmado en `snowwise` | Sí | Portada confirmada |
| Audio Player | No confirmado | Sí | Pendiente |
| JoinHook.cl | Confirmado en `joinhook` | Sí | Sí |
| Marketing & Growth | Módulo/capacidad | Sí | Pendiente |
| CRM/Ventas | Módulo/capacidad | Sí | Pendiente |
| Finance & Tax | Módulo/capacidad | Sí | Pendiente |
| Legal & Compliance | Módulo/capacidad | Sí | Pendiente |
| Agent Control Plane | Arquitectura/módulo | Sí | Pendiente |
| Digital Assets Lab | Arquitectura/módulo | Sí | Pendiente |
| Alianzas | Estructura/documentación | Sí | Pendiente |
| Comunidad | Estructura/documentación | Sí | Pendiente |
| Startup Validation | Documentación | Sí | Pendiente |
| Turismo & Estacionalidad | Investigación/documentación | Sí | Pendiente |
| Comunidades locales | Investigación/documentación | Sí | Pendiente |
| Observatorio | Documentación | Sí | Pendiente |
| Cumbre Brava | Código dedicado no confirmado | Sí | Pendiente |

**Importante:** "pendiente" significa que no fue confirmado durante el cierre; no significa que el activo no exista en otra ubicación.

## 6. Prioridades de continuidad

### Prioridad 1 — Concurso
- JoinOps.
- JoinHook V2 / JoinHook.cl.

### Prioridad 2 — Productos activos
- SnowWise.
- Mi Gestión.

### Prioridad 3 — Plataforma
- Business OS.
- Agent Lab.
- Agent Control Plane.

### Prioridad 4 — Investigación y futuros productos
- Directorio Nacional / JoinHook Local / Pulse — resolver identidad mediante ADR antes de expansión.
- Audio Player.
- Startup Validation.
- Observatorio.
- Turismo & Estacionalidad.
- Comunidades locales.
- Alianzas.
- Comunidad.
- Digital Assets Lab.

### Separado
- Cumbre Brava: proyecto personal independiente de JoinHook.

## 7. Regla de arquitectura

- Business OS es una plataforma unificada en experiencia pero federada técnicamente.
- Los productos con necesidad de independencia pueden mantener su propia base de datos y ciclo de despliegue.
- n8n Community Edition se usa para automatización/orquestación, nunca como fuente de verdad.
- No mezclar CGE con JoinOps: son productos distintos.
- JoinHook V2 es el sitio corporativo; no debe convertirse en contenedor indiscriminado de código de productos.
- JoinHook Local/Pulse y Directorio Nacional deben reconciliar su identidad antes de crear otro repositorio o duplicar implementación.

## 8. Regla de cambios

Antes de modificar producción:

1. Identificar repositorio y rama.
2. Crear rama/commit seguro cuando corresponda.
3. Auditar estado actual.
4. Ejecutar pruebas.
5. Validar staging.
6. Registrar decisión.
7. Sólo entonces promover a producción.

No realizar reemplazos destructivos sin respaldo y rollback.

## 9. Activos y respaldo

### GitHub
Guardar código, Markdown, arquitectura, decisiones, workflows, tests y activos pequeños necesarios para ejecución.

### Drive
Guardar originales de diseño, imágenes maestras, vídeos, PDFs, documentos, hojas de cálculo, presentaciones, ZIP/releases y otros binarios pesados.

### Notion
Guardar índice, estado, enlaces, roadmap, relaciones, decisiones de alto nivel y bitácoras.

No guardar secretos en GitHub. Para archivos grandes, evaluar Git LFS o Drive según necesidad; GitHub documenta soporte específico para archivos grandes. citeturn0search3turn0search6

## 10. Cierre 2026-09-11

La auditoría de continuidad fue registrada en:

`docs/continuity/PROJECTS-BACKUP-AUDIT-2026-09-11.md`

La segunda pasada de auditoría confirmó que Directorio Nacional tiene implementación verificable bajo JoinHook Local/Pulse en `fjcamp/joinhook`; este dato queda persistido tanto en la auditoría como en este master.

También existe una entrada de continuidad en Notion.

### Pendiente antes de declarar cierre físico total

- Auditoría directa de Google Drive cuando la conexión esté disponible.
- Confirmar archivos originales por proyecto.
- Confirmar si JoinOps, Mi Gestión, Audio Player y Cumbre Brava tienen código fuera de los repositorios actualmente identificados.
- Resolver mediante ADR el naming Directorio Nacional / JoinHook Local / Pulse.
- Crear una matriz final de enlaces GitHub/Drive/Notion por proyecto.
- Crear/actualizar paquetes visuales por proyecto donde corresponda.

## 11. Regla para futuras conversaciones

Si una conversación produce una decisión importante, un diseño definitivo, una arquitectura, un cambio de código o un entregable, **no considerarlo respaldado hasta que exista una referencia persistente en GitHub, Drive o Notion**.

El objetivo es que JoinHook pueda continuar aunque se borre la memoria de ChatGPT, se cierre una conversación o se cambie de sistema de IA.
