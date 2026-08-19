# Control Gastronómico Express — activación de checkout

El checkout se mantiene deshabilitado por defecto. La landing usa solicitud por correo hasta que estén presentes **todos** los datos comerciales necesarios.

## Variables públicas requeridas en Netlify

- `NEXT_PUBLIC_CGE_CHECKOUT_ENABLED=true`
- `NEXT_PUBLIC_CGE_CHECKOUT_URL=https://...` — enlace de pago específico de Control Gastronómico Express.
- `NEXT_PUBLIC_SELLER_NAME=...` — nombre o razón social que corresponda al vendedor.
- `NEXT_PUBLIC_SELLER_RUT=...`
- `NEXT_PUBLIC_SELLER_EMAIL=...`
- `NEXT_PUBLIC_SELLER_ADDRESS=...`

## Reglas

1. No activar `NEXT_PUBLIC_CGE_CHECKOUT_ENABLED` hasta verificar datos del vendedor y condiciones electrónicas.
2. El enlace de pago debe ser específico de Control Gastronómico Express y usar HTTPS.
3. Estas variables son `NEXT_PUBLIC_*`: se muestran al navegador y **no deben contener secretos, tokens ni claves privadas**.
4. Si posteriormente se integra una API o webhook de pagos, sus credenciales deben permanecer server-side y nunca usar prefijo `NEXT_PUBLIC_`.
5. Tras cambiar variables de build en Netlify, generar un nuevo deploy y comprobar landing, condiciones y confirmación de compra.

Si falta cualquiera de los datos o la bandera está desactivada, la landing mantiene el fallback seguro: probar la beta y solicitar el pack fundador por correo, sin efectuar ningún cobro automático.
