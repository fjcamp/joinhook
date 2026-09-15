# JoinHook

JoinHook es mi espacio independiente para investigar, diseñar y construir productos digitales, sistemas de gestión, PWA y experimentos de interfaz.

## Catálogo maestro y documentación

El repositorio incorpora un catálogo documental para que desarrolladores, colaboradores y sistemas distintos de ChatGPT puedan comprender los proyectos sin depender de conversaciones previas:

- `PROJECTS.md` — catálogo maestro de proyectos, estructura y tecnologías candidatas.
- `docs/PROJECT-DOCUMENTATION-STANDARD.md` — estándar obligatorio para documentar implementación.
- `projects/` — manuales individuales y mapas conceptuales de cada proyecto.

Cada proyecto debe documentar propósito, estado, arquitectura, tecnologías candidatas, ubicación de archivos, datos, APIs, seguridad, pruebas, despliegue y decisiones técnicas antes de considerarse correctamente documentado.

## Estado actual del sitio

La versión institucional **Web V1** ya fue integrada en `main` mediante PR #46, con merge commit `a29e433e7e5315424b9f264b6adc19d04f9370dc`.

El siguiente ciclo es de consolidación: CI verde, staging real en BlueHosting, validación post-despliegue, corrección de detalles detectados y evolución incremental mediante ramas de feature. El sitio de producción `joinhook.cl` no debe considerarse actualizado hasta verificar un despliegue real.

## Proyecto principal en lanzamiento

### Control Gastronómico Express — Beta 0.3

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

- Next.js 16.3.x
- React 19
- TypeScript
- Tailwind CSS 4
- PWA / Service Worker para Control Gastronómico Express
- GitHub como fuente de verdad
- BlueHosting + Passenger para el despliegue objetivo

El artefacto de despliegue se genera y valida en GitHub Actions como build **standalone**. No depende de terminal/SSH en cPanel y no se debe ejecutar `next build` dentro de BlueHosting.

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

## Validación de staging

Con el sitio ya publicado en el subdominio de staging, el smoke test reutilizable se ejecuta desde un entorno con Node.js:

```bash
STAGING_URL=https://staging.joinhook.cl npm run smoke:staging
```

La prueba comprueba las rutas críticas institucionales/CGE, assets públicos y varios headers de seguridad, además de verificar que el sitemap contenga las entradas públicas principales. No sustituye el QA visual ni el checklist funcional de Control Gastronómico Express.

## Flujo de ramas

```text
feature/*
   ↓
Pull Request → main
   ↓
CI + QA
   ↓
staging real en BlueHosting
   ↓
validación / rollback disponible
   ↓
producción joinhook.cl
```

No reemplazar producción sin staging, backup y validación.

## Seguridad

No guardar tokens, claves privadas, contraseñas ni credenciales en GitHub. No utilizar `NEXT_PUBLIC_*` para secretos.

## Contacto

`info@joinhook.cl`

---

**JoinHook es un proyecto independiente en evolución.** La prioridad es construir, probar con usuarios reales y mejorar antes de agregar complejidad innecesaria.
