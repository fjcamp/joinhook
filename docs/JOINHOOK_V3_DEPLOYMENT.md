# JoinHook.cl V3 — Deployment & QA Gate

Fecha de preparación: 2026-09-01
Rama candidata: `feature/joinhook-v3-complete`
Destino: `joinhook.cl`

## 1. Regla de despliegue

No fusionar ni publicar la V3 hasta que el build, CI y staging estén en verde. `main` permanece como referencia estable hasta completar el gate.

## 2. Variables obligatorias de producción

Configurar fuera del repositorio. No guardar secretos en Git.

### Contacto
- `NEXT_PUBLIC_JOINHOOK_WHATSAPP`
- `JOINHOOK_LEAD_WEBHOOK_URL`
- `JOINHOOK_REQUIRE_LEAD_WEBHOOK=true`

### Cloudflare Turnstile
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `JOINHOOK_REQUIRE_TURNSTILE=true`

### Newsletter Brevo
- `BREVO_API_KEY`
- `BREVO_LIST_ID`
- `BREVO_DOI_TEMPLATE_ID`
- `BREVO_DOI_REDIRECT_URL=https://joinhook.cl/newsletter-confirmada/`
- `JOINHOOK_REQUIRE_BREVO=true`

### Analítica / SEO
- `NEXT_PUBLIC_GA4_ID`
- `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

### Privacidad
- `JOINHOOK_PRIVACY_WEBHOOK_URL` si se desea conservar evidencia de consentimiento en el backend. Si no se configura, la elección permanece almacenada únicamente en el navegador.

### Despliegue
- `JOINHOOK_DEPLOY_TARGET=production`

## 3. Servicios externos que deben configurarse

### Google Search Console
1. Crear/verificar propiedad de `https://joinhook.cl/` o propiedad de dominio.
2. Copiar el token de verificación a `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` si se usa método HTML meta.
3. Enviar `https://joinhook.cl/sitemap.xml` después de publicar.
4. Revisar indexación, Core Web Vitals, HTTPS y páginas excluidas.

### Google Analytics 4
1. Crear/usar flujo Web de `joinhook.cl`.
2. Configurar el Measurement ID en `NEXT_PUBLIC_GA4_ID`.
3. Marcar como conversiones, según estrategia: `generate_lead`, `newsletter_subscribe` y opcionalmente `click_whatsapp`.
4. Verificar en DebugView que no se envíen nombres, correos, teléfonos ni contenido de formularios.

### Cloudflare Web Analytics
1. Crear el sitio de Web Analytics.
2. Configurar el token en `NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN`.
3. Confirmar RUM y tráfico solo después de consentimiento analítico, según la implementación conservadora de JoinHook.

### Cloudflare Turnstile
1. Crear widget para `joinhook.cl` y staging.
2. Configurar claves pública/privada.
3. Probar éxito, expiración de token, error y bloqueo de solicitud sin token.

### Brevo
1. Crear lista de Newsletter JoinHook.
2. Crear plantilla de confirmación double opt-in con identidad JoinHook.
3. Configurar enlace de baja y preferencias en las campañas.
4. Configurar SPF, DKIM y DMARC del dominio de envío.
5. Poner IDs/clave en las variables de entorno.

## 4. QA funcional obligatorio

### Navegación
- Inicio
- Sobre JoinHook
- Soluciones
- Proyectos
- Herramientas
- Control Gastronómico Express
- Lab
- Blog
- 6 artículos V3
- Contacto
- Privacidad
- Cookies
- Términos
- 404

### Responsive
Probar al menos:
- 360 × 800
- 390 × 844
- 768 × 1024
- 1024 × 768
- 1366 × 768
- 1440 × 900

Verificar que no exista overflow horizontal, contenido cortado, botones superpuestos ni texto ilegible. Confirmar que WhatsApp, Privacidad, ThemeToggle y asistente no colisionen.

### Formulario
- Validación cliente
- Validación servidor
- Honeypot
- Rate limiting
- Turnstile
- Selección de servicio y etapa
- Privacy acknowledgement
- Newsletter independiente
- Webhook de lead
- Respuesta de éxito/error
- No enviar PII a GA4

### Newsletter
- Suscripción desde Home
- Suscripción desde footer
- Doble opt-in
- Redirección a `/newsletter-confirmada/`
- No alta sin confirmación
- Unsubscribe en envíos Brevo

### Privacidad
- Estado inicial: opcionales denegadas
- Rechazar opcionales
- Aceptar todas
- Configuración granular
- Reabrir preferencias
- Persistencia local
- Evidencia de consentimiento al webhook si está configurado
- Ninguna carga de GA4/Cloudflare Analytics antes del consentimiento analítico

### Analítica
Validar eventos sin PII:
- `page_view`
- `scroll_depth`
- `section_view`
- `cta_click`
- `service_view`
- `product_view`
- `outbound_click`
- `file_download`
- `video_start`
- `video_progress`
- `video_complete`
- `form_start`
- `form_error`
- `form_submit`
- `generate_lead`
- `newsletter_start`
- `newsletter_subscribe`
- `click_whatsapp`

## 5. QA técnico

Ejecutar:

```bash
npm ci
npx tsc --noEmit
npx eslint src --max-warnings=0
npm run build
```

Luego ejecutar el flujo CI del repositorio y revisar cualquier advertencia de Next.js 16.3.

## 6. SEO

Verificar en HTML renderizado:
- un H1 principal por página
- title y description propios
- canonical correcto
- OpenGraph/Twitter
- JSON-LD válido
- `lang=es-CL`
- robots index/follow en contenido público
- noindex en áreas internas
- sitemap accesible
- robots.txt accesible
- enlaces internos rastreables
- imágenes con alt descriptivo

Después de publicar:
- enviar sitemap a Search Console
- solicitar indexación de Inicio, Soluciones, Proyectos, Herramientas y los contenidos principales
- revisar cobertura e impresiones sin intentar manipular ranking mediante keyword stuffing

## 7. Seguridad

Verificar respuesta HTTP:
- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- X-Frame-Options
- Permissions-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy

Confirmar además:
- HTTPS válido
- secretos solo en entorno servidor
- `.env*` no publicado
- `/api`, `/agent-center` y `/local*` no indexables
- rate limits activos
- origen del formulario restringido en producción
- Turnstile validado server-side

## 8. Release en BlueHosting/cPanel

1. Hacer backup completo de la versión pública actual.
2. Validar staging separado de `public_html` o mediante subdominio protegido y `JOINHOOK_DEPLOY_TARGET=staging`.
3. Ejecutar smoke test en staging.
4. Solo entonces fusionar PR a `main`.
5. Generar artefacto desde commit exacto aprobado.
6. Desplegar según `docs/bluehosting-production.md` y el workflow del repositorio.
7. Verificar inmediatamente Home, assets `/_next`, APIs, headers, sitemap y robots.
8. Mantener rollback listo hasta completar smoke test de producción.

## 9. Definition of Done

La V3 se considera desplegable cuando:
- build y CI pasan;
- no existen errores críticos responsive/visual;
- fotografía real del fundador aparece en todas las referencias;
- contacto + Turnstile + webhook funcionan;
- newsletter + double opt-in funcionan;
- consentimiento bloquea analítica opcional antes de autorización;
- GA4/Cloudflare/Search Console están configurados y verificados;
- sitemap/robots/schema/canonical son correctos;
- seguridad HTTP pasa revisión;
- staging pasa smoke test;
- existe backup y procedimiento de rollback.
