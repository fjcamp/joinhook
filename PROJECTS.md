# JoinHook — Catálogo maestro de proyectos

## Propósito

Este documento es el índice de referencia para que una persona, agente de IA o sistema distinto de ChatGPT pueda comprender qué proyectos existen, para qué sirven, dónde se documentan y cómo deben implementarse.

**Regla:** la documentación describe arquitectura y ubicaciones previstas; no implica que todo el código exista todavía.

## Proyectos

| ID | Proyecto | Documento | Descripción |
|---|---|---|---|
| 01 | JoinHook Business OS | `projects/01-business-os/MANUAL.md` | Plataforma central federada de gestión empresarial. |
| 02 | JoinOps | `projects/02-joinops/MANUAL.md` | Gestión operacional modular para organizaciones y negocios. |
| 03 | Mi Gestión | `projects/03-mi-gestion/MANUAL.md` | Administración operativa para pequeños negocios. |
| 04 | JoinHook Agent Lab | `projects/04-agent-lab/MANUAL.md` | Diseño, desarrollo y evaluación de agentes especializados. |
| 05 | Directorio Nacional | `projects/05-directorio-nacional/MANUAL.md` | Directorio digital de turismo, comercio, cultura y servicios de Chile. |
| 06 | SnowWise | `projects/06-snowwise/MANUAL.md` | Experiencia digital de montaña, nieve, clima y seguridad. |
| 07 | JoinHook Audio Player | `projects/07-audio-player/MANUAL.md` | Reproductor multimedia de escritorio. |
| 08 | JoinHook.cl | `projects/08-joinhook-web/MANUAL.md` | Sitio corporativo y presencia digital de JoinHook. |
| 09 | Marketing & Growth | `projects/09-marketing-growth/MANUAL.md` | Sistema de marketing, SEO/SEM, mercado y crecimiento. |
| 10 | CRM / Ventas | `projects/10-crm-ventas/MANUAL.md` | Gestión de leads, clientes y oportunidades comerciales. |
| 11 | Finance & Tax | `projects/11-finance-tax/MANUAL.md` | Gestión financiera, tesorería y procesos tributarios. |
| 12 | Legal & Compliance | `projects/12-legal-compliance/MANUAL.md` | Contratos, cumplimiento, privacidad y RRHH. |
| 13 | Agent Control Plane | `projects/13-agent-control-plane/MANUAL.md` | Gobierno, permisos, supervisión y trazabilidad de agentes. |
| 14 | Digital Assets Lab | `projects/14-digital-assets-lab/MANUAL.md` | Laboratorio aislado para activos digitales y experimentación. |
| 15 | Alianzas y Colaboración | `projects/15-alianzas/MANUAL.md` | Estructura para alianzas con instituciones y empresas. |
| 16 | Comunidad / Emprendimiento | `projects/16-comunidad-emprendimiento/MANUAL.md` | Programa de soluciones digitales accesibles y visibilidad. |
| 17 | Startup Validation / Agent Discovery | `projects/MANUAL-17-validation-agent-discovery.md` | Validación estructurada de ideas y oportunidades. |
| 18 | Turismo & Estacionalidad | `projects/MANUAL-18-investigacion-estacionalidad.md` | Investigación sobre gestión turística estacional. |
| 19 | Gestión y comunidades locales | `projects/MANUAL-19-comunidades-locales.md` | Investigación sobre modelos de administración y organización local. |
| 20 | Observatorio de mercado | `projects/MANUAL-20-observatorio-mercado.md` | Observación de tendencias, necesidades y oportunidades. |
| 21 | Cumbre Brava | `projects/MANUAL-21-cumbre-brava.md` | Videojuego independiente para PC y Android. |

## Estándar tecnológico comparativo

Cada manual incluye cuatro rutas tecnológicas posibles. **Ruby on Rails es obligatoria como una de las cuatro alternativas**, no como decisión automática.

1. **Ruby on Rails** — backend/producto full-stack con convención fuerte y desarrollo rápido.
2. **Next.js + TypeScript** — web/PWA moderna e interfaces ricas.
3. **Django + Python** — datos, automatización, APIs y lógica compleja.
4. **Laravel + PHP** — aplicaciones web y ecosistemas PHP/hosting tradicional.

La elección definitiva se realizará por proyecto según requisitos, coste, rendimiento, librerías, despliegue y mantenimiento.

## Estructura documental estándar

```text
projects/XX-nombre/
├── README.md                 # Identidad y resumen
├── MANUAL.md                 # Manual maestro de implementación
├── ARCHITECTURE.md           # Arquitectura técnica y límites
├── FILE-MAP.md               # Ubicación y función de cada archivo
├── DATA-MODEL.md             # Entidades, relaciones y datos
├── API.md                    # APIs, eventos e integraciones
├── SECURITY.md               # Seguridad, secretos, permisos y amenazas
├── TESTING.md                # Pruebas y criterios de aceptación
├── DEPLOYMENT.md             # Desarrollo, staging, producción y rollback
├── DECISIONS.md              # Decisiones técnicas
└── CHANGELOG.md              # Cambios relevantes
```

## Principios
- GitHub es la fuente de verdad del código y documentación versionada.
- Nunca guardar secretos, tokens, contraseñas o credenciales.
- Separar desarrollo, staging y producción.
- Documentar cada archivo nuevo en `FILE-MAP.md`.
- Justificar las tecnologías elegidas.
- Mantener límites claros entre productos y módulos.
- En Business OS, n8n sólo automatiza/orquesta y no es fuente de verdad.
- Cumbre Brava permanece separado conceptualmente de JoinHook.
