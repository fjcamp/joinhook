# Bitácora técnica y base de conocimiento — JoinHook

Este directorio conserva incidentes reales, diagnósticos, soluciones verificadas y procedimientos operativos de JoinHook. Su objetivo es evitar repetir investigación ya realizada y convertir cada problema resuelto en conocimiento reutilizable.

## Convención

Cada incidente debe registrar: fecha, entorno, síntomas, evidencia, causa raíz, intentos que no resolvieron el problema, solución validada, verificación y etiquetas.

Antes de proponer una solución para un problema de despliegue o infraestructura de JoinHook, revisar primero esta bitácora y buscar por síntomas y etiquetas.

## Índice

| ID | Fecha | Área | Incidente | Estado | Etiquetas |
|---|---|---|---|---|---|
| JH-OPS-001 | 2026-08-21 | Deploy / BlueHosting | Next.js carga HTML pero CSS/JS de `/_next/static` responden 404 | Resuelto | `nextjs`, `cpanel`, `passenger`, `apache`, `bluehosting`, `static-assets`, `404`, `wordpress`, `production`, `staging` |
| JH-OPS-002 | 2026-08-22 | Routing / BlueHosting | WordPress intercepta rutas internas de Next.js y devuelve su 404 legado | Diagnóstico confirmado | `routing`, `wordpress`, `nextjs`, `passenger`, `rewrite`, `404`, `production`, `cge` |

## Memoria de conversaciones y decisiones

La Bitácora Técnica se complementa con el **Registro Maestro de Decisiones y Conversaciones (RMDC)**:

`docs/records/README.md`

- RMDC: contexto, solicitudes, decisiones, trabajo realizado, evidencias y pendientes.
- Bitácora: incidentes técnicos reutilizables, causa raíz y solución.
- Runbooks: procedimiento operativo repetible.

Cuando una conversación produce un fallo técnico, el registro RMDC debe enlazar el incidente correspondiente de esta Bitácora.

## Taxonomía sugerida

- `deploy`: publicación, staging y producción.
- `hosting`: cPanel, Apache/LiteSpeed, Passenger, CloudLinux.
- `nextjs`: build, standalone, `.next`, assets.
- `routing`: document root, rewrites, rutas públicas.
- `payments`: Mercado Pago y checkout.
- `security`: permisos, secretos, autenticación y hardening.
- `data`: bases de datos, migraciones y respaldos.
- `frontend`: UI, CSS, imágenes y comportamiento del navegador.
- `documentation`: RMDC, runbooks, decisiones y evidencia.

La documentación de un incidente no reemplaza la configuración fuente ni la automatización: cuando una solución sea repetible, debe convertirse después en checklist o script de despliegue.