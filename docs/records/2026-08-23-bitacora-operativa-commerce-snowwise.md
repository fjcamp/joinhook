# Bitácora operativa — 2026-08-23 — JoinHook Commerce + SnowWise

## Propósito

Conservar decisiones, errores históricos, estado verificable y trabajo ejecutado para que el desarrollo pueda retomarse desde VS Code, GitHub o futuras conversaciones sin reconstruir contexto de memoria.

## 1. JoinHook Commerce — estado antes de BlueHosting

- Commerce continúa en PR #31, draft y sin activar pagos productivos.
- El artifact production-like incorpora runtime standalone, `document-root-assets`, metadata de release y checksums.
- El kill switch `JOINHOOK_COMMERCE_ACCEPT_PAYMENTS=false` permanece como gate independiente del frontend.
- El Webhook externo debe registrarse en forma canónica con slash final: `https://joinhook.cl/api/commerce/mercadopago/webhook/`.
- Mientras BlueHosting no exponga SSH/Jailed Shell, el fallback aprobado es despliegue manual por cPanel siguiendo `docs/commerce/manual-bluehosting-commerce-deploy.md`.

## 2. Incidentes históricos de despliegue revisados

### JH-OPS-001 — assets Next fuera del document root

Síntoma: HTML correcto pero CSS/JS/assets `/_next/static` en 404.  
Causa: runtime en `/home/joinhook/joinhook-production` y Apache sirviendo archivos físicos desde `/home/joinhook/public_html`.  
Regla definitiva: **runtime y `document-root-assets` del mismo build se despliegan como unidad**.

### JH-OPS-002 — rewrite WordPress interceptando Next.js

Síntoma: rutas dinámicas/internas capturadas por routing legado.  
Causa: reglas WordPress aún presentes en `.htaccess`.  
Regla definitiva: respaldar `.htaccess`, conservar Passenger y retirar únicamente rewrite WordPress conflictivo; no reemplazar el archivo completo a ciegas.

### JH-OPS-003 — Webhook no desplegado / ruta no canónica

Síntoma: ruta de Mercado Pago en 404 pese a dominio/Passenger operativos.  
Causa: runtime productivo anterior a Commerce; además existía diferencia entre alias externo y handler interno.  
Regla definitiva: alias probado por CI, verificar `405` en GET después del deploy y registrar la URL externa con slash final para evitar depender de redirect `308` en POST.

## 3. Checklist manual de BlueHosting

Se creó un procedimiento específico que exige:

1. SHA exacto + CI verde.
2. `RELEASE-METADATA.json`/`DEPLOYMENT.txt` coherentes.
3. validación `SHA256SUMS.txt`.
4. backup de runtime, `_next/static`, assets y `.htaccess`.
5. reemplazo coherente del runtime.
6. sincronización del mirror `document-root-assets`.
7. revisión de `.htaccess` contra JH-OPS-002.
8. restart Passenger + log.
9. smoke de Home/assets/API/Commerce.
10. `create-order` bloqueado antes del sandbox deliberado.
11. rollback de runtime + assets del mismo build si falla.

## 4. SnowWise — PWA y subdominio

Dirección confirmada:

- `joinhook.cl` permanece como portada corporativa/portafolio/comercial.
- `snowwise.joinhook.cl` será el origen público objetivo del MVP/PWA.
- SnowWise mantiene runtime, Supabase, secretos y datos propios.
- No se modificará DNS hasta completar preview, Auth/orígenes, QA móvil/desktop/offline, seguridad y rollback.

## 5. SnowWise — Home centrada en comportamiento de salida

Se registró Issue #12 para reordenar la Home según las decisiones reales del usuario antes de subir a montaña.

Orden recomendado:

### Tier 1 — decisión inmediata
- destino;
- temperatura;
- viento/ráfagas;
- precipitación/nieve;
- riesgo orientativo;
- alerta oficial/operacional crítica;
- acceso/cierre/regulación relevante.

### Tier 2 — Departure Brief
- checklist esencial;
- combustible;
- agua/alimentos;
- cadenas/equipo de invierno;
- teléfono/batería;
- ticket/reserva/permiso;
- próximos recordatorios.

### Tier 3 — ruta y servicios
- combustible/alimentación/equipamiento/estacionamiento solo cuando exista contexto de viaje y fuente verificable;
- contenido patrocinado separado de recomendación operacional;
- interfaz que minimice distracción durante conducción.

### Tier 4 — exploración
Noticias, eventos, comunidad, pasaporte y descubrimiento después de los bloques operacionales.

## 6. Reminder Center — primera implementación

Se añadió a SnowWise PR #10 una base local-first:

- plantillas de recordatorio: combustible, alimentos/agua, cadenas/equipo invernal, teléfono/batería y ticket/reserva;
- fecha/hora configurable;
- persistencia offline en `localStorage` con límite acotado;
- indicador discreto en Home;
- popup de recordatorio vencido;
- acciones `Listo`, `+15 min` y `Cancelar` en el popup y en configuración;
- permiso de notificaciones del sistema solo por acción explícita;
- notificación best-effort cuando la PWA está activa;
- recordatorios vencidos aparecen en la siguiente apertura.

Restricción documentada: una PWA puramente local no puede garantizar scheduling cuando está completamente cerrada. La fase posterior requiere Web Push + backend/cola y service worker para acciones del SO (`Listo/Cancelar/Posponer`). No se simulará esa garantía con timers de página.

## 7. Seguridad y privacidad de SnowWise

- GPS en vivo continúa bajo endpoint/política `no-store` y no se usa para crear recordatorios automáticamente.
- El Reminder Center inicial no solicita geolocalización ni sincroniza datos personales.
- La futura Route Assistant deberá usar ubicación solo con consentimiento y minimizar retención.
- El checklist autenticado ya dispone de sincronización privada owner-only en Supabase; recordatorios podrán seguir un patrón equivalente en fase posterior si se aprueba.

## 8. VS Code / aprendizaje del repositorio

El usuario indicó que abrirá Visual Studio Code para revisar código y aprender rutas/elementos del ecosistema. Próxima sesión operativa recomendada:

- clonar/actualizar `fjcamp/joinhook` y `fjcamp/snowwise`;
- abrir cada repo como workspace separado o multi-root;
- revisar primero `src/pages`, `src/lib`, `.github/workflows`, `docs` en JoinHook;
- revisar `apps/web/app`, `apps/web/tests`, `supabase/migrations`, `.github/workflows` en SnowWise;
- trabajar siempre sobre ramas, nunca editar producción directamente;
- usar Git para ver diff/commits y relacionar código con Issues/PRs y bitácora.

## 9. Gates que siguen cerrados

- no merge PR #31 Commerce;
- no habilitar cobros productivos;
- no cambiar DNS de SnowWise;
- no merge/publicación SnowWise antes de CI/preview/QA;
- no introducir credenciales en GitHub, documentación o conversación;
- no ejecutar despliegue BlueHosting hasta confirmar acceso SSH o seguir el checklist manual con backup/rollback.
