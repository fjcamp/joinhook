# JH-OPS-003 — Mercado Pago Webhook configurado antes de desplegar Commerce runtime

## Estado

Mitigado en código; pendiente de despliegue del artefacto Commerce a BlueHosting.

## Síntoma

Después de configurar en Mercado Pago la URL de pruebas inicial:

`https://joinhook.cl/api/commerce/mercadopago/webhook`

una navegación directa respondió con la página 404 personalizada de JoinHook.

## Diagnóstico

El dominio y Passenger estaban operativos. El 404 confirmó que la versión desplegada de `joinhook-production` aún no contenía el runtime del PR de JoinHook Commerce.

Además se detectó una diferencia de ruta entre la URL ya registrada en Mercado Pago y el primer handler desarrollado internamente:

- URL registrada: `/api/commerce/mercadopago/webhook`
- handler original: `/api/commerce/webhooks/mercadopago`

## Corrección aplicada en código

Se agregó un alias explícito:

`src/pages/api/commerce/mercadopago/webhook.ts`

que reutiliza el mismo handler autoritativo de:

`src/pages/api/commerce/webhooks/mercadopago.ts`

Así no existen dos implementaciones de firma/idempotencia y la URL ya registrada queda soportada.

Commerce Routing CI verifica que ambas rutas resuelvan al handler POST-only y respondan `405` ante GET en vez de `404`.

## Canonicalización importante: slash final

JoinHook usa `trailingSlash: true`. La forma sin slash devuelve `308` hacia la forma canónica. Para no depender de cómo un proveedor externo trate redirects de un POST, la URL que debe quedar registrada en Mercado Pago es exactamente:

`https://joinhook.cl/api/commerce/mercadopago/webhook/`

El handler interno canónico también queda disponible en:

`https://joinhook.cl/api/commerce/webhooks/mercadopago/`

**Regla:** proveedores externos deben recibir directamente la URL canónica con slash final; no se debe confiar en un `308` para Webhooks POST.

## Criterio de verificación después del despliegue

1. Confirmar que el artifact corresponde al SHA exacto aprobado y validar `SHA256SUMS.txt`.
2. Respaldar runtime, `document-root-assets`/assets activos y `.htaccess` antes de sustituir producción.
3. Desplegar el runtime en `/home/joinhook/joinhook-production`.
4. Sincronizar `document-root-assets/` del mismo build en `/home/joinhook/public_html/` para no repetir JH-OPS-001.
5. Confirmar que `.htaccess` conserva Passenger y que no reapareció el rewrite WordPress de JH-OPS-002.
6. Reiniciar Passenger.
7. Abrir `https://joinhook.cl/api/commerce/mercadopago/webhook/` con GET.
8. Esperar `405 Method Not Allowed`, nunca `404` ni `308`.
9. Confirmar `/api/commerce/health/` → `200`.
10. Mantener `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false` y probar que create-order continúe bloqueado antes del sandbox deliberado.
11. Solo después ejecutar una simulación Webhook desde Mercado Pago.

## Prevención

- Las URLs registradas con proveedores externos forman parte de Commerce Routing CI.
- No probar Webhooks contra producción antes de confirmar que el deployment contiene la ruta.
- Mantener alias cuando una URL externa ya fue registrada y cambiarla implicaría riesgo operacional innecesario.
- Registrar siempre la variante canónica con slash final cuando `trailingSlash: true`.
- Un deployment de Commerce no se considera completo hasta validar runtime + assets + routing + kill switch.
