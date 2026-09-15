# JoinHook — producción en BlueHosting/cPanel

Este runbook es la referencia operativa para publicar `joinhook.cl` desde un artifact validado de GitHub Actions.

> **Estado de verificación:** este documento describe el procedimiento y la arquitectura objetivo. No constituye evidencia de que la versión actual ya esté desplegada en producción. El despliegue real debe registrarse con fecha, commit y smoke test posterior.

## Arquitectura objetivo

- Dominio público: `https://joinhook.cl`
- Runtime Next.js/Passenger: `/home/joinhook/joinhook-production`
- Document root Apache/LiteSpeed: `/home/joinhook/public_html`
- Node.js: `20.20.2`
- Startup: `server.js`
- Staging: `https://staging.joinhook.cl` → `/home/joinhook/staging-joinhook`

## Flujo autoritativo

```text
cambio de código
  ↓
rama + Pull Request
  ↓
GitHub Actions: audit + lint + build + smoke/QA
  ↓
main
  ↓
artifact reproducible
  ↓
staging BlueHosting
  ↓
smoke test real + revisión visual
  ↓
gate de publicación
  ↓
producción joinhook.cl
  ↓
smoke test real + registro del despliegue
```

No ejecutar `next build` en BlueHosting. El build debe producirse en GitHub Actions y el hosting debe recibir el runtime preparado.

## Contenido del artifact

El artifact debe conservar el runtime Passenger y, cuando la infraestructura lo requiera, los assets estáticos correspondientes al mismo build.

1. **Runtime Passenger**: `server.js`, `.next`, `node_modules`, `public`, `package.json`, etc.
2. **Assets del document root**: solo cuando la configuración vigente de BlueHosting los necesite, copiando los archivos del mismo artifact y evitando mezclar hashes entre builds.

## Despliegue

1. Confirmar CI verde para el commit objetivo.
2. Descargar el artifact asociado al commit.
3. Mantener una copia/ZIP del runtime anterior para rollback.
4. Subir el nuevo runtime mediante las herramientas disponibles de BlueHosting/cPanel.
5. Mantener alineados runtime y assets `/_next/static` del mismo build.
6. Configurar/revisar Passenger con `server.js` y el entorno correspondiente.
7. Reiniciar la aplicación desde la interfaz disponible del hosting.
8. Revisar el log de Passenger y confirmar estado `Ready` sin crash.
9. Ejecutar el smoke test de rutas públicas y recursos estáticos.
10. Ejecutar revisión visual desktop/móvil.
11. Registrar commit, fecha, resultado y eventual rollback.

## Smoke test mínimo

- `/`
- `/info`
- `/blog`
- `/herramientas/control-gastronomico-express`
- `/app/control-gastronomico-express`
- `/privacidad`
- `/condiciones-beta`
- `/robots.txt`
- `/sitemap.xml`
- `/cge-manifest.webmanifest`
- `/app/cge-sw.js`
- `/project-covers/joinops-cover.svg`
- `/project-covers/snowwise-cover.svg`
- `/project-covers/mi-gestion-cover.svg`

Comprobar además:

- Home desktop y móvil.
- Navegación principal y enlaces internos.
- Cambio JoinOps ↔ SnowWise ↔ Mi Gestión.
- Modo claro/oscuro.
- CTA de Control Gastronómico Express.
- PWA de CGE y continuidad offline.
- Headers de seguridad.
- Canonical, robots y sitemap.
- Recursos `/_next/static/...` respondiendo con `200` y contenido JavaScript, nunca HTML de error.

## Incidente conocido: HTML sin estilos

Si la Home carga contenido pero aparece sin diseño, consultar:

`docs/knowledge-base/incidents/JH-OPS-001-next-static-assets-bluehosting.md`

El patrón conocido es `/_next/static/...` → `404` con `Content-Type: text/html`. Antes de reinstalar o recompilar, verificar que runtime y assets estáticos provengan del mismo artifact.

## WordPress legado

Mientras exista necesidad de rollback, conservar los archivos antiguos de WordPress fuera de riesgo. Cualquier limpieza debe hacerse después de validar el nuevo runtime y guardar respaldo independiente.

## Rollback

1. Restaurar el runtime anterior completo.
2. Restaurar los assets estáticos correspondientes al mismo build anterior.
3. Reiniciar Passenger.
4. Repetir smoke test.
5. Registrar el incidente y la causa en la base de conocimiento.

Nunca mezclar runtime de un commit con `/_next/static` de otro commit: los hashes deben corresponder al mismo build.
