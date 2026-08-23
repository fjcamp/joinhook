# JH-OPS-003 — Mercado Pago Webhook configurado antes de desplegar Commerce runtime

## Estado

Mitigado en código; pendiente de despliegue del artefacto Commerce a BlueHosting.

## Síntoma

Después de configurar en Mercado Pago la URL de pruebas:

`https://joinhook.cl/api/commerce/mercadopago/webhook`

una navegación directa a esa URL respondió con la página 404 personalizada de JoinHook.

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

Así no existen dos implementaciones de firma/idempotencia y la URL ya registrada en Mercado Pago queda soportada sin pedir al operador que cambie la configuración.

Commerce Routing CI ahora verifica que ambas rutas resuelvan al handler POST-only y respondan `405` ante GET en vez de `404`.

## Criterio de verificación después del despliegue

1. Desplegar el artefacto de la rama Commerce en `/home/joinhook/joinhook-production`.
2. Sincronizar los assets del mismo build en `/home/joinhook/public_html` cuando corresponda.
3. Reiniciar Passenger.
4. Abrir `https://joinhook.cl/api/commerce/mercadopago/webhook`.
5. Esperar `405 Method Not Allowed` (GET no es válido), nunca la página 404 del sitio.
6. Solo después ejecutar una simulación Webhook desde Mercado Pago.
7. Mantener `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false` hasta iniciar la matriz de sandbox deliberadamente.

## Prevención

- Las URLs registradas con proveedores externos deben formar parte de Commerce Routing CI.
- No probar Webhooks de proveedor contra producción antes de confirmar que el deployment contiene la ruta.
- Mantener aliases cuando una URL externa ya fue registrada y cambiarla implicaría riesgo operacional innecesario.
