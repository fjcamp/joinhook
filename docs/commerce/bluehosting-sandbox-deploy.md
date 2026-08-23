# JoinHook Commerce — despliegue sandbox en BlueHosting

## Objetivo

Desplegar el runtime de la rama Commerce en `joinhook.cl` para probar Webhooks y Checkout API de Mercado Pago sin activar cobros productivos ni perder el Link de Pago actual como fallback.

## Estado previo requerido

- `JoinHook Commerce` Supabase saludable.
- Mercado Pago aplicación TEST creada con Checkout API + Orders.
- Public Key TEST, Access Token TEST y Webhook Secret configurados directamente en cPanel.
- `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS` ausente o `false`.
- Webhook de prueba `Order (Mercado Pago)` apuntando al alias estable con **slash final**:
  `https://joinhook.cl/api/commerce/mercadopago/webhook/`
- No enviar secretos a GitHub, ChatGPT, documentación o capturas públicas.

> El slash final es deliberado. `next.config.js` usa `trailingSlash: true`; evitar el redirect HTTP intermedio reduce el riesgo de que un proveedor cambie el método o el cuerpo al seguir una redirección de un POST.

## Artefacto correcto

Usar el workflow **Commerce Sandbox Artifact** de la rama/PR Commerce.

Nombre del artefacto:

`joinhook-commerce-sandbox-productionlike`

Este paquete está diseñado específicamente para probar Commerce sobre el dominio productivo sin cambiar todavía al checkout embebido por defecto. Incluye:

- Next.js standalone runtime;
- handler `POST /api/commerce/mercadopago/webhook/`;
- handler canónico `/api/commerce/webhooks/mercadopago/`;
- `/api/commerce/public-config/` con configuración runtime;
- recuperación de compra;
- `document-root-assets/` con los assets exactos del mismo build;
- Link de Pago externo renderizado como fallback.

### Regla de verificación del artifact

No se fija un artifact id o digest permanente en este documento, porque cada nuevo commit del PR puede generar un paquete nuevo. Inmediatamente antes del despliegue se debe verificar el artifact asociado al **head exacto aprobado** y registrar esa evidencia en el PR/registro de despliegue.

La inspección previa debe comprobar como mínimo:

- artifact name `joinhook-commerce-sandbox-productionlike`;
- workflow head igual al commit que se va a desplegar;
- digest SHA-256 informado por GitHub Actions;
- presencia de `.next`, `node_modules`, `server.js`, `package.json`, `public` y `document-root-assets`;
- ausencia de archivos `.env*` y credenciales reales;
- smoke local production-like con `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false`:
  - `/` → 200;
  - `/api/commerce/health/` → 200;
  - `/api/commerce/mercadopago/webhook/` por GET → 405;
  - `/api/commerce/webhooks/mercadopago/` por GET → 405;
  - `/checkout/control-gastronomico-express/` → 200.

Si cambia el head, el artifact anterior deja de ser el candidato de despliegue aunque su smoke haya sido exitoso.

## Destinos BlueHosting

Runtime Passenger:

`/home/joinhook/joinhook-production`

Document root Apache/LiteSpeed:

`/home/joinhook/public_html`

No ejecutar `next build` en BlueHosting.

## Procedimiento manual seguro

1. Descargar el artifact generado por GitHub Actions y verificar que corresponde al head aprobado.
2. Respaldar el runtime actual antes de reemplazarlo.
3. Extraer el contenido del runtime en `/home/joinhook/joinhook-production`, conservando la estructura `.next`, `node_modules`, `server.js`, `package.json` y `public` del artifact.
4. Copiar los **contenidos** de `document-root-assets/` a `/home/joinhook/public_html/`.
5. No copiar `document-root-assets/_next/static` como `_next/static/static`; el destino final debe ser `/home/joinhook/public_html/_next/static/...`.
6. Mantener la configuración Passenger existente en `.htaccess`; no reintroducir el antiguo bloque de rewrite WordPress.
7. Confirmar en cPanel que `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false` antes del restart.
8. Reiniciar la aplicación Node/Passenger desde cPanel. Si se automatiza sin UI, cPanel documenta el mecanismo Passenger `tmp/restart.txt`; no asumirlo hasta validar permisos del canal usado.
9. Verificar home, CSS/JS, assets públicos y `/api/commerce/health/`.
10. Recién después validar las rutas Webhook.

## Gate inmediato del Webhook

Abrir en navegador:

`https://joinhook.cl/api/commerce/mercadopago/webhook/`

Resultado esperado por GET:

`405 Method Not Allowed`

También debe existir el handler canónico:

`https://joinhook.cl/api/commerce/webhooks/mercadopago/`

por GET → `405 Method Not Allowed`.

Un `404` significa que el runtime desplegado no contiene Commerce o que el routing no llegó a Passenger. Un `308` indica que se usó una variante sin slash final; para la configuración del proveedor debe guardarse directamente la URL canónica sin depender de ese redirect.

Después del 405:

1. enviar simulación Webhook `Order` desde Mercado Pago;
2. firma inválida debe devolver `401`;
3. una firma válida con Order desconocida debe fallar de forma controlada y quedar registrada según el escenario de sandbox;
4. repetir un evento para comprobar idempotencia;
5. no habilitar `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=true` hasta iniciar expresamente las pruebas de pago TEST.

## Configuración runtime pendiente para pago/fulfillment

Antes de crear una compra sandbox real también deben existir directamente en cPanel:

- `JOINHOOK_DOWNLOAD_TOKEN_SECRET` — secreto aleatorio de alta entropía;
- `JOINHOOK_DOWNLOAD_IP_HASH_SALT` — sal privada opcional/recomendada;
- `JOINHOOK_GASTRO_EXPRESS_PRIVATE_FILE` — ruta absoluta al paquete privado;
- `JOINHOOK_COMMERCE_CHECKOUT_ENABLED=true` solo durante el tramo de prueba deliberado;
- `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=true` solo para ejecutar tarjetas/cuentas TEST y volver a `false` al finalizar la sesión de QA.

Los secretos anteriores se introducen directamente en el servidor. No se copian en este documento, issues, commits ni conversación.

## Recuperación de compra

La base y el código ya soportan recuperación de compra, pero para hacerla operativa faltan secretos/canal externo:

- `JOINHOOK_RECOVERY_TOKEN_SECRET`;
- `JOINHOOK_TRANSACTIONAL_EMAIL_WEBHOOK_URL`;
- `JOINHOOK_TRANSACTIONAL_EMAIL_WEBHOOK_SECRET`.

El adapter acepta un endpoint HTTPS privado, por ejemplo un flujo n8n autorizado que envíe el correo mediante el canal transaccional elegido. n8n no almacena el estado autoritativo: la validez del token permanece en JoinHook Commerce.

## Automatización futura

El despliegue puede automatizarse con GitHub Actions cuando exista acceso SSH/Jailed Shell de BlueHosting con mínimo privilegio. No almacenar contraseña SSH en archivos del repositorio.

Credenciales/controles recomendados para automatización:

- usuario SSH dedicado o restringido;
- clave privada en GitHub Actions Secret;
- `known_hosts`/host fingerprint fijado;
- acceso solo a las rutas necesarias;
- backup + rollback atómico;
- smoke test Webhook, health y `/_next/static` antes de declarar éxito.

Fallback si BlueHosting no ofrece SSH: evaluar FTPS/TLS con cuenta dedicada y alcance mínimo. La viabilidad depende de que el hosting permita escritura en runtime + document root y que `tmp/restart.txt` active Passenger en esta configuración. No usar la contraseña principal de cPanel como credencial de CI.

Hasta que uno de esos canales exista y sea probado, el deploy de cPanel sigue siendo el único paso manual del pipeline.
