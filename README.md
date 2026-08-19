# JoinHook

JoinHook es mi espacio independiente para investigar, diseñar y construir productos digitales, sistemas de gestión, PWA y experimentos de interfaz.

Detrás del proyecto estoy yo, **Francisco Javier Campos**. No intento presentar JoinHook como una gran compañía: el objetivo es mostrar trabajo real, proyectos en construcción, aprendizajes y herramientas que puedan resolver problemas concretos.

## Estado

La nueva versión del sitio se desarrolla en la rama `redesign-v2` y todavía no se fusiona a `main` hasta completar staging y el gate de publicación.

Proyecto principal en lanzamiento:

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

## Otros proyectos visibles en JoinHook

- **JoinOps** — sistema modular de gestión y operaciones en desarrollo.
- **SnowWise** — experiencia digital para montaña, clima y seguridad.
- **Mi Gestión** — exploración de organización, indicadores y procesos administrativos.

Los estados de los proyectos se muestran de forma explícita; estar en desarrollo, prototipo o beta es parte de la información del proyecto.

## Stack actual

- Next.js 16.3
- React 19
- TypeScript
- Tailwind CSS 4
- PWA / Service Worker para Control Gastronómico Express
- GitHub como fuente de verdad
- Netlify preparado para despliegue mediante OpenNext

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

`netlify.toml` mantiene únicamente la configuración necesaria para el build de Next.js. El proyecto deja que Netlify aplique automáticamente su adaptador OpenNext actual.

El primer despliegue de validación debe realizarse desde la rama:

```txt
redesign-v2
```

sin reemplazar producción hasta terminar las pruebas.

## Documentación de lanzamiento

- `docs/cge-launch-kit-v1.md` — estrategia orgánica, guiones y primera semana de contenidos.
- `docs/cge-checkout-config.md` — requisitos para habilitar el checkout de forma segura.
- Issue **#13** — checklist GO/NO-GO para staging, producción y primeras ventas.

## Contacto

Para conversaciones relacionadas con JoinHook o Control Gastronómico Express:

`info@joinhook.cl`

---

**JoinHook es un proyecto independiente en evolución.** La prioridad es construir, probar con usuarios reales y mejorar antes de agregar complejidad innecesaria.
