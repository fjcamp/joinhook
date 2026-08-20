# JoinHook V2 — staging en BlueHosting/cPanel

Objetivo: desplegar `redesign-v2` en `https://staging.joinhook.cl` dentro de BlueHosting, sin modificar `main` ni el sitio actual de `joinhook.cl` hasta aprobar el gate de publicación.

## Infraestructura confirmada

- Hosting: BlueHosting con cPanel.
- Dominio principal actual: `joinhook.cl` → `/public_html`.
- Staging creado: `staging.joinhook.cl` → `/public_html/staging.joinhook.cl`.
- Setup Node.js App disponible mediante CloudLinux/Passenger.
- Node.js disponible: `20.20.2`.
- Modo de aplicación: `Production`.
- Application root recomendado: `staging-joinhook` (fuera de `public_html`).
- Application URL: `staging.joinhook.cl` sin subruta.
- Startup file: `server.js`.

## Separación de producción

La aplicación Node se mantiene fuera de `public_html`:

```txt
/home/joinhook/
├── staging-joinhook/            # código y runtime de JoinHook V2
└── public_html/
    ├── ... sitio actual ...     # joinhook.cl actual
    └── staging.joinhook.cl/     # document root asignado al subdominio
```

No copiar ni sustituir archivos del sitio actual durante staging.

## Configuración de Setup Node.js App

Crear la aplicación con:

```txt
Node.js version:        20.20.2
Application mode:       Production
Application root:       staging-joinhook
Application URL:        staging.joinhook.cl
Application URL path:   vacío
Application startup:    server.js
```

No agregar secretos ni credenciales públicas durante la creación inicial.

## Entry point de Passenger

El repositorio incluye `server.js`, que:

- usa `NODE_ENV=production` en cPanel;
- escucha `process.env.PORT` entregado por Passenger;
- escucha en `0.0.0.0` salvo que `HOST` indique otra cosa;
- prepara Next.js 16.3 y delega todas las solicitudes al request handler de Next.

También existe:

```bash
npm run start:passenger
```

para pruebas controladas del mismo entrypoint.

## Obtener el código

Fuente autoritativa de staging:

```txt
Repositorio: fjcamp/joinhook
Rama: redesign-v2
```

Preferir Git Version Control de cPanel o SSH/Git si está disponible. No usar `main` para staging.

El contenido del repositorio debe quedar directamente en:

```txt
/home/joinhook/staging-joinhook
```

De modo que existan, entre otros:

```txt
/home/joinhook/staging-joinhook/package.json
/home/joinhook/staging-joinhook/server.js
/home/joinhook/staging-joinhook/next.config.js
/home/joinhook/staging-joinhook/src/
/home/joinhook/staging-joinhook/public/
```

## Instalación y build

Con Node 20.20.2 activo para la aplicación:

```bash
npm ci
npm run build
```

No ejecutar `npm install` indiscriminadamente en producción si `package-lock.json` está disponible; `npm ci` conserva la resolución validada por CI.

El build debe generar `.next/` sin errores.

## Arranque / reinicio

Passenger usa `server.js` como startup file. Después del build:

1. volver a **Setup Node.js App**;
2. abrir la aplicación `staging.joinhook.cl`;
3. usar **Restart** / **Restart Application**;
4. esperar unos segundos;
5. abrir `https://staging.joinhook.cl`.

Si cPanel proporciona `Run JS script`, no es necesario mantener un proceso manual permanente; Passenger administra el proceso de la aplicación.

## SSL / HTTPS

El subdominio puede tardar unos minutos en recibir AutoSSL después de crearse.

Antes de activar **Force HTTPS Redirect**:

1. comprobar que `https://staging.joinhook.cl` presenta un certificado válido;
2. verificar que el certificado incluye `staging.joinhook.cl`;
3. solo entonces activar redirección HTTPS para el staging si se desea.

No cambiar todavía la política HTTPS del dominio principal como parte de esta prueba.

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
- ausencia de `X-Powered-By`.

No activar HSTS hasta validar producción y los subdominios que deban quedar incluidos.

## Staging y SEO

El staging no debe competir con `joinhook.cl` en buscadores. Durante la prueba debe mantenerse fuera de indexación mediante configuración de robots/meta apropiada o protección de acceso si se decide añadirla.

## Checkout

Durante staging el checkout puede permanecer deshabilitado y usar el fallback de solicitud por correo.

Antes de habilitar compra real deben confirmarse:

- identidad/datos públicos del vendedor;
- enlace de pago real;
- correo de soporte/entrega;
- condiciones comerciales;
- variables públicas necesarias sin guardar secretos en `NEXT_PUBLIC_*`.

## Actualizaciones futuras del staging

Flujo recomendado:

```txt
ChatGPT / desarrollo
      ↓
redesign-v2
      ↓
GitHub Actions verde
      ↓
actualizar código en /home/joinhook/staging-joinhook
      ↓
npm ci (solo si cambian dependencias)
npm run build
      ↓
Restart Passenger
      ↓
QA staging
```

## Rollback

Antes de sustituir `joinhook.cl`:

- conservar copia completa del sitio actual;
- conservar la referencia Git del último staging aprobado;
- no borrar la versión anterior hasta completar smoke test post-publicación.

El checklist autoritativo continúa en GitHub issue **#13 — Launch Gate**.
