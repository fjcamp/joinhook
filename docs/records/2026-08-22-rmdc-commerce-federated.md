# RMDC — 2026-08-22 — JoinHook Commerce y arquitectura federada

## Propósito
Registro de continuidad para retomar futuras conversaciones sin repetir decisiones ya aprobadas.

## Decisiones cerradas

1. Cada producto mantiene su propia base de datos.
2. JoinHook actúa como Control Plane/Portfolio layer y consume contratos/APIs/eventos con mínimo privilegio.
3. JoinHook Commerce es un servicio corporativo independiente reutilizable por SnowWise, JoinOps y futuros productos.
4. Revenue Intelligence y la Plataforma de Conocimiento Empresarial Regional tendrán almacenamiento separado.
5. n8n y agentes orquestan, pero no son fuente de verdad.
6. Mercado Pago Checkout API vía Orders + Card Payment Brick es la integración principal en desarrollo.
7. El Link de Pago actual permanece como fallback hasta completar sandbox y QA.
8. Ningún producto se entrega por una señal del navegador: el backend valida firma, consulta la orden y verifica monto, referencia y estado.
9. Los archivos digitales permanecen fuera de `public_html` y se entregan con entitlement + token hasheado, expirable y limitado.
10. Nombre comercial completo: **Control Gastronómico Express**; nombre corto: **Control Express**; código técnico: `JH-GASTRO-EXPRESS-FOUNDERS`. No introducir la sigla CGE como identificador nuevo.

## Desarrollo asociado

- PR #31: Commerce Core v1 — Mercado Pago Orders + entrega digital segura.
- Issue #30: Payments v2.
- Issue #32: Arquitectura federada — bases por producto + JoinHook Control Plane.
- `docs/commerce/schema.sql`.
- `docs/commerce/mercadopago-sandbox-setup.md`.
- `docs/architecture/federated-product-data.md`.
- `src/lib/control-plane/contracts.ts`.
- `src/lib/control-plane/registry.ts`.
- `src/lib/commerce/provider.ts`.
- `src/lib/commerce/domain-events.ts`.

## Autorización operativa vigente

El usuario autorizó continuar con gestión de desarrollo, documentación y respaldos de esta línea sin volver a pedir confirmación sobre decisiones ya aprobadas. Solo se solicita confirmación cuando sea obligatoria por seguridad, costos, credenciales, acciones irreversibles, requisitos legales o un dato externo imprescindible.

## Bloqueadores externos antes de READY

- base dedicada JoinHook Commerce;
- app/credenciales sandbox Mercado Pago;
- archivo digital privado definitivo;
- pruebas sandbox completas;
- correo transaccional/recuperación;
- refunds/claims/chargebacks/fraud → revocación;
- formalización tributaria antes de cobros productivos.

## Registro paralelo
Existe copia de continuidad en Google Drive dentro de `joinhook/Registro_Maestro_Gestion/Conversaciones_y_Decisiones/` con el título `RMDC-2026-08-22-JoinHook-Commerce-y-Arquitectura-Federada`.
