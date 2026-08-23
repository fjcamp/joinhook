# JoinHook Commerce — despliegue sandbox en BlueHosting

## Objetivo

Desplegar el runtime de la rama Commerce en `joinhook.cl` para probar Webhooks y Checkout API de Mercado Pago sin activar cobros productivos ni perder el Link de Pago actual como fallback.

## Estado previo requerido

- `JoinHook Commerce` Supabase saludable.
- Mercado Pago aplicación TEST creada con Checkout API + Orders.
- Public Key TEST, Access Token TEST y Webhook Secret configurados directamente en cPanel.
- `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS` ausente o `false`.
- Webhook de prueba registrado en Mercado Pago como:
  `https://joinhook.cl/api/commerce/mercadopago/webhook`
- No enviar secretos a GitHub, ChatGPT, documentación o capturas públicas.

## Artefacto correcto

Usar el workflow **Commerce Sandbox Artifact** de la rama/PR Commerce.

Nombre del artefacto:

`joinhook-commerce-sandbox-productionlike`

Este paquete está diseñado específicamente para probar Commerce sobre el dominio productivo sin cambiar todavía al checkout embebido por defecto. Incluye:

- Next.js standalone runtime;
- handler `POST /api/commerce/mercadopago/webhook`;
- alias interno `/api/commerce/webhooks/mercadopago`;
- `/api/commerce/public-config` con configuración runtime;
- recuperación de compra;
- `document-root-assets/` con los assets exactos del mismo build;
- Link de Pago externo renderizado como fallback.

## Destinos BlueHosting

Runtime Passenger:

`/home/joinhook/joinhook-production`

Document root Apache/LiteSpeed:

`/home/joinhook/public_html`

No ejecutar `next build` en BlueHosting.

## Procedimiento manual seguro

1. Descargar el artefacto generado por GitHub Actions.
2. Respaldar el runtime actual antes de reemplazarlo.
3. Extraer el contenido del runtime en `/home/joinhook/joinhook-production` conservando la estructura `.next`, `node_modules`, `server.js`, `package.json` y `public` del artefacto.
4. Copiar los **contenidos** de `document-root-assets/` a `/home/joinhook/public_html/`.
5. No copiar `document-root-assets/_next/static` como `_next/static/static`; el destino final debe ser `/home/joinhook/public_html/_next/static/...`.
6. Mantener la configuración Passenger existente en `.htaccess`; no reintroducir el antiguo bloque de rewrite WordPress.
7. Reiniciar la aplicación Node/Passenger desde cPanel.
8. Verificar home, CSS/JS y assets públicos.

## Gate inmediato del Webhook

Abrir en navegador:

`https://joinhook.cl/api/commerce/mercadopago/webhook`

Resultado esperado por GET:

`405 Method Not Allowed`

Un `404` significa que el runtime desplegado no contiene Commerce o que el routing no llegó a Passenger.

Después del 405:

1. enviar simulación Webhook `Order` desde Mercado Pago;
2. firma inválida debe devolver `401`;
3. una firma válida con Order desconocida debe fallar de forma controlada y quedar registrada según el escenario de sandbox;
4. no habilitar `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=true` hasta iniciar expresamente las pruebas de pago.

## Configuración runtime pendiente para pago/fulfillment

Antes de crear una compra sandbox real también deben existir directamente en cPanel:

- `JOINHOOK_DOWNLOAD_TOKEN_SECRET` — secreto aleatorio de alta entropía;
- `JOINHOOK_DOWNLOAD_IP_HASH_SALT` — sal privada opcional/recomendada;
- `JOINHOOK_GASTRO_EXPRESS_PRIVATE_FILE` — ruta absoluta al paquete privado;
- `JOINHOOK_COMMERCE_CHECKOUT_ENABLED=true` solo durante el tramo de prueba deliberado;
- `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=true` solo para ejecutar tarjetas/cuentas TEST y volver a `false` al finalizar la sesión de QA.

## Recuperación de compra

La base y el código ya soportan recuperación de compra, pero para hacerla operativa faltan secretos/canal externo:

- `JOINHOOK_RECOVERY_TOKEN_SECRET`;
- `JOINHOOK_TRANSACTIONAL_EMAIL_WEBHOOK_URL`;
- `JOINHOOK_TRANSACTIONAL_EMAIL_WEBHOOK_SECRET`.

El adapter acepta un endpoint HTTPS privado, por ejemplo un flujo n8n autorizado que envíe el correo mediante el canal transaccional elegido. n8n no almacena el estado autoritativo: la validez del token permanece en JoinHook Commerce.

## Automatización futura

El despliegue puede automatizarse con GitHub Actions cuando exista acceso SSH/SFTP de BlueHosting con mínimo privilegio. No almacenar contraseña SSH en archivos del repositorio.

Credenciales/controles recomendados para automatización:

- usuario SSH dedicado o restringido;
- clave privada en GitHub Actions Secret;
- `known_hosts`/host fingerprint fijado;
- acceso solo a las rutas necesarias;
- backup + rollback atómico;
- smoke test Webhook y `/_next/static` antes de declarar éxito.

Hasta que ese acceso exista y sea probado, el deploy de cPanel sigue siendo el único paso manual del pipeline.
