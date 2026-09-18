# Auditoría maestra de respaldo de proyectos — 2026-09-11

## Objetivo

Verificar que los proyectos registrados en la memoria operativa de JoinHook tengan una ubicación persistente y recuperable para código, documentación y activos visuales, y definir qué debe conservarse antes de limpiar memoria/conversaciones de ChatGPT.

## Fuente de referencia

La memoria operativa registra 21 proyectos. `PROJECTS.md` de este repositorio confirma el mismo catálogo de 21 proyectos y establece que GitHub es la fuente de verdad para código y documentación versionada.

## Resultado ejecutivo

**Conclusión actualizada:** el catálogo documental está respaldado, pero no todos los 21 proyectos son productos independientes ni todos tienen repositorio propio. La segunda pasada de auditoría confirmó implementaciones embebidas que no habían quedado reflejadas en la primera matriz.

### Repositorios GitHub actualmente identificados

- `fjcamp/joinhook` — sitio corporativo JoinHook, documentación maestra, JoinHook V2 (`redesign-v2`), activos web, JoinHook Local y catálogo de proyectos.
- `fjcamp/joinhook-os` — Business OS privado, backend y documentación de continuidad/arquitectura.
- `fjcamp/snowwise` — código productivo de SnowWise (mobile/admin/Supabase).
- `fjcamp/landing` — starter/legado; no se considera fuente de verdad de JoinHook.
- `fjcamp/Habitante` — repositorio Android real, con código y documentación propia; su relación con los 21 proyectos de JoinHook **no está identificada** y no debe asignarse por inferencia.

No se encontró un repositorio específico para JoinOps, Mi Gestión, Audio Player, Directorio Nacional ni Cumbre Brava. Sin embargo, la búsqueda de código/documentación reveló implementación territorial verificable relacionada históricamente con Directorio Nacional dentro de `fjcamp/joinhook`.

## Matriz de respaldo actualizada

| ID | Proyecto | Documentación | Código confirmado | Imágenes/activos | Fuente principal | Estado |
|---|---|---|---|---|---|---|
| 01 | JoinHook Business OS | Sí | Sí, `joinhook-os` | Parcial/no mapeado por proyecto | `joinhook-os` | 🟡 |
| 02 | JoinOps | Sí | **No confirmado como código propio** | Sí, portada `joinops-cover.svg` | `joinhook` + futuro repo/producto | 🔴 código pendiente |
| 03 | Mi Gestión | Sí | No confirmado como repo independiente | Sí, `mi-gestion-cover.svg` | `joinhook` + futuras fuentes | 🔴 código pendiente |
| 04 | Agent Lab | Sí | Parcial/conceptual dentro de OS; repo independiente no confirmado | No confirmado | `joinhook-os` | 🟡 |
| 05 | Directorio Nacional | Sí | **Sí, pero bajo evolución JoinHook Local/Pulse dentro de `joinhook`** | No se confirmó paquete visual dedicado | `joinhook` | 🟡 naming/arquitectura pendiente |
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
| 20 | Observatorio de mercado | Sí | No confirmado como aplicación independiente | No confirmado | `joinhook` | 🟡 |
| 21 | Cumbre Brava | Sí | **No se encontró repo dedicado** | No confirmado en GitHub como proyecto completo | `joinhook` + futura repo Cumbre Brava | 🔴 código/activos pendientes |

## Evidencia adicional encontrada en segunda pasada

### Directorio Nacional → JoinHook Local / Pulse

El archivo `docs/continuity/JOINHOOK_LOCAL_PULSE_HANDOFF_2026-08-31.md` establece que existe una **implementación territorial funcional en `fjcamp/joinhook` main**, con superficie pública `/local` y administración `/local-admin`. El handoff identifica Directorio Nacional, JoinHook Pulse y JoinHook Local como evoluciones del mismo espacio de problema y ordena resolver el naming mediante ADR antes de escalar. fileciteturn122file0L2-L2

La implementación actual documentada incluye backend territorial en Supabase, tablas `local_*`, Auth/RLS/RBAC, API server-side, dataset de contingencia, geolocalización/clima, discovery multi-negocio, CRUD administrativo y auditoría. Por tanto, **no corresponde seguir clasificando Directorio Nacional simplemente como “sin código”**. Lo correcto es clasificarlo como implementación existente bajo el nombre/evolución JoinHook Local/Pulse, con identidad de producto todavía pendiente de decisión. fileciteturn122file0L2-L2

### JoinOps

La búsqueda en `fjcamp/joinhook` confirma documentación, portada visual y presencia pública del proyecto, incluyendo que la portada y el sitio lo presentan como producto en desarrollo. No apareció una ruta de aplicación ni un repositorio de código independiente que permita afirmar que existe un runtime JoinOps propio. Por ahora se mantiene **código dedicado pendiente de confirmar**, sin confundirlo con EGO. fileciteturn117file0L2-L10 fileciteturn117file10L140-L148 fileciteturn117file11L153-L160

### Mi Gestión

La búsqueda confirma integración del producto en la superficie corporativa y su portada visual, pero no encontró un repositorio/ruta de aplicación independiente que permita afirmar que existe un runtime propio. Se mantiene **código dedicado pendiente de confirmar**. fileciteturn118file2L40-L47 fileciteturn118file3L53-L61

### Audio Player y Cumbre Brava

Las búsquedas confirman documentación persistente en el catálogo, pero no localizaron implementación propia en `joinhook` o `joinhook-os`. Cumbre Brava debe seguir tratándose como proyecto personal independiente de JoinHook. fileciteturn119file0L2-L8 fileciteturn120file0L2-L8

### Habitante

La auditoría actual ya no considera `fjcamp/Habitante` un repositorio ambiguo: existe código Android real y documentación propia. Sin embargo, **no se asigna a ninguno de los 21 proyectos** hasta que exista evidencia que establezca esa relación. Esto evita contaminar el catálogo JoinHook con una asociación incorrecta.

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
- JoinOps debe permanecer conceptualmente separado de EGO.
- GitHub como fuente de verdad para código/documentación versionada.
- Drive como repositorio maestro para originales/binarios pesados.
- Notion como índice, dashboard y conocimiento relacional.

La segunda pasada agrega una corrección importante: **Directorio Nacional no está vacío de implementación; su código verificable vive actualmente bajo JoinHook Local/Pulse en `fjcamp/joinhook`.**

## Corrección importante

No debe interpretarse el catálogo de `PROJECTS.md` como evidencia de que cada proyecto ya tiene implementación. El propio documento indica que las ubicaciones previstas no implican que todo el código exista todavía.

Por lo tanto, cada proyecto debe manejar tres estados independientes:

1. **Código:** inexistente / prototipo / desarrollo / piloto / producción.
2. **Documentación:** básica / completa / mantenida.
3. **Activos:** inexistentes / parciales / completos.

Además, cuando un proyecto evoluciona bajo otro nombre, debe conservarse una relación explícita de identidad/naming para evitar duplicar productos o crear repositorios innecesarios.

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
6. Resolver el naming Directorio Nacional / JoinHook Local / Pulse mediante ADR antes de nueva expansión.
7. No eliminar ni mover proyectos ambiguos hasta completar auditoría.
8. No confundir documentación de proyecto con implementación existente.

## Estado de esta auditoría

Fecha: 2026-09-11

Auditoría realizada contra GitHub accesible y la memoria operativa disponible. Notion también fue verificado como sistema de continuidad. Google Drive queda pendiente de verificación directa en una conexión de Drive disponible; su rol como repositorio maestro ya está definido en el sistema de continuidad.
