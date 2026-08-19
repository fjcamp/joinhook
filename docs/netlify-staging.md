# JoinHook V2 — staging en Netlify

Objetivo: desplegar `redesign-v2` en una URL HTTPS separada, sin modificar `main`, DNS ni `joinhook.cl` hasta aprobar el gate de publicación.

## Rama

```txt
redesign-v2
```

## Configuración del repositorio

`netlify.toml` define:

```toml
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20.20.2"
  NETLIFY_NEXT_SKEW_PROTECTION = "true"
```

No se fija manualmente `@netlify/plugin-nextjs`; Netlify debe aplicar automáticamente el adaptador OpenNext compatible con Next.js moderno.

## Habilitar branch deploy

En el proyecto de JoinHook en Netlify:

1. Abrir **Project configuration**.
2. Ir a **Build & deploy** / **Continuous Deployment**.
3. Abrir la configuración de **Branches and deploy contexts**.
4. En **Branch deploys**, habilitar ramas individuales.
5. Agregar `redesign-v2`.
6. Guardar.
7. Lanzar el deploy si Netlify no lo inicia automáticamente.

No cambiar la production branch durante esta prueba.

## Validar el build

En los logs del deploy comprobar:

- Node 20.20.2;
- `npm run build` exitoso;
- detección de Next.js;
- adaptación OpenNext aplicada por Netlify;
- ninguna dependencia del antiguo Stackbit/Visual Editor;
- deploy finalizado sin errores.

## Rutas mínimas a probar

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

También comprobar que estas rutas antiguas no publiquen el starter:

```txt
/info
/blog
/projects
```

Deben terminar en 404.

## QA visual

Revisar al menos:

- escritorio ancho;
- notebook;
- Android vertical;
- Android horizontal cuando sea razonable;
- navegación con teclado en escritorio;
- contraste y estados focus/hover/pressed.

## QA Control Gastronómico Express

1. Abrir beta en datos de ejemplo.
2. Crear espacio en blanco.
3. Agregar producto.
4. Definir stock mínimo y costo.
5. Registrar compra y comprobar aumento de stock.
6. Registrar merma y comprobar descuento.
7. Hacer ajuste manual y comprobar historial.
8. Agregar proveedor.
9. Revisar sugerencia de reposición.
10. Importar CSV de ejemplo.
11. Exportar inventario.
12. Descargar respaldo JSON.
13. Restaurar respaldo.
14. Instalar PWA si el navegador lo ofrece.
15. Recargar una vez conectado y luego probar sin internet.

## Seguridad en staging

Comprobar en navegador:

- CSP sin romper la interfaz;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `X-Frame-Options: SAMEORIGIN`;
- Permissions Policy;
- `X-Powered-By` ausente.

No activar HSTS desde el código hasta validar HTTPS de `joinhook.cl` y los subdominios que deban quedar cubiertos.

## Rendimiento

Ejecutar Lighthouse/Core Web Vitals sobre:

- Home;
- landing de CGE;
- aplicación CGE.

CI mantiene además un presupuesto interno del JavaScript cliente para detectar regresiones antes del deploy.

## Checkout

Durante staging puede permanecer deshabilitado. El fallback es solicitud por correo.

Para activarlo después se deben completar los requisitos descritos en:

```txt
docs/cge-checkout-config.md
```

No guardar secretos en variables `NEXT_PUBLIC_*`.

## Go / No-Go

El checklist autoritativo está en GitHub issue **#13 — Launch Gate**.

No fusionar PR #2 a `main` hasta completar los puntos de staging y producción definidos allí.
