# JoinHook V2 — staging en BlueHosting/cPanel

Objetivo: desplegar `redesign-v2` en `https://staging.joinhook.cl` dentro de BlueHosting, sin modificar `main` ni el sitio actual de `joinhook.cl` hasta aprobar el gate de publicación.

## Infraestructura confirmada

- Hosting: BlueHosting con cPanel.
- Dominio principal actual: `joinhook.cl` → `/public_html`.
- Staging creado: `staging.joinhook.cl` → `/public_html/staging.joinhook.cl`.
- Setup Node.js App disponible mediante CloudLinux/Passenger.
- Node.js disponible: `20.20.2`.
- Modo de aplicación: `Production`.
- Application root: `staging-joinhook` (fuera de `public_html`).
- Application URL: `staging.joinhook.cl` sin subruta.
- Startup file: `server.js`.

## Decisión de despliegue

El build de Next.js 16.3/Turbopack agotó la memoria disponible dentro de los límites LVE de BlueHosting (`WebAssembly.instantiate(): Out of memory`). Por ello BlueHosting no se usará como máquina de compilación.

Flujo autoritativo:

```txt
redesign-v2
   ↓
GitHub Actions
   ↓
npm ci + lint + audit + next build
   ↓
Next.js output: standalone
   ↓
smoke test del paquete standalone
   ↓
artifact: joinhook-bluehosting-standalone
   ↓
BlueHosting / Passenger
   ↓
staging.joinhook.cl
```

**No ejecutar `npm run build` en BlueHosting.**

## Artefacto validado

El pipeline `Redesign CI` generó y probó correctamente un artefacto standalone de staging en el commit:

```txt
6d58ec435ae337ddd8b9b897463338d5441f85b8
```

Artifact GitHub Actions:

```txt
joinhook-bluehosting-standalone
```

Artifact ID:

```txt
9397901543
```

Tamaño aproximado comprimido por GitHub Actions: 26,1 MB.

Digest informado por GitHub Actions:

```txt
sha256:cd1c400afc3370afe98db0347f86c14f70301203a2e26ae3cf75f5865f3ad57b
```

El artifact fue descargado y verificado adicionalmente fuera del runner: contiene `.next/`, `server.js`, `package.json`, `node_modules/` y `public/`; se inició con Node.js en modo production, respondió HTTP 200 y entregó CSP, headers de seguridad y `X-Robots-Tag: noindex, nofollow, noarchive`.

## Separación de producción

La aplicación Node se mantiene fuera de `public_html`:

```txt
/home/joinhook/
├── staging-joinhook/            # runtime de JoinHook V2
└── public_html/
    ├── ... sitio actual ...     # joinhook.cl actual
    └── staging.joinhook.cl/     # document root asignado al subdominio
```

No copiar ni sustituir archivos del sitio actual durante staging.

## Configuración de Setup Node.js App

La aplicación debe permanecer configurada con:

```txt
Node.js version:        20.20.2
Application mode:       Production
Application root:       staging-joinhook
Application URL:        staging.joinhook.cl
Application URL path:   vacío
Application startup:    server.js
```

No agregar secretos ni credenciales públicas durante la prueba inicial.

## Artefacto de GitHub Actions

`next.config.js` utiliza:

```js
output: 'standalone'
```

El job `build` de `.github/workflows/redesign-ci.yml`:

1. instala dependencias con `npm ci`;
2. ejecuta auditorías y lint;
3. compila Next.js;
4. valida PWA y presupuesto JS;
5. ejecuta smoke tests del build normal;
6. prepara `deploy-bluehosting/` a partir de `.next/standalone`;
7. copia `.next/static` y `public`;
8. ejecuta el `server.js` standalone en un puerto temporal y vuelve a probar Home, CGE, manifest, CSP y no-indexación de staging;
9. publica el artefacto `joinhook-bluehosting-standalone` con archivos ocultos incluidos para conservar `.next/`.

El artefacto contiene el runtime mínimo ya compilado, incluyendo `server.js`, `package.json`, dependencias trazadas de producción, `.next/static` y `public`.

## Despliegue manual del artefacto en cPanel

Una vez que el CI del commit objetivo esté completamente verde:

1. descargar el artefacto `joinhook-bluehosting-standalone` del run correspondiente;
2. subir el ZIP a `/home/joinhook/staging-joinhook`;
3. conservar temporalmente una copia/ZIP del runtime anterior para rollback;
4. extraer el artefacto en una carpeta temporal dentro del staging;
5. mover su contenido al root `/home/joinhook/staging-joinhook`;
6. confirmar que existen directamente:

```txt
/home/joinhook/staging-joinhook/server.js
/home/joinhook/staging-joinhook/package.json
/home/joinhook/staging-joinhook/.next/
/home/joinhook/staging-joinhook/node_modules/
/home/joinhook/staging-joinhook/public/
```

7. no ejecutar `NPM Install` ni `npm run build` si el artefacto ya contiene el runtime standalone validado;
8. volver a **Setup Node.js App** y pulsar **Restart** / **Restart Application**;
9. abrir `https://staging.joinhook.cl`.

## SSL / HTTPS

El subdominio puede tardar en recibir AutoSSL después de crearse.

Antes de activar **Force HTTPS Redirect**:

1. comprobar que `https://staging.joinhook.cl` presenta un certificado válido;
2. verificar que el certificado incluye `staging.joinhook.cl`;
3. solo entonces activar redirección HTTPS para staging si se desea.

No cambiar la política HTTPS del dominio principal como parte de esta prueba.

## Rutas mínimas a comprobar

```txt
/
/herramientas/control-gastronomico-express
/app/control-gastronomico-express
/privacidad
/condiciones-beta
/cge-manifest.webmanifest
/app/cge-sw.js
/icons/cge-icon-192.png
/icons/cge-icon-512.png
/plantillas/control-gastronomico-inventario.csv
```

Rutas antiguas que deben continuar en 404:

```txt
/info
/blog
/projects
/blog/post-one
/projects/project-one
```

## QA de Control Gastronómico Express

1. Primer inicio y onboarding.
2. Crear proveedor.
3. Crear producto.
4. Registrar compra.
5. Registrar merma.
6. Ajustar stock con trazabilidad.
7. Ver sugerencias de reposición.
8. Importar CSV.
9. Exportar inventario CSV.
10. Descargar respaldo JSON.
11. Intentar restaurar un JSON inválido y comprobar que no reemplaza los datos.
12. Restaurar un respaldo válido.
13. Recargar y confirmar persistencia local.
14. Probar escritorio y móvil.
15. Instalar PWA si el navegador lo ofrece.
16. Probar continuidad offline después de una carga conectada.

## Seguridad

Comprobar en la respuesta real de BlueHosting:

- `Content-Security-Policy`;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Frame-Options: SAMEORIGIN`;
- `Permissions-Policy`;
- `X-Robots-Tag: noindex, nofollow, noarchive` en staging;
- ausencia de `X-Powered-By`.

No activar HSTS hasta validar producción y los subdominios que deban quedar incluidos.

## Staging y SEO

El build de staging se genera con `JOINHOOK_DEPLOY_TARGET=staging`; `next.config.js` añade `X-Robots-Tag: noindex, nofollow, noarchive` a todas las respuestas. El pipeline verifica este header tanto en el build normal como en el runtime standalone.

El artefacto de producción no debe compilarse con ese target.

## Checkout

Durante staging el checkout permanece deshabilitado y usa el fallback de solicitud por correo.

Antes de habilitar compra real deben confirmarse:

- identidad/datos públicos del vendedor;
- enlace de pago real;
- correo de soporte/entrega;
- condiciones comerciales;
- variables públicas necesarias sin guardar secretos en `NEXT_PUBLIC_*`.

Las variables `NEXT_PUBLIC_*` que cambien el contenido generado deben existir en GitHub Actions **antes de compilar el artefacto comercial**, porque quedan embebidas en el build. No guardar secretos en ellas.

## Actualizaciones futuras

```txt
ChatGPT / desarrollo
      ↓
redesign-v2
      ↓
GitHub Actions verde
      ↓
artifact standalone validado
      ↓
reemplazo controlado del runtime de staging
      ↓
Restart Passenger
      ↓
QA staging
```

No compilar en BlueHosting salvo que soporte confirme un aumento suficiente de recursos y exista una razón concreta para cambiar este flujo.

## Rollback

Antes de cada reemplazo:

- conservar ZIP/copia del runtime anterior de staging;
- conservar el SHA del commit y el artifact que se está desplegando;
- no borrar la versión anterior hasta completar smoke test del nuevo runtime.

Antes de sustituir `joinhook.cl`:

- conservar copia completa del sitio actual;
- conservar la referencia Git del staging aprobado;
- no borrar la versión anterior hasta completar smoke test post-publicación.

El checklist autoritativo continúa en GitHub issue **#13 — Launch Gate**.
