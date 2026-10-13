# Auditoría de snapshot cPanel — JoinHook
**Fecha de referencia:** 2026-10-13  
**Estado:** carpeta de auditoría preparada; el snapshot real aún no se ha cargado.

> **Aviso de privacidad:** el repositorio `fjcamp/joinhook` es público. No subas aquí una descarga completa de cPanel sin revisarla. Cualquier persona podría ver el contenido que publiques, incluso si luego lo borras del último commit: el historial de Git puede conservarlo.

## Objetivo
Documentar la estructura de archivos y las rutas necesarias para revisar el despliegue de JoinHook en BlueHosting, distinguiendo producción, staging, archivos públicos y aplicación Node/Passenger.

## Qué compartir primero
Priorizar archivos pequeños de configuración y listados de directorios, después de revisar y censurar cualquier secreto:

- `inventory-tree.txt`: árbol de directorios, sin contenidos privados.
- `routes-and-domains.md`: dominios, subdominios, raíces de aplicación y raíces públicas.
- `staging-htaccess.redacted.txt`: copia de texto de reglas de staging, con secretos/rutas privadas censurados si corresponde.
- `package.json`: solo si no contiene credenciales ni URLs privadas con tokens.
- `server.js`: revisar antes de publicarlo por rutas absolutas, tokens o datos sensibles.
- `DEPLOYMENT.txt`: revisar antes de publicarlo.
- Capturas de cPanel: recortar o difuminar usuario, correo, IDs de sesión, tokens, rutas privadas innecesarias y datos de cuenta.

## No subir
- Archivos `.env*`, claves privadas, certificados, tokens, contraseñas o credenciales.
- `wp-config.php`, archivos de configuración con credenciales, volcados SQL o respaldos de bases de datos.
- Directorios `node_modules/`, `.git/`, `.next/cache/`, logs completos, correos o datos de clientes.
- ZIP/TAR de toda la cuenta cPanel antes de inspeccionarlos.
- Cookies, URLs de sesión cPanel (`cpsess...`), credenciales del administrador o archivos de autenticación.
- Directorios personales, correo, registros de acceso o información de usuarios.

## Esquema recomendado para el inventario
No es necesario copiar aún todo el sitio. Documentar por separado:

```text
cpanel-snapshot/
├── README.md
├── inventory-tree.txt
├── routes-and-domains.md
├── production/
│   └── README.md
└── staging/
    ├── README.md
    └── staging-htaccess.redacted.txt
```

Estos nombres son solo una estructura de documentación. No se debe colocar aquí ningún secreto ni una copia íntegra de producción.

## Contexto de rutas previamente reportado
- Aplicación Node de producción: `/home/joinhook/joinhook-production` — protegida; no modificar.
- Raíz pública principal: `/home/joinhook/public_html` — contiene WordPress y recursos de producción; no sobrescribir.
- Aplicación de staging configurada en cPanel: `/home/joinhook/staging-joinhook` — última situación reportada: detenida.
- Artefacto PR49 extraído: `/home/joinhook/joinhook-pr49-staging-2026-10-12`.
- Respaldo independiente del artefacto: `/home/joinhook/joinhook-pr49-staging-backup-2026-10-12`.
- Raíz pública de staging: `/home/joinhook/public_html/staging.joinhook.cl`.
- Log Passenger de staging: `/home/joinhook/logs/staging-passenger.log`.

Estas rutas provienen de las comprobaciones compartidas en la conversación; el inventario real debe confirmar si siguen vigentes. No las uses como instrucciones para copiar o borrar archivos.

## Método seguro de trabajo
1. Descargar el snapshot a tu PC y conservar el original sin modificar como respaldo local.
2. Trabajar sobre una copia, nunca sobre el único respaldo.
3. Examinar nombres y tamaños; excluir secretos y datos personales.
4. Generar un árbol de directorios sin contenido sensible.
5. Revisar qué archivos pueden publicarse. Como este repositorio es público, si necesitas compartir código completo o configuración privada, crea primero un repositorio privado y verifica sus permisos.
6. Subir solo archivos aprobados, en una rama separada; no mezclar el snapshot con los archivos de producción ni desplegarlo desde esta rama.
7. Antes de cualquier actualización en BlueHosting, comparar las rutas y definir un plan de reversión.

## Estado de esta carpeta
No contiene todavía archivos descargados de cPanel. La carpeta sirve como guía y punto de partida; no demuestra que el snapshot se haya cargado ni que sus rutas hayan sido verificadas.
