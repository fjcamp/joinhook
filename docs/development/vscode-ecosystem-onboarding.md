# JoinHook — guía de trabajo y aprendizaje en Visual Studio Code

Esta guía está pensada para revisar el código real de JoinHook y SnowWise sin tocar producción accidentalmente.

## 1. Repositorios

### JoinHook

Repositorio: `fjcamp/joinhook`

- `main`: base actualmente publicada/estable.
- `feat/commerce-core-mercadopago`: desarrollo actual de Commerce Core, Mercado Pago, Control Plane y documentación de despliegue.

### SnowWise

Repositorio: `fjcamp/snowwise`

- `main`: base estable del proyecto.
- `feat/pwa-subdomain-foundation`: PWA, `snowwise.joinhook.cl`, clima/GPS, checklist, recordatorios y hardening actual.

## 2. Regla principal

**No aprender editando directamente `main`.**

Para revisar y practicar:

1. sincronizar `main`;
2. cambiar a la rama de desarrollo correspondiente;
3. usar el panel Source Control de VS Code para ver cada diff;
4. antes de modificar, confirmar la rama visible en la esquina inferior de VS Code;
5. cualquier cambio útil se hace por rama + PR + CI.

## 3. Estructura de JoinHook

### `src/pages/`

Rutas web de Next.js Pages Router.

Ejemplos:

- `src/pages/index.tsx` → `https://joinhook.cl/`
- `src/pages/privacidad.tsx` → `/privacidad`
- `src/pages/herramientas/control-gastronomico-express.tsx` → página comercial de Control Express
- `src/pages/checkout/control-gastronomico-express.tsx` → checkout Commerce en la rama actual
- `src/pages/api/commerce/...` → endpoints Commerce
- `src/pages/api/internal/control-plane/...` → contratos privados de Control Plane

Regla mental: en Pages Router, la estructura de archivo suele reflejar la URL.

### `src/lib/commerce/`

Lógica de negocio de Commerce. No es UI.

Aquí revisar:

- configuración server-side;
- catálogo/producto;
- órdenes;
- integración Mercado Pago;
- fulfillment;
- recovery;
- tokens/descarga;
- event log.

### `src/lib/control-plane/`

Contratos y autorización para observación federada entre productos.

### `src/components/`

Componentes reutilizables de interfaz.

### `src/css/`

Estilos visuales principales de JoinHook.

### `.github/workflows/`

Automatización CI/CD. Antes de confiar en un deploy revisar siempre qué workflow produjo el artifact.

### `docs/`

Bitácora, arquitectura, runbooks, incidentes, Commerce y decisiones.

Prioridad de lectura:

1. `docs/bluehosting-production.md`
2. `docs/commerce/manual-bluehosting-commerce-deploy.md`
3. `docs/knowledge-base/incidents/`
4. `docs/architecture/federated-product-data.md`
5. `docs/records/`

## 4. Estructura de SnowWise

### `apps/web/app/`

Aplicación web/PWA actual.

Ejemplos:

- `page.tsx` → entrada de la PWA
- `home-dashboard.tsx` → Home principal
- `weather-here/` → clima por GPS solicitado por el usuario
- `api/conditions/` → meteorología de destinos
- `api/live-conditions/` → frontera no-cache para GPS preciso
- `checklist/` → checklist de salida
- `trip-reminder-center.tsx` → recordatorios de preparación de salida
- `pwa-runtime-manager.tsx` → actualización/offline/service worker

### `apps/web/public/`

Manifest, iconos, service worker y recursos que deben estar disponibles directamente.

### `apps/web/tests/`

Pruebas automáticas de PWA, privacidad, checklist, clima y recordatorios.

### `supabase/migrations/`

Historial de cambios de la base SnowWise. No editar una migración ya aplicada para fingir que nunca ocurrió; los cambios nuevos se agregan como migraciones nuevas.

### `.github/workflows/`

Web CI y despliegues Cloudflare Preview/producción.

### `docs/product/`

Decisiones de experiencia/producto. Para la nueva Home leer `home-departure-brief-2026-08-24.md`.

## 5. Cómo leer una función sin perderse

Usar este orden:

1. identificar la ruta o pantalla que ves;
2. abrir el archivo de entrada;
3. usar `Ctrl+Click` sobre imports para seguir componentes/lógica;
4. usar `Ctrl+Shift+F` para buscar nombres de funciones, variables o textos visibles;
5. abrir Source Control para ver qué cambió en la rama actual;
6. revisar los tests relacionados para entender qué comportamiento se considera obligatorio.

## 6. Extensiones útiles sin costo

No es necesario instalar muchas extensiones. Prioridad:

- GitHub Pull Requests and Issues (Microsoft/GitHub)
- ESLint
- Prettier (si el repo lo usa en el flujo)

VS Code ya incluye Git, búsqueda, terminal y diff. Evitar instalar extensiones desconocidas que pidan acceso amplio al repositorio o credenciales.

## 7. Comandos seguros de lectura/sincronización

Desde la carpeta de un repo:

```powershell
git status
git branch --show-current
git fetch origin
git log --oneline --decorate -10
```

Para actualizar `main` sin crear cambios locales:

```powershell
git switch main
git pull --ff-only origin main
```

Para revisar la rama actual de Commerce:

```powershell
git fetch origin
git switch feat/commerce-core-mercadopago
git pull --ff-only origin feat/commerce-core-mercadopago
```

Para SnowWise:

```powershell
git fetch origin
git switch feat/pwa-subdomain-foundation
git pull --ff-only origin feat/pwa-subdomain-foundation
```

Si `git status` muestra modificaciones que el usuario no reconoce, **no ejecutar `reset --hard` ni borrar archivos**. Revisar primero el diff.

## 8. Secretos

Nunca copiar a VS Code/repo por comodidad:

- Access Tokens Mercado Pago;
- Supabase Secret keys;
- Webhook secrets;
- llaves SSH privadas;
- passwords cPanel;
- `.env` productivos.

Los `.env.example` sirven para conocer nombres de variables; los valores reales permanecen en los proveedores/runtime correspondientes.

## 9. Primer recorrido de aprendizaje recomendado

### Sesión A — cómo una URL se vuelve código

1. abrir `src/pages/index.tsx` de JoinHook;
2. localizar un texto visible de la Home;
3. revisar su CSS;
4. abrir una tarjeta de proyecto;
5. buscar el mismo nombre con `Ctrl+Shift+F`.

### Sesión B — cómo funciona una API

1. abrir `/api/commerce/health`;
2. comparar método GET y respuesta JSON;
3. revisar Commerce Routing CI;
4. entender por qué un Webhook GET debe devolver 405.

### Sesión C — PWA SnowWise

1. abrir `apps/web/app/layout.tsx`;
2. seguir `PwaRuntimeManager`;
3. abrir `public/sw.js`;
4. revisar `manifest.ts`;
5. abrir `/weather-here` y sus tests de privacidad.

### Sesión D — feature completa

Usar Recordatorios SnowWise:

1. `trip-reminder-center.tsx` — lógica;
2. `trip-reminder-center.module.css` — presentación;
3. `trip-reminders.test.mjs` — garantías automáticas;
4. Issue #12 — objetivo de producto;
5. PR #10 — evidencia de integración y CI.

Así cada feature puede estudiarse como:

`necesidad → Issue → código → tests → CI → PR → deploy → bitácora`.

## 10. Cuando se sincronice el equipo

La primera comprobación debe ser:

- Git disponible;
- GitHub autenticado mediante navegador/VS Code, sin pegar tokens en el chat;
- rutas locales claras;
- repos actualizados;
- ramas correctas;
- Node/npm compatibles antes de ejecutar builds.

Después se puede crear un workspace multi-root local para abrir JoinHook + SnowWise al mismo tiempo, sin fusionar los repositorios ni sus historiales Git.
