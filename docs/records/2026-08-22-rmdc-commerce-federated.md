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
11. La clave de idempotencia se genera y persiste antes del request al proveedor. Un mismo intento nunca cambia de clave.
12. Una falla ambigua de red/proveedor no autoriza un segundo pago: la orden queda en verificación hasta aclarar el estado.
13. Existe kill switch server-side independiente: `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false` bloquea nuevos cobros aunque el frontend se habilite por error.
14. El máximo de descargas se aplica por compra/entitlement y no puede reiniciarse generando tokens adicionales.
15. Los estados de Mercado Pago se interpretan por `status + status_detail`; solo `processed/accredited` habilita fulfillment automático.
16. Reembolsos parciales, reembolsos completos, contracargos y estados desconocidos suspenden o revocan la entrega. Un estado local de disputa/revisión no se reactiva automáticamente por un Webhook genérico posterior.
17. Reclamos, contracargos y alertas de fraude se reciben en un endpoint opcional separado para no confundir sus resource IDs con Order IDs.

## Desarrollo asociado

- PR #31: Commerce Core v1 — Mercado Pago Orders + entrega digital segura.
- Issue #30: Payments v2.
- Issue #32: Arquitectura federada — bases por producto + JoinHook Control Plane.
- `docs/commerce/schema.sql`.
- `docs/commerce/mercadopago-sandbox-setup.md`.
- `docs/commerce/provisioning-status.md`.
- `docs/architecture/federated-product-data.md`.
- `src/lib/control-plane/contracts.ts`.
- `src/lib/control-plane/registry.ts`.
- `src/lib/commerce/provider.ts`.
- `src/lib/commerce/domain-events.ts`.

## Hardening ejecutado

- Retry único para errores transitorios de Mercado Pago con la **misma** `X-Idempotency-Key`.
- Rechazo definitivo y resultado ambiguo se tratan de forma distinta.
- Estado `verification_pending` protege al comprador ante respuestas inciertas y le indica que no repita el pago.
- Webhook principal acotado al tópico Order y persistencia mínima de metadata; no se guarda el body completo por defecto.
- Endpoint opcional separado para `topic_claims_integration_wh`, `topic_chargebacks_wh` y `stop_delivery_op_wh`.
- Alertas opcionales que incluyen `payment_id` se correlacionan con la orden local sin reinterpretar IDs de claims/chargebacks como Orders.
- Alertas de fraude/contracargos correlacionadas colocan el acceso en hold/revocación antes de una nueva descarga.
- `/mi-compra` vuelve a consultar el estado autoritativo de la Order antes de emitir un nuevo token, por lo que puede detectar cambios postventa.
- Estados locales `review`, `partially_refunded`, `refunded` y `charged_back` son holds pegajosos y no se reactivan automáticamente.
- Preview de token antes de consumir descarga para no gastar allowance cuando el archivo privado falta o no se puede abrir.
- Consumo atómico del allowance tanto a nivel token como entitlement.
- Auditoría de IP solo con HMAC y sal privada; si la sal no existe, no se guarda hash de IP.
- Catálogo central es la fuente de verdad del precio mostrado en checkout y del monto validado por backend.
- Claim de compra almacenado como cookie HttpOnly/SameSite en vez de `sessionStorage`/`localStorage`.
- RPCs `SECURITY DEFINER` revocados para `PUBLIC`, `anon` y `authenticated`; solo `service_role` puede ejecutarlos.
- Tablas Commerce con RLS, privilegios de cliente revocados y políticas explícitas `false` para roles de navegador.

## Base dedicada JoinHook Commerce — provisionada

El 22 de agosto de 2026 se confirmó el costo informado por Supabase de **$0 mensual** y se creó un proyecto independiente **JoinHook Commerce** dentro de la organización existente, sin compartir base ni credenciales con SnowWise.

- Región elegida: `sa-east-1`, por cercanía geográfica con Chile dentro de las regiones disponibles del conector.
- Estado al crear: `ACTIVE_HEALTHY`.
- Migraciones iniciales: `commerce_core_v1`, `harden_commerce_api_privileges`, `index_commerce_foreign_keys`, `explicitly_deny_commerce_client_access`.
- Migraciones posteriores: expansión de estados de Order e índice único parcial por `provider_payment_id` para correlación de eventos postventa.
- Estados normalizados actuales: `pending`, `paid`, `review`, `failed`, `refunded`, `partially_refunded`, `cancelled`, `charged_back`.
- Security Advisor quedó sin hallazgos después del hardening inicial.
- Performance Advisor solo informó índices aún no utilizados, comportamiento esperado en una base recién creada sin tráfico.
- La URL/credenciales reales no se documentan en este repositorio público; los secretos permanecen fuera de GitHub.

## QA de base ejecutado

Se ejecutó una prueba sintética de atomicidad de descarga: preview 2 usos → consume 1 → consume 0 → tercer consumo sin filas, verificando que tanto el token como el entitlement acumulan el límite global correcto. Los datos sintéticos fueron eliminados. Resultado: `commerce_download_atomicity_ok`.

## Autorización operativa vigente

El usuario autorizó continuar con gestión de desarrollo, documentación y respaldos de esta línea sin volver a pedir confirmación sobre decisiones ya aprobadas. Solo se solicita confirmación cuando sea obligatoria por seguridad, costos, credenciales, acciones irreversibles, requisitos legales o un dato externo imprescindible.

## Bloqueadores externos antes de READY

- app/credenciales sandbox Mercado Pago;
- secreto server-side de la base Commerce para conectar el runtime de JoinHook;
- archivo digital privado definitivo;
- pruebas sandbox completas de pagos y Webhooks;
- correo transaccional/recuperación;
- automatización completa del flujo de devolución/cancelación ante fraude, una vez verificada en sandbox;
- formalización tributaria antes de cobros productivos.

## Registro paralelo
Existe copia de continuidad en Google Drive dentro de `joinhook/Registro_Maestro_Gestion/Conversaciones_y_Decisiones/` con el título `RMDC-2026-08-22-JoinHook-Commerce-y-Arquitectura-Federada`.
