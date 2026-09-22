# JoinHook

JoinHook es mi espacio independiente para investigar, diseñar y construir productos digitales, sistemas de gestión, PWA y experimentos de interfaz.

## Catálogo maestro y documentación

El repositorio incorpora ahora un catálogo documental para que desarrolladores, colaboradores y sistemas distintos de ChatGPT puedan comprender los proyectos sin depender de conversaciones previas:

- `PROJECTS.md` — catálogo maestro de proyectos, estructura y tecnologías candidatas.
- `docs/PROJECT-DOCUMENTATION-STANDARD.md` — estándar obligatorio para documentar implementación.
- `projects/` — manuales individuales y mapas conceptuales de cada proyecto.

Cada proyecto debe documentar propósito, estado, arquitectura, tecnologías candidatas, ubicación de archivos, datos, APIs, seguridad, pruebas, despliegue y decisiones técnicas antes de considerarse correctamente documentado.

## Estado actual del sitio

La nueva versión del sitio se desarrolla en la rama `redesign-v2` y todavía no se fusiona a `main` hasta completar staging y el gate de publicación.

## Proyecto principal en lanzamiento

### Estado de Gastos Operacionales — Beta 0.3

Herramienta local-first para pequeños negocios gastronómicos que necesitan ordenar inventario, compras, mermas, proveedores, ajustes trazables, reposición, importación/exportación CSV y respaldo/restauración JSON.

La beta guarda los datos operativos en el navegador del dispositivo. No utiliza todavía cuentas, sincronización cloud ni una base de datos de JoinHook.

## Proyectos visibles

- JoinOps — gestión y operaciones modular.
- SnowWise — montaña, clima y seguridad.
- Mi Gestión — organización e indicadores administrativos.
- JoinHook Business OS — plataforma central federada.
- Directorio Nacional — turismo, comercio, cultura y servicios.
- JoinHook Audio Player — reproductor multimedia.
- Cumbre Brava — videojuego independiente y separado de JoinHook.

Los estados de los proyectos deben mantenerse explícitos.

## Stack actual del sitio

- Next.js 16.3
- React 19
- TypeScript
- Tailwind CSS 4
- PWA / Service Worker para Estado de Gastos Operacionales
- GitHub como fuente de verdad
- Netlify preparado para despliegue mediante OpenNext

## Desarrollo local

Requisitos recomendados: Node.js 20.20.2 y npm.

```bash
npm ci
npm run dev
```

Abrir `http://localhost:3000`.

Build:

```bash
npm run build
npm run start
```

## Flujo de ramas

```text
feature / release branch
        ↓
    redesign-v2
        ↓
      staging
        ↓
       main
        ↓
   joinhook.cl
```

No reemplazar producción sin staging, backup y validación.

## Seguridad

No guardar tokens, claves privadas, contraseñas ni credenciales en GitHub. No utilizar `NEXT_PUBLIC_*` para secretos.

## Contacto

`info@joinhook.cl`

---

**JoinHook es un proyecto independiente en evolución.** La prioridad es construir, probar con usuarios reales y mejorar antes de agregar complejidad innecesaria.

## AI Collaboration & Continuity
This repository is prepared for multi-AI development. GitHub is the technical source of truth; Notion is the operational index; Google Drive stores originals/heavy binaries when applicable. Before changing code, read [docs/AI_HANDOFF.md](docs/AI_HANDOFF.md) and the newest checkpoint in [docs/checkpoints](docs/checkpoints/). Progress must be evidenced as DESIGNED → IMPLEMENTED → VERIFIED → BETA → PRODUCTION. CI failures are first-class blockers. NO EVIDENCE = NO CLAIM.

**Learning gate:** representative workflows must be demonstrated, including expected-success and controlled-negative scenarios, before end-user exposure.
