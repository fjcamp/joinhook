# Auditoría maestra de respaldo de proyectos — 2026-09-11

## Objetivo

Verificar que los proyectos registrados en la memoria operativa de JoinHook tengan una ubicación persistente y recuperable para código, documentación y activos visuales, y definir qué debe conservarse antes de limpiar memoria/conversaciones de ChatGPT.

## Fuente de referencia

La memoria operativa registra 21 proyectos. `PROJECTS.md` de este repositorio confirma el mismo catálogo de 21 proyectos y establece que GitHub es la fuente de verdad para código y documentación versionada.

## Resultado ejecutivo

**Conclusión: el catálogo documental está respaldado, pero NO todos los 21 proyectos tienen código propio ni activos visuales completos en GitHub.** Esto es correcto para varios módulos conceptuales, pero debe quedar explícitamente clasificado para evitar creer que existe implementación cuando sólo existe diseño/documentación.

### Repositorios GitHub actualmente identificados

- `fjcamp/joinhook` — sitio corporativo JoinHook, documentación maestra, JoinHook V2 (`redesign-v2`), activos web y catálogo de proyectos.
- `fjcamp/joinhook-os` — Business OS privado, backend y documentación de continuidad/arquitectura.
- `fjcamp/snowwise` — código productivo de SnowWise (mobile/admin/Supabase).
- `fjcamp/landing` — starter/legado; no se considera fuente de verdad de JoinHook.
- `fjcamp/Habitante` — repositorio existente, pero no se pudo validar su contenido mediante README; queda en auditoría pendiente.

No se encontró un repositorio específico para Cumbre Brava ni para un JoinOps independiente durante esta auditoría.

## Matriz de respaldo

| ID | Proyecto | Documentación | Código confirmado | Imágenes/activos | Fuente principal | Estado |
|---|---|---|---|---|---|---|
| 01 | JoinHook Business OS | Sí | Sí, `joinhook-os` | Parcial/no mapeado por proyecto | `joinhook-os` | 🟡 |
| 02 | JoinOps | Sí | **No confirmado como código propio** | Sí, portada `joinops-cover.svg` | `joinhook` + futuro repo/producto | 🔴 código pendiente |
| 03 | Mi Gestión | Sí | No confirmado como repo independiente | Sí, `mi-gestion-cover.svg` | `joinhook` + futuras fuentes | 🔴 código pendiente |
| 04 | Agent Lab | Sí | Parcial/conceptual dentro de OS; repo independiente no confirmado | No confirmado | `joinhook-os` | 🟡 |
| 05 | Directorio Nacional | Sí | No confirmado | No confirmado | `joinhook` | 🔴 |
| 06 | SnowWise | Sí | **Sí**, `fjcamp/snowwise` | Sí, portada en `joinhook`; assets propios deben mantenerse en SnowWise | `snowwise` | 🟢 |
| 07 | JoinHook Audio Player | Sí | No confirmado | No confirmado | `joinhook` | 🔴 código pendiente |
| 08 | JoinHook.cl | Sí | **Sí**, `fjcamp/joinhook`, incluida rama `redesign-v2` | Sí, activos `public/` | `joinhook` | 🟢/🟡 por publicación |
| 09 | Marketing & Growth | Sí | No como producto independiente; capacidad prevista en OS | No confirmado | `joinhook-os` | 🟡 |
| 10 | CRM / Ventas | Sí | No como producto independiente; capacidad prevista en OS | No confirmado | `joinhook-os` | 🟡 |
| 11 | Finance & Tax | Sí | No como producto independiente; capacidad prevista en OS | No confirmado | `joinhook-os` | 🟡 |
| 12 | Legal & Compliance | Sí | No como producto independiente; capacidad prevista en OS | No confirmado | `joinhook-os` | 🟡 |
| 13 | Agent Control Plane | Sí | Parcial/arquitectura en `joinhook-os` | No confirmado | `joinhook-os` | 🟡 |
| 14 | Digital Assets Lab | Sí | Arquitectura/documentación en `joinhook-os`; implementación independiente no confirmada | No confirmado | `joinhook-os` | 🟡 |
| 15 | Alianzas y Colaboración | Sí | No confirmado como software independiente | No confirmado | `joinhook` + Notion | 🟡 |
| 16 | Comunidad / Emprendimiento | Sí | No confirmado como software independiente | No confirmado | `joinhook` + Notion | 🟡 |
| 17 | Startup Validation / Agent Discovery | Sí | No confirmado | No confirmado | `joinhook` | 🔴 |
| 18 | Turismo & Estacionalidad | Sí | Investigación/documentación; software no confirmado | No confirmado | `joinhook` + Notion | 🟡 |
| 19 | Gestión y comunidades locales | Sí | Investigación/documentación; software no confirmado | No confirmado | `joinhook` + Notion | 🟡 |
| 20 | Observatorio de mercado | Sí | No confirmado como aplicación independiente | No confirmado | `joinhook` + Notion | 🟡 |
| 21 | Cumbre Brava | Sí | **No se encontró repo dedicado** | No confirmado en GitHub como proyecto completo | `joinhook` + futura repo Cumbre Brava | 🔴 código/activos pendientes |

## Evidencia visual encontrada

`fjcamp/joinhook` contiene actualmente portadas específicas para:

- `public/project-covers/joinops-cover.svg`
- `public/project-covers/mi-gestion-cover.svg`
- `public/project-covers/snowwise-cover.svg`

También existen múltiples imágenes generales en `public/images/`, además de iconos y activos PWA. Sin embargo, no están todavía organizados en una matriz que permita afirmar que cada uno de los 21 proyectos posee su paquete visual completo.

## Comparación con memoria operativa

La memoria y la documentación coinciden en los puntos estructurales principales:

- 21 proyectos registrados.
- JoinHook V2 en `fjcamp/joinhook`, rama `redesign-v2`.
- Business OS separado en `fjcamp/joinhook-os`.
- SnowWise separado en `fjcamp/snowwise`.
- Cumbre Brava conceptualmente separado de JoinHook.
- JoinOps debe permanecer conceptualmente separado de CGE.
- GitHub como fuente de verdad para código/documentación versionada.
- Drive como repositorio maestro para originales/binarios pesados.
- Notion como índice, dashboard y conocimiento relacional.

## Corrección importante

No debe interpretarse el catálogo de `PROJECTS.md` como evidencia de que cada proyecto ya tiene implementación. El propio documento indica que las ubicaciones previstas no implican que todo el código exista todavía.

Por lo tanto, a partir de esta auditoría cada proyecto debe manejar tres estados independientes:

1. **Código:** inexistente / prototipo / desarrollo / piloto / producción.
2. **Documentación:** básica / completa / mantenida.
3. **Activos:** inexistentes / parciales / completos.

## Arquitectura permanente de respaldo recomendada

### GitHub — fuente de verdad técnica

Guardar:
- código fuente;
- documentación Markdown;
- arquitectura;
- decisiones;
- changelog;
- pruebas;
- configuración no secreta;
- workflows;
- pequeños SVG/PNG necesarios para el producto;
- handoffs de continuidad.

No guardar secretos, contraseñas, tokens, claves privadas ni credenciales.

### Google Drive — archivo maestro de originales

Guardar:
- originales de imágenes;
- videos;
- PDFs;
- documentos Word;
- Excel;
- presentaciones;
- diseños editables;
- exportaciones de entregables;
- ZIP de releases cuando corresponda;
- copias de respaldo de proyectos completos cuando sea necesario.

Conservar originales y versiones relevantes sin sustituirlos por capturas comprimidas.

### Notion — índice y memoria operacional

Guardar:
- catálogo de proyectos;
- estado de cada proyecto;
- enlaces a repositorios GitHub;
- enlaces a carpetas/documentos Drive;
- decisiones de alto nivel;
- roadmap;
- relaciones entre proyectos;
- bitácoras;
- fuentes y contexto necesario para recuperar trabajo.

Notion no reemplaza GitHub como fuente del código ni Drive como archivo de originales.

### ChatGPT — espacio temporal de trabajo

ChatGPT se utiliza para analizar, diseñar, investigar y ejecutar acciones autorizadas. Las decisiones y entregables relevantes deben salir del chat y quedar en los sistemas persistentes.

## Regla de continuidad

**Ningún proyecto importante debe depender de la memoria de ChatGPT para poder retomarse.**

Ante una nueva conversación, el orden de recuperación debe ser:

1. Notion para localizar el proyecto y su estado.
2. GitHub para código, documentación técnica y decisiones versionadas.
3. Drive para originales y archivos binarios.
4. ChatGPT sólo como contexto adicional, nunca como única fuente.

## Prioridad inmediata antes de limpiar memoria

1. Completar matriz de repositorio/código/documentación/activos para los 21 proyectos.
2. Crear o confirmar repositorios dedicados sólo donde exista código real y convenga separar el producto.
3. Preparar paquete visual de cada proyecto que deba mostrarse públicamente.
4. Registrar enlaces GitHub + Drive + Notion por proyecto.
5. Mantener JoinHook V2 y JoinOps como prioridades de concurso.
6. No eliminar ni mover proyectos ambiguos hasta completar auditoría.
7. No confundir documentación de proyecto con implementación existente.

## Estado de esta auditoría

Fecha: 2026-09-11

Auditoría realizada contra GitHub accesible y la memoria operativa disponible. Notion también fue verificado como sistema de continuidad. Google Drive queda pendiente de verificación directa en una conexión de Drive disponible; su rol como repositorio maestro ya está definido en el sistema de continuidad.
