# Control Gastronómico Express — checkout Mercado Pago

El enlace oficial de pago para **Control Gastronómico Express** es:

- `https://mpago.li/1ZUHT1R`
- Precio de lanzamiento: **$4.990 CLP**
- Medio de pago: **Mercado Pago**

## Configuración de producción

El artifact de producción de JoinHook compila la landing con estas variables públicas:

- `NEXT_PUBLIC_CGE_CHECKOUT_ENABLED=true`
- `NEXT_PUBLIC_CGE_CHECKOUT_URL=https://mpago.li/1ZUHT1R`

La landing muestra el CTA **Comprar pack fundador · $4.990** y abre Mercado Pago en una pestaña nueva. El pipeline de producción verifica que tanto el CTA como el enlace oficial estén presentes en el HTML antes de publicar el artifact para BlueHosting.

## Datos públicos del vendedor

La landing admite además estos campos públicos cuando estén definidos:

- `NEXT_PUBLIC_SELLER_NAME=...`
- `NEXT_PUBLIC_SELLER_RUT=...`
- `NEXT_PUBLIC_SELLER_EMAIL=...`
- `NEXT_PUBLIC_SELLER_ADDRESS=...`

Estos datos siguen siendo recomendables para completar la información previa de contratación electrónica. Su ausencia ya no bloquea técnicamente la pasarela de Mercado Pago, pero debe resolverse antes de cerrar el checklist comercial/legal definitivo.

## Reglas

1. El enlace de pago debe seguir siendo específico de Control Gastronómico Express y usar HTTPS.
2. Las variables `NEXT_PUBLIC_*` se entregan al navegador y **no deben contener secretos, tokens ni claves privadas**.
3. Si posteriormente se integra la API o un webhook de Mercado Pago, las credenciales deben permanecer server-side y nunca usar prefijo `NEXT_PUBLIC_`.
4. Staging mantiene el checkout desactivado por defecto para evitar cobros accidentales durante QA.
5. Producción se compila mediante GitHub Actions como artifact standalone y luego se despliega en BlueHosting Passenger; no se debe ejecutar `next build` en el hosting compartido.
6. Después de cada cambio en la pasarela se debe validar CTA, precio, URL, condiciones y recorrido de compra en el dominio real.
