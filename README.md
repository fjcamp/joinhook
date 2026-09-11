# JoinHook

JoinHook es una iniciativa tecnológica chilena orientada al diseño, desarrollo y evolución de soluciones digitales, sistemas de gestión, automatización y productos propios para resolver necesidades concretas de organizaciones y personas.

JoinHook combina investigación, diseño, desarrollo y validación práctica, manteniendo una comunicación rigurosa y transparente sobre el estado real de cada producto. **Francisco Javier Campos** lidera la iniciativa.

## Estado de JoinHook V2

La nueva versión del sitio se desarrolla en la rama `redesign-v2` y todavía no se fusiona a `main` hasta completar staging y el gate de publicación.

JoinHook V2 funcionará como sitio corporativo y puerta de entrada al ecosistema de productos y soluciones de JoinHook. Los productos mantienen sus propios límites técnicos y ciclos de desarrollo cuando corresponde.

## Productos y proyectos destacados

### JoinOps

Sistema modular de gestión y operaciones, actualmente prioridad estratégica para la postulación a concurso. Su arquitectura contempla módulos interconectados para organizaciones con distintas áreas y servicios, incluyendo operaciones gastronómicas con cafetería, heladería, pastelería y otros servicios.

### Control Gastronómico Express — Beta 0.3

Herramienta local-first para pequeños negocios gastronómicos que necesitan ordenar:

- inventario y stock mínimo;
- compras y entradas de mercadería;
- mermas y sus causas;
- proveedores;
- ajustes trazables de inventario;
- sugerencias simples de reposición;
- importación/exportación CSV;
- respaldo y restauración JSON;
- uso como PWA y continuidad local.

La beta guarda los datos operativos en el navegador del dispositivo. No utiliza todavía cuentas, sincronización cloud ni una base de datos de JoinHook.

### Otros proyectos visibles

- **SnowWise** — experiencia digital para montaña, clima y seguridad.
- **Mi Gestión** — solución orientada a organización, indicadores y procesos administrativos.

Los estados de los proyectos se muestran de forma explícita; estar en desarrollo, prototipo o beta forma parte de la información del proyecto.

## Stack actual

- Next.js 16.3
- React 19
- TypeScript
- Tailwind CSS 4
- PWA / Service Worker para Control Gastronómico Express
- GitHub como fuente de verdad
- Despliegue preparado mediante artefactos de producción y adaptadores configurados en el repositorio

## Desarrollo local

Requisitos recomendados:

- Node.js 20.20.2
- npm

```bash
npm ci
npm run dev
```

Abrir después:

```txt
http://localhost:3000
```

Build de producción:

```bash
npm run build
npm run start
```

## Rutas principales

```txt
/                                           JoinHook V2
/herramientas/control-gastronomico-express  Landing comercial
/app/control-gastronomico-express           Aplicación Beta 0.3
/privacidad                                 Política de privacidad
/condiciones-beta                           Condiciones de la beta
```

El contenido ficticio del starter anterior (`/info`, `/blog`, `/projects` y ejemplos) está despublicado y sus rutas responden 404.

## Calidad y seguridad

El pipeline de CI de `redesign-v2` comprueba actualmente:

- auditoría completa de dependencias;
- auditoría de dependencias runtime;
- ESLint;
- build de Next.js;
- presupuesto interno de JavaScript cliente;
- arranque real del servidor;
- smoke tests de rutas públicas y activos PWA;
- rutas heredadas despublicadas;
- headers base y Content-Security-Policy.

El proyecto mantiene el checkout de Control Gastronómico Express **deshabilitado por defecto**. Un enlace de pago solo puede activarse cuando están configurados de forma explícita el enlace HTTPS y los datos públicos del vendedor. No se deben guardar tokens, claves privadas ni credenciales de pagos en variables `NEXT_PUBLIC_*` ni en el repositorio.

## Flujo de ramas

```txt
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

`main` no debe recibir el rediseño hasta aprobar staging en escritorio/móvil, PWA/offline, seguridad, rendimiento y flujo comercial.

## Despliegue

El repositorio mantiene la configuración necesaria para generar y validar artefactos de producción. El despliegue definitivo se realizará únicamente después de completar la validación de staging y el gate de publicación.

El primer despliegue de validación debe realizarse desde la rama:

```txt
redesign-v2
```

sin reemplazar producción hasta terminar las pruebas.

## Documentación de lanzamiento

- `docs/cge-launch-kit-v1.md` — estrategia orgánica, guiones y primera semana de contenidos.
- `docs/cge-checkout-config.md` — requisitos para habilitar el checkout de forma segura.
- `docs/decision-log/joinhook-v2-audit-2026-09-11.md` — auditoría, decisiones y plan de acción de JoinHook V2.
- Issue **#13** — checklist GO/NO-GO para staging, producción y primeras ventas.

## Contacto

Para conversaciones relacionadas con JoinHook o sus productos:

`info@joinhook.cl`

---

**JoinHook mantiene una evolución documentada y verificable.** Cada solución debe avanzar mediante diseño, implementación, pruebas y validación antes de pasar a producción.
