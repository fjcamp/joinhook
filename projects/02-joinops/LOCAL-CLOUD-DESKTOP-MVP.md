# JoinOps — estrategia local + nube para MVP

Fecha: 2026-09-11

## Decisión

JoinOps se implementará como una plataforma única con dos superficies:

1. **PWA/Web**: acceso desde navegador.
2. **Windows .exe**: instalador para operación local.

Ambas superficies consumen el mismo backend, contratos y modelo de datos.

## Principio operativo

`Usuario → JoinOps UI → API → PostgreSQL cloud`

Cuando la conectividad falla:

`Usuario → JoinOps UI → cola local → recuperación de red → replay idempotente → API → PostgreSQL`

La cola local no sustituye al sistema de registro cloud; es un mecanismo de continuidad operacional.

## Windows

El MVP usa Electron + NSIS para producir instalador `.exe`.

El shell no contiene credenciales de PostgreSQL. El backend cloud conserva las credenciales y ejecuta validación, tenant isolation, persistencia e identificación idempotente.

URL productiva objetivo del instalador: `https://joinops.joinhook.cl`.

Antes de liberar el instalador a usuarios finales se debe reemplazar/confirmar esta URL con el deployment productivo real.

## Seguridad

- Nunca empaquetar `DATABASE_URL`.
- Nunca usar `NEXT_PUBLIC_DATABASE_URL`.
- La identidad real deberá reemplazar el tenant demo antes de producción.
- El servidor valida tenant y producto.
- Las órdenes utilizan `idempotency_key`.
- Los eventos críticos generan Audit Ledger.
- El SII permanece fuera de producción hasta completar certificación y pruebas.

## MVP actualmente funcional

- Dashboard no-scroll.
- Catálogo de productos.
- POS básico.
- Carrito.
- Totalización CLP.
- Cobro lógico.
- Persistencia cloud cuando está configurada.
- Cola local cuando falla la red.
- Replay automático al recuperar conectividad.
- Auditoría de creación de venta.
- Shell Windows + pipeline de instalador.

## Antes de declarar estabilidad productiva

- Auth/RBAC real.
- Caja y Tesorería completas.
- Payment & Settlement Hub.
- Bodega, lotes, FEFO/FIFO e inventario ledger.
- Compras, recetas y producción.
- Migración y onboarding.
- Tax Core + SII certification.
- Backup/restore drills.
- Observabilidad y alertas.
- Pruebas automatizadas y pruebas de concurrencia.
- Instalador firmado y URL productiva definitiva.
