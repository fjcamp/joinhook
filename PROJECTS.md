# JoinHook — Catálogo maestro de proyectos

## Propósito

Este documento es el índice de referencia para que una persona, agente de IA o sistema distinto de ChatGPT pueda comprender qué proyectos existen, para qué sirven, dónde se documentan y cómo deben implementarse.

**Regla:** la documentación describe arquitectura y ubicaciones previstas; no implica que todo el código exista todavía.

## Proyectos

| ID | Proyecto | Carpeta | Descripción |
|---|---|---|---|
| 01 | JoinHook Business OS | `projects/01-business-os/` | Plataforma central federada de gestión empresarial. |
| 02 | JoinOps | `projects/02-joinops/` | Gestión operacional modular para organizaciones y negocios. |
| 03 | Mi Gestión | `projects/03-mi-gestion/` | Administración operativa para pequeños negocios. |
| 04 | JoinHook Agent Lab | `projects/04-agent-lab/` | Diseño, desarrollo y evaluación de agentes especializados. |
| 05 | Directorio Nacional | `projects/05-directorio-nacional/` | Directorio digital de turismo, comercio, cultura y servicios de Chile. |
| 06 | SnowWise | `projects/06-snowwise/` | Experiencia digital de montaña, nieve, clima y seguridad. |
| 07 | JoinHook Audio Player | `projects/07-audio-player/` | Reproductor multimedia de escritorio. |
| 08 | JoinHook.cl | `projects/08-joinhook-web/` | Sitio corporativo y presencia digital de JoinHook. |
| 09 | Marketing & Growth | `projects/09-marketing-growth/` | Sistema de marketing, SEO/SEM, mercado y crecimiento. |
| 10 | CRM / Ventas | `projects/10-crm-ventas/` | Gestión de leads, clientes y oportunidades comerciales. |
| 11 | Finance & Tax | `projects/11-finance-tax/` | Gestión financiera, tesorería y procesos tributarios. |
| 12 | Legal & Compliance | `projects/12-legal-compliance/` | Contratos, cumplimiento, privacidad y RRHH. |
| 13 | Agent Control Plane | `projects/13-agent-control-plane/` | Gobierno, permisos, supervisión y trazabilidad de agentes. |
| 14 | Digital Assets Lab | `projects/14-digital-assets-lab/` | Laboratorio aislado para activos digitales y experimentación. |
| 15 | Alianzas y Colaboración | `projects/15-alianzas/` | Estructura para alianzas con instituciones y empresas. |
| 16 | Comunidad / Emprendimiento | `projects/16-comunidad-emprendimiento/` | Programa de soluciones digitales accesibles y visibilidad. |
| 17 | Startup Validation / Agent Discovery | `projects/17-validation-agent-discovery/` | Validación estructurada de ideas y oportunidades. |
| 18 | Turismo & Estacionalidad | `projects/18-investigacion-estacionalidad/` | Investigación sobre gestión turística estacional. |
| 19 | Gestión y comunidades locales | `projects/19-comunidades-locales/` | Investigación sobre modelos de administración y organización local. |
| 20 | Observatorio de mercado | `projects/20-observatorio-mercado/` | Observación de tendencias, necesidades y oportunidades. |
| 21 | Cumbre Brava | `projects/21-cumbre-brava/` | Videojuego independiente para PC y Android. |

## Estándar tecnológico comparativo

Cada manual incluye cuatro rutas tecnológicas posibles. **Ruby on Rails es obligatoria como una de las cuatro alternativas**, no como decisión automática.

1. **Ruby on Rails** — opción backend/producto full-stack con convención fuerte y desarrollo rápido.
2. **Next.js + TypeScript** — opción web/PWA moderna y adecuada para interfaces ricas.
3. **Django + Python** — opción sólida para datos, automatización, APIs y lógica compleja.
4. **Laravel + PHP** — opción pragmática para aplicaciones web y ecosistemas PHP/hosting tradicional.

La elección definitiva se realizará por proyecto según requisitos, coste, rendimiento, disponibilidad de librerías, despliegue, mantenimiento y capacidades del equipo.

## Estructura documental estándar de cada proyecto

```text
projects/XX-nombre/
├── README.md                 # Identidad y resumen del proyecto
├── MANUAL.md                 # Manual maestro de implementación
├── ARCHITECTURE.md           # Arquitectura técnica y límites
├── FILE-MAP.md               # Ubicación y función de cada archivo previsto
├── DATA-MODEL.md             # Entidades, relaciones y datos
├── API.md                    # APIs, eventos e integraciones
├── SECURITY.md               # Seguridad, secretos, permisos y amenazas
├── TESTING.md                # Estrategia de pruebas y criterios de aceptación
├── DEPLOYMENT.md             # Desarrollo, staging, producción y rollback
├── DECISIONS.md               # ADRs y decisiones técnicas
└── CHANGELOG.md               # Historial de cambios relevantes
```

## Principios de implementación

- GitHub es la fuente de verdad del código y documentación versionada.
- No guardar secretos, tokens, contraseñas ni credenciales en el repositorio.
- Separar desarrollo, staging y producción.
- Documentar cada archivo nuevo en `FILE-MAP.md`.
- No introducir una tecnología sólo por preferencia: justificarla.
- Mantener límites claros entre productos y módulos.
- Para JoinHook Business OS, n8n se limita a automatización/orquestación y no es fuente de verdad de los dominios.
- Proyectos personales, como Cumbre Brava, permanecen separados conceptualmente de JoinHook.
