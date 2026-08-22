# JoinHook — producción en BlueHosting/cPanel

Este runbook es la referencia operativa para publicar `joinhook.cl` desde el artifact validado de GitHub Actions.

## Arquitectura actual

- Dominio público: `https://joinhook.cl`
- Runtime Next.js/Passenger: `/home/joinhook/joinhook-production`
- Document root Apache/LiteSpeed: `/home/joinhook/public_html`
- Node.js: `20.20.2`
- Modo: `Production`
- Startup: `server.js`
- Log Passenger: `/home/joinhook/logs/production-passenger.log`
- Staging: `https://staging.joinhook.cl` → `/home/joinhook/staging-joinhook`

## Flujo autoritativo

```text
cambio de código
  ↓
rama + Pull Request
  ↓
GitHub Actions: audit + lint + build + Browser QA
  ↓
main
  ↓
Production Artifact
  ↓
joinhook-bluehosting-production
  ↓
BlueHosting Passenger + sincronización document root
  ↓
smoke test real
```

No ejecutar `next build` en BlueHosting: el hosting compartido ya mostró límites de memoria LVE/WASM.

## Contenido del artifact

El artifact de producción contiene dos piezas distintas:

1. **Runtime Passenger**: `server.js`, `.next`, `node_modules`, `public`, `package.json`, etc. Se instala en `/home/joinhook/joinhook-production`.
2. **Mirror para document root**: `document-root-assets/`. Se copia a `/home/joinhook/public_html` y contiene los assets públicos + `/_next/static` del **mismo build**.

Esto es obligatorio porque Passenger ejecuta Next.js fuera del document root y Apache/LiteSpeed debe poder resolver directamente los hashes de `/_next/static`.

## Despliegue

1. Confirmar CI verde para el commit objetivo.
2. Descargar `joinhook-bluehosting-production`.
3. Mantener un ZIP/copia del runtime anterior como rollback.
4. Reemplazar el contenido operativo de `/home/joinhook/joinhook-production` por el nuevo runtime del artifact.
5. Copiar el **contenido** de `document-root-assets/` dentro de `/home/joinhook/public_html/`.
6. No crear accidentalmente `_next/static/static`.
7. Reiniciar la aplicación `joinhook.cl` en Setup Node.js App.
8. Abrir `production-passenger.log`; Next.js debe quedar `Ready` sin crash.
9. Abrir `joinhook.cl` con recarga forzada.
10. En DevTools → Network verificar que una URL real `/_next/static/chunks/<hash>.js` responde `200`, no `404`/HTML.

## Smoke test mínimo

- `/`
- `/#proyectos`
- `/herramientas/control-gastronomico-express`
- `/app/control-gastronomico-express`
- `/privacidad`
- `/condiciones-beta`
- `/robots.txt`
- `/sitemap.xml`
- `/cge-manifest.webmanifest`
- `/project-covers/joinops-cover.svg`
- `/project-covers/snowwise-cover.svg`
- `/project-covers/mi-gestion-cover.svg`

Comprobar además:

- Home desktop y móvil.
- Carrusel de proyectos: flechas laterales en escritorio, controles compactos en móvil.
- Cambio JoinOps ↔ SnowWise ↔ Mi Gestión.
- Modo claro/oscuro.
- CTA de Control Gastronómico Express.
- Checkout Mercado Pago `https://mpago.li/1ZUHT1R`.
- PWA de CGE y continuidad offline.
- Headers de seguridad.

## Incidente conocido: HTML sin estilos

Si la Home carga contenido pero aparece sin diseño, consultar primero:

`docs/knowledge-base/incidents/JH-OPS-001-next-static-assets-bluehosting.md`

El patrón conocido es `/_next/static/...` → `404` con `Content-Type: text/html`. No recompilar ni reinstalar dependencias antes de verificar el mirror del document root.

## WordPress legado

Mientras exista necesidad de rollback, no eliminar de inmediato los archivos antiguos de WordPress en `public_html`. Una vez cerrada la validación y respaldado el sitio anterior:

- retirar el runtime/archivos WordPress que ya no sean necesarios;
- conservar el respaldo fuera de `public_html`;
- simplificar `.htaccess` sin tocar el bloque CloudLinux Passenger;
- revisar que ninguna regla WordPress intercepte rutas Next.js.

## Rollback

1. Conservar el runtime anterior de `joinhook-production`.
2. Conservar el mirror anterior de `_next/static` si se necesita reversión exacta.
3. Si el despliegue falla, restaurar runtime + document-root assets del mismo build.
4. Reiniciar Passenger.
5. Repetir smoke test.

Nunca mezclar runtime de un commit con `_next/static` de otro commit: los hashes deben corresponder al mismo build.