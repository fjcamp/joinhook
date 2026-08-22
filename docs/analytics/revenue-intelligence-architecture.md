# JoinHook Revenue Intelligence — arquitectura de analítica conductual y comercial

**Fecha:** 2026-08-22  
**Estado:** Base estratégica / implementación por fases  
**Ámbitos:** marketing, sitio web, asistente IA, ventas, cierre, soporte, producto y UX.

## Objetivo

Construir una capa propia de **Revenue Intelligence** que permita entender el recorrido completo desde la primera visita hasta la compra, soporte o abandono, y utilizar esa información para mejorar continuamente marketing, diseño, productos, conversaciones, precios, contenido y cierre comercial.

La analítica no se limitará a páginas vistas. Debe relacionar:

- adquisición y campaña de origen;
- navegación y recorridos;
- tiempo activo y retención por sección;
- exposición y clics en llamados a la acción;
- interacción con proyectos y herramientas;
- apertura y uso del Asistente JoinHook;
- conversación, intención y cualificación;
- handoff a ventas, soporte o contacto humano;
- checkout y compra;
- retornos posteriores;
- fricción, abandono y problemas de usabilidad.

## Principios adoptados de referencias internacionales

1. **Tracking Plan como fuente de verdad.** Cada evento y propiedad debe existir por una pregunta de negocio concreta y tener definición, propietario, versión, fuente y finalidad.
2. **Empezar pequeño.** Instrumentar primero el funnel principal y ampliar solo cuando exista una necesidad analítica real.
3. **Eventos + propiedades, no nombres dinámicos.** Mantener una taxonomía estable y propiedades contextuales reutilizables.
4. **Separar desarrollo y producción.** Los datos de QA/staging no deben contaminar producción.
5. **Eventos críticos server-side.** Compra, lead, handoff, checkout confirmado y otros hitos comerciales se registrarán del lado servidor cuando sea posible.
6. **Raw events inmutables.** Los eventos originales no se reescriben; scoring, canales, segmentos y clasificaciones se calculan en tablas derivadas.
7. **Esquemas versionados y validados.** Cambios incompatibles requieren una nueva versión del esquema.
8. **Identidad progresiva.** El visitante comienza con `anonymous_id`; cuando entrega un dato identificable o se convierte en cliente se vincula a un `lead_id`/`customer_id` sin reescribir el historial original.
9. **Analítica del agente separada pero enlazable.** `web_session_id` y `conversation_id` son entidades diferentes, relacionadas mediante identificadores comunes.
10. **Privacidad por diseño.** No recolectar datos personales que no sean necesarios; en replay se enmascaran o excluyen inputs, chat, pagos y cualquier zona sensible.

## Arquitectura objetivo

```text
Web / PWA / productos
        │
        ├── eventos UX/marketing (client-side)
        ├── eventos críticos (server-side)
        └── Asistente JoinHook
                │
                ▼
        First-party Event Collector
                │
        validación de esquema + consentimiento
                │
        ├──────────────► Raw Event Store (inmutable)
        │
        ├──────────────► Product Analytics / funnels / cohorts
        │
        ├──────────────► Session Replay muestreado y enmascarado
        │
        └──────────────► n8n / Revenue Automation
                              │
                              ├── lead scoring
                              ├── alertas a ventas
                              ├── soporte
                              └── CRM / seguimiento

Raw Event Store
        │
        ▼
Derived Models / Revenue Intelligence
        │
        ├── sesiones
        ├── journeys
        ├── attribution
        ├── funnels
        ├── retention
        ├── intent score
        ├── conversion score
        └── UX friction
```

## Separación de almacenes

### 1. Event Store conductual

Almacena eventos atómicos de alto volumen. Debe ser append-only/inmutable.

No almacenar aquí el texto completo de conversaciones ni PII innecesaria.

Campos base propuestos:

- `event_id`
- `event_name`
- `event_version`
- `occurred_at`
- `anonymous_id`
- `lead_id` nullable
- `customer_id` nullable
- `web_session_id`
- `conversation_id` nullable
- `page_path`
- `page_title`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `device_type`
- `browser_family`
- `locale`
- `consent_analytics`
- `consent_marketing`
- `properties` JSON

### 2. CRM / Revenue Store

Contiene información identificable y comercial de menor volumen:

- lead/contacto;
- canal de origen;
- producto/interés;
- etapa comercial;
- fit score;
- engagement score;
- buying-intent score;
- próxima acción;
- último contacto;
- resultado/cierre.

La identidad personal se mantiene aquí y el Event Store utiliza identificadores internos siempre que sea posible.

### 3. Conversation Store

Las conversaciones del asistente se almacenan separadamente porque pueden contener información entregada libremente por el usuario.

Guardar:

- `conversation_id`;
- turnos;
- timestamps;
- intención detectada;
- temas;
- productos consultados;
- sentimiento si realmente aporta valor;
- nivel de cualificación;
- handoff;
- resultado.

Para analítica global usar preferentemente atributos derivados (`intent=pricing`, `handoff=sales`) en vez de copiar el texto completo al Event Store.

### 4. Session Replay

No almacenar nosotros mismos cada coordenada del mouse ni cada modificación DOM dentro de PostgreSQL. Utilizar una herramienta especializada y muestrear sesiones.

Política inicial recomendada:

- replay desactivado hasta consentimiento cuando corresponda;
- inputs y chat enmascarados/excluidos;
- checkout, pagos y datos de cliente excluidos;
- muestreo de tráfico normal;
- mayor prioridad para sesiones con error, abandono de funnel o conversión;
- retención corta para replay frente a los eventos agregados.

## Taxonomía inicial JoinHook

### Adquisición

- `session_started`
- `landing_page_viewed`
- `campaign_attributed`
- `referral_received`

### Navegación y atención

- `page_viewed`
- `section_viewed`
- `section_engaged`
- `scroll_depth_reached`
- `cta_exposed`
- `cta_clicked`
- `project_selected`
- `tool_viewed`

`section_engaged` debe medir **tiempo activo**, no simplemente tiempo con la pestaña abierta. Se pausa con `visibilitychange`, pérdida de foco o inactividad.

### Asistente

- `assistant_opened`
- `assistant_closed`
- `assistant_quick_reply_selected`
- `assistant_message_sent`
- `assistant_response_delivered`
- `assistant_topic_detected`
- `assistant_qualification_updated`
- `assistant_contact_captured`
- `assistant_handoff_requested`
- `assistant_handoff_completed`

No enviar el texto completo de `assistant_message_sent` al Event Store general. El contenido queda en Conversation Store con controles de acceso y retención propios.

### Revenue

- `product_interest_detected`
- `pricing_viewed`
- `demo_started`
- `checkout_started`
- `checkout_redirected`
- `checkout_completed`
- `purchase_confirmed`
- `quote_requested`
- `sales_handoff_created`
- `support_handoff_created`

Los eventos de conversión económica deben confirmarse server-side cuando sea posible.

### Fricción / UX

- `form_error`
- `navigation_dead_end`
- `rage_click_detected`
- `asset_load_failed`
- `checkout_abandoned`
- `assistant_abandoned`

## Métricas de Revenue Intelligence

### Marketing

- sesiones por canal/campaña;
- costo por lead cuando exista inversión;
- lead rate por campaña;
- conversión por landing;
- first-touch / last-touch / assisted attribution.

### UX

- tiempo activo por sección;
- porcentaje de scroll;
- exposición vs clic de CTA;
- recorridos dominantes;
- páginas previas al abandono;
- sesiones con fricción;
- retorno por cohorte.

### Asistente

- tasa de apertura;
- pregunta inicial;
- categorías de intención;
- preguntas sin respuesta satisfactoria;
- tiempo a primera respuesta;
- turnos hasta lead;
- turnos hasta compra/handoff;
- abandono del chat;
- conversiones asistidas por chat.

### Ventas y cierre

- visitante → conversación;
- conversación → lead;
- lead → lead cualificado;
- cualificado → oportunidad;
- oportunidad → checkout/cotización;
- checkout → compra;
- tiempo hasta cierre;
- objeciones más frecuentes;
- canales/páginas/contenidos que preceden a cierres.

## Scoring

No construir un único score opaco. Mantener inicialmente tres componentes independientes:

1. **Fit Score** — qué tan compatible es el prospecto con el producto/servicio.
2. **Engagement Score** — intensidad y calidad de interacción.
3. **Buying Intent Score** — señales explícitas de compra: precio, implementación, disponibilidad, demo, checkout, plazo, solicitud humana.

Un `priority_score` derivado puede combinar los anteriores, pero los componentes deben seguir visibles para explicar por qué el lead fue priorizado.

## Identity Resolution

Estados:

```text
anonymous visitor
    ↓
known lead
    ↓
qualified lead
    ↓
opportunity
    ↓
customer
```

Nunca depender del email como identificador técnico primario del event stream.

Usar:

- `anonymous_id`: generado first-party;
- `lead_id`: UUID interno al capturar datos;
- `customer_id`: UUID al convertirse en cliente.

La tabla de identidad/CRM guarda la asociación entre IDs y datos identificables.

## Privacidad, consentimiento y retención

Aplicar finalidad, minimización, acceso por rol y retención diferenciada.

Clasificar trackers:

- **necesarios**;
- **analítica**;
- **marketing/personalización**.

Registrar el estado de consentimiento junto con el evento y no activar herramientas no esenciales antes de la decisión del usuario cuando sea requerido.

Nunca registrar en analytics:

- contraseñas;
- tarjetas o datos de pago;
- tokens/API keys;
- credenciales;
- campos sensibles del proyecto;
- contenido de formularios completo sin una finalidad explícita.

Política inicial de retención propuesta, sujeta a revisión legal/compliance:

- session replay: corta (ej. 30 días);
- eventos conductuales raw: media (ej. 90–180 días inicialmente);
- agregados/desidentificados: más extensos cuando sean realmente útiles;
- visitantes inactivos: política automática de expiración;
- leads/clientes: retención según relación comercial y obligaciones aplicables;
- conversaciones: política separada y documentada.

## Data Quality y gobierno

Cada evento requiere en el Tracking Plan:

- nombre;
- versión;
- descripción;
- pregunta de negocio que responde;
- cuándo dispara;
- productor (web/server/chat/n8n);
- propiedades y tipos;
- PII permitida/prohibida;
- consentimiento requerido;
- owner;
- fecha de alta/deprecación.

Implementación:

- JSON Schema por evento o familia de eventos;
- validación en collector;
- CI para tracking crítico;
- entornos staging/prod separados;
- event IDs idempotentes para deduplicación;
- observabilidad de eventos rechazados;
- changelog de taxonomía en GitHub.

## Implementación recomendada para JoinHook

### Fase 1 — costo mínimo / validación

- Tracking Plan versionado en GitHub.
- First-party IDs y consentimiento.
- Instrumentar solo funnel principal y chat.
- PostHog o equivalente para product analytics + replay muestreado y enmascarado.
- Supabase/PostgreSQL para CRM, lead state y eventos comerciales seleccionados.
- n8n solo para automatizaciones derivadas, no como fuente de verdad.

### Fase 2 — unificación

- Collector propio `/api/analytics/events`.
- Schemas versionados.
- Conversaciones separadas.
- Modelos derivados de sesiones/journeys.
- Lead scoring explicable.
- Dashboard Revenue Intelligence.

### Fase 3 — escala

Cuando el volumen justifique separar analítica transaccional:

- Event Store columnar (ClickHouse / Snowplow-style warehouse / equivalente).
- PostgreSQL queda para CRM y operaciones.
- Modelado incremental/dbt o equivalente.
- Experimentación/A-B testing.
- atribución y cohortes avanzadas.

## Regla operativa

La data no se recopila por curiosidad. Cada señal debe responder al menos una de estas preguntas:

1. ¿Qué atrajo al usuario?
2. ¿Qué intentó resolver?
3. ¿Qué parte de JoinHook le interesó?
4. ¿Dónde encontró fricción?
5. ¿Qué lo acercó o alejó de comprar?
6. ¿Qué información necesitó antes de avanzar?
7. ¿Qué debe cambiar marketing, producto, UX, ventas o soporte?

## Relación con el Asistente JoinHook

El asistente es un sensor de alta intención dentro del Revenue Engine. Su comportamiento se combina con navegación y atribución para entender el journey completo.

Ejemplo:

```text
Instagram campaign
→ landing CGE
→ 64 s de tiempo activo
→ pricing_viewed
→ assistant_opened
→ pregunta sobre stock/mermas
→ pregunta precio
→ lead capturado
→ checkout_started
→ purchase_confirmed
```

El sistema podrá explicar qué campaña, contenido, comportamiento y conversación precedieron a una venta sin depender de una sola métrica de último clic.

## Referencias de diseño evaluadas

Benchmark conceptual basado en prácticas documentadas por Amplitude, Mixpanel, Twilio Segment, Snowplow, HubSpot, Intercom, Fullstory y autoridades de privacidad europeas/UK. Las referencias externas deben revisarse periódicamente porque productos y normativa evolucionan.
