# Control Gastronómico Express — configuración de checkout

El checkout de **Control Gastronómico Express** está preparado para una pasarela externa, pero **permanece desactivado por defecto** hasta que exista una decisión explícita de lanzamiento comercial.

## Estado actual

- Precio de lanzamiento definido en la landing: **$4.990 CLP**.
- Medio de pago previsto: **Mercado Pago**.
- Staging y producción quedan sin cobro automático mientras no se active el switch comercial.
- El repositorio no almacena una URL de checkout real como configuración activa.

## Configuración de producción

El workflow `.github/workflows/production-artifact.yml` lee:

- `CGE_CHECKOUT_ENABLED` desde **GitHub Repository Variables**; el valor por defecto es `false`.
- `CGE_CHECKOUT_URL` desde **GitHub Actions Secrets**.

Esas variables se entregan al build como:

- `NEXT_PUBLIC_CGE_CHECKOUT_ENABLED`
- `NEXT_PUBLIC_CGE_CHECKOUT_URL`

Para activar el checkout se deben cumplir ambas condiciones:

1. `CGE_CHECKOUT_ENABLED=true` mediante una decisión comercial explícita.
2. `CGE_CHECKOUT_URL` debe existir y comenzar por `https://`.

Con el switch desactivado, la landing muestra **Solicitar pack fundador** y no ejecuta ningún cobro automático.

Con el switch activado, la landing puede mostrar **Comprar pack fundador** y abrir la URL externa configurada.

## Datos públicos del vendedor

La landing admite además estos campos públicos cuando estén definidos:

- `NEXT_PUBLIC_SELLER_NAME=...`
- `NEXT_PUBLIC_SELLER_RUT=...`
- `NEXT_PUBLIC_SELLER_EMAIL=...`
- `NEXT_PUBLIC_SELLER_ADDRESS=...`

Estos valores no deben contener credenciales ni secretos privados. Antes de activar una pasarela real debe existir revisión comercial y legal de la información que se mostrará al comprador.

## Reglas

1. Staging mantiene el checkout desactivado para evitar cobros accidentales durante QA.
2. No guardar tokens, claves privadas ni credenciales bajo variables `NEXT_PUBLIC_*`.
3. Una URL de checkout real debe llegar por configuración protegida y usar HTTPS.
4. Si posteriormente se integra API, webhooks o credenciales de la pasarela, los secretos deben permanecer server-side.
5. Cada activación comercial debe validar CTA, precio, moneda, URL, condiciones, datos del vendedor y recorrido de compra antes de publicar.
6. La producción se compila como artifact mediante GitHub Actions y se despliega en BlueHosting Passenger; no se ejecuta `next build` en el hosting compartido.
7. La activación del checkout no equivale a aprobación de producción: siguen siendo obligatorios backup, staging, smoke, QA visual/funcional y gate de publicación.
