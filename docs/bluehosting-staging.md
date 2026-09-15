# JoinHook Web — staging en BlueHosting/cPanel

Objetivo: desplegar la versión institucional actual de JoinHook Web en `https://staging.joinhook.cl` dentro de BlueHosting, sin modificar producción `https://joinhook.cl` hasta completar el gate de publicación.

## Estado y alcance

Este documento reemplaza las referencias históricas a `redesign-v2`. El estado vigente se controla desde `main` y Pull Requests, con GitHub como fuente de verdad.

- Sitio público: `https://joinhook.cl`.
- Staging: `https://staging.joinhook.cl`.
- Hosting: BlueHosting con cPanel / CloudLinux / Passenger.
- Node.js validado para runtime: `20.20.2`.
- Application root de staging: `staging-joinhook` fuera de `public_html`.
- Startup file: `server.js`.
- No se depende de terminal/SSH en cPanel.
- No se despliega automáticamente a producción desde este flujo.

## Flujo autoritativo

```txt
cambio en rama
   ↓
Pull Request
   ↓
GitHub Actions
   ↓
npm ci + audit + lint + next build
   ↓
smoke tests + seguridad + PWA + presupuesto JS
   ↓
artefacto standalone
   ↓
BlueHosting / Passenger
   ↓
staging.joinhook.cl
   ↓
QA manual
   ↓
gate de publicación
```

**No ejecutar `next build` ni `npm run build` en BlueHosting.** El build se realiza en GitHub Actions y se despliega el artefacto ya validado.

## Separación de producción

La aplicación de staging se mantiene fuera del document root de producción:

```txt
/home/joinhook/
├── staging-joinhook/            # runtime Node/Passenger de staging
└── public_html/                 # document root de producción
```

Nunca copiar archivos de staging sobre el sitio de `joinhook.cl` durante esta fase.

## Configuración de Passenger

Usar como referencia:

```txt
Node.js version:     20.20.2
Application mode:   Production
Application root:   staging-joinhook
Application URL:    staging.joinhook.cl
URL path:           vacío
Startup file:       server.js
```

Las credenciales y secretos deben permanecer en configuración segura del entorno. No almacenar secretos en el repositorio ni en variables `NEXT_PUBLIC_*`.

## Artefacto de GitHub Actions

La configuración de Next.js utiliza `output: 'standalone'`.

El pipeline actual genera un paquete apto para BlueHosting que contiene el runtime compilado, incluyendo:

- `server.js`;
- `package.json`;
- `.next/` y `.next/static/`;
- dependencias de runtime trazadas por Next.js;
- `public/`.

Solo debe desplegarse un artefacto cuyo run de GitHub Actions esté completamente verde.

## Despliegue manual en cPanel

1. Descargar desde GitHub Actions el artefacto `joinhook-bluehosting-standalone` correspondiente al commit aprobado.
2. Conservar una copia del runtime de staging actualmente operativo para rollback.
3. Subir el ZIP al espacio de trabajo del staging mediante File Manager.
4. Extraerlo en una carpeta temporal.
5. Reemplazar controladamente el contenido de `/home/joinhook/staging-joinhook` con el contenido del artefacto.
6. Confirmar que existen directamente:

```txt
/home/joinhook/staging-joinhook/server.js
/home/joinhook/staging-joinhook/package.json
/home/joinhook/staging-joinhook/.next/
/home/joinhook/staging-joinhook/node_modules/
/home/joinhook/staging-joinhook/public/
```

7. No ejecutar instalación de dependencias ni build local cuando el artefacto ya trae el runtime validado.
8. Reiniciar la aplicación desde **Setup Node.js App / Passenger**.
9. Ejecutar el smoke test de staging y completar el QA manual.

## Smoke test y rutas mínimas

La prueba debe cubrir como mínimo:

```txt
/
/info
/blog
/herramientas/control-gastronomico-express
/app/control-gastronomico-express
/privacidad
/condiciones-beta
/robots.txt
/sitemap.xml
/cge-manifest.webmanifest
/app/cge-sw.js
/project-covers/joinops-cover.svg
/project-covers/snowwise-cover.svg
/project-covers/mi-gestion-cover.svg
```

Las rutas heredadas que hayan sido retiradas deben conservar el comportamiento 404 definido por el CI actual.

## Seguridad de staging

En la respuesta real de staging comprobar:

- `Content-Security-Policy` con baseline restrictivo;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy` configurada;
- `X-Frame-Options: SAMEORIGIN`;
- `Permissions-Policy` configurada;
- `X-Robots-Tag: noindex, nofollow, noarchive`;
- ausencia de `X-Powered-By`.

Staging no debe quedar indexable por buscadores.

No activar HSTS como parte de esta prueba hasta validar la arquitectura completa de dominios y subdominios de producción.

## SEO

El sitemap actual debe contener al menos las rutas públicas institucionales vigentes:

```txt
https://joinhook.cl/
https://joinhook.cl/info
https://joinhook.cl/blog
https://joinhook.cl/herramientas/control-gastronomico-express
```

La zona `/app/` no forma parte de la superficie SEO pública.

## Control Gastronómico Express — QA funcional

El QA de staging debe recorrer:

1. onboarding inicial;
2. creación de proveedor;
3. creación de producto;
4. registro de compra;
5. registro de merma;
6. ajuste de stock con trazabilidad;
7. sugerencias de reposición;
8. importación de CSV;
9. exportación de inventario;
10. descarga de respaldo JSON;
11. rechazo de respaldo JSON inválido sin reemplazar el estado actual;
12. restauración de respaldo válido;
13. persistencia al recargar;
14. funcionamiento desktop y móvil;
15. instalación PWA cuando el navegador la ofrezca;
16. continuidad offline después de una carga conectada.

Durante staging el checkout comercial debe permanecer en modo seguro/QA y no debe habilitar pagos reales.

## Checkout y publicación comercial

Antes de activar cualquier compra real deben verificarse explícitamente:

- identidad pública del vendedor;
- datos comerciales y de soporte;
- enlace de pago real;
- condiciones de venta y entrega;
- variables públicas requeridas por el build;
- ausencia de secretos en variables expuestas al cliente.

Un build con datos QA no debe promocionarse a producción como build comercial.

## Rollback

Antes de cada despliegue:

- conservar ZIP/copia del runtime anterior;
- conservar SHA del commit desplegado;
- conservar la referencia del artefacto de GitHub Actions;
- no eliminar la versión anterior hasta completar smoke test post-restart.

Para rollback, restaurar el runtime anterior y reiniciar Passenger. La recuperación debe quedar asociada al SHA/artifact restaurado.

## Gate de publicación

Staging aprobado no equivale a producción aprobada.

La publicación de `joinhook.cl` requiere:

```txt
CI verde
   ↓
staging desplegado
   ↓
smoke test verde
   ↓
QA funcional y visual
   ↓
revisión de seguridad/SEO
   ↓
backup de producción
   ↓
publicación controlada
   ↓
smoke test post-publicación
```

Hasta completar ese flujo, `joinhook.cl` se considera pendiente de verificación externa.
