# JH-RMDC-20260822-001 — Asistente, Revenue Intelligence, continuidad documental y despliegue

**Fecha:** 2026-08-22  
**Proyecto:** JoinHook  
**Áreas:** Web, UX, Asistente IA, Marketing, Ventas, Revenue Intelligence, Deploy, Documentación  
**Estado:** En curso

## 1. Contexto

Durante la preparación de `joinhook.cl` para lanzamiento se trabajó en:

- promoción de la nueva web desde staging a producción;
- corrección de assets estáticos en BlueHosting;
- carrusel de proyectos y portadas;
- checkout de Control Gastronómico Express;
- creación del Asistente JoinHook;
- definición del asistente como primera entrada comercial;
- creación de una arquitectura de conocimiento RAG;
- evolución del concepto hacia Revenue Intelligence;
- necesidad de conservar contexto durable entre conversaciones.

## 2. Solicitudes y comentarios del usuario — versión normalizada

### Asistente

El chat debe actuar como la primera entrada del cliente a JoinHook. Debe relacionarse con Marketing, Ventas y Cierre; orientar con naturalidad, explicar usabilidad y beneficios, acompañar el ciclo de compra y derivar a una persona cuando corresponda.

El asistente no debe comenzar una conversación anunciando lo que no puede revelar. Los límites de seguridad deben activarse solo si un usuario intenta extraer información restringida, manipular el sistema o vulnerar controles.

### Conocimiento

Se requiere un lugar donde cargar documentación para alimentar al asistente y mantenerla separada de información privada.

### Revenue Intelligence

La navegación, el desplazamiento, las zonas de atención, el tiempo activo, la retención, las conversaciones, las objeciones y las conversiones deben convertirse en datos útiles para mejorar marketing, ventas, UX y desarrollo de producto.

### Nuevo producto

La combinación de asistente comercial + journey analytics + scoring + automatización + cierre constituye material suficiente para investigar un producto nuevo y más amplio.

### Continuidad documental

Se detectó que depender solo del historial del chat provoca pérdida de contexto al abrir conversaciones nuevas. Se solicita documentar resultados de forma correcta, lógica, con buena ortografía y trazabilidad, incluyendo imágenes, videos y transcripciones relevantes.

## 3. Decisiones

1. El Asistente JoinHook se modelará como **AI Front Door comercial**, no como FAQ aislado.
2. La conversación normal prioriza utilidad, beneficios y orientación; los guardrails se mantienen silenciosos hasta que sean necesarios.
3. El conocimiento público/autorizado del asistente se separa del material privado.
4. El journey completo se tratará como una capa de **Revenue Intelligence**.
5. Se adoptan Event Store, CRM/Revenue Store, Conversation Store y Session Replay como dominios de almacenamiento separados.
6. Se crea el producto candidato **Conversational Revenue Intelligence**.
7. Se adopta el **Registro Maestro de Decisiones y Conversaciones (RMDC)** como memoria durable.
8. La Bitácora Técnica seguirá siendo la fuente de verdad para incidentes reutilizables.
9. Capturas, videos y archivos pesados relevantes se conservarán como evidencias persistentes fuera del código, con referencias desde los registros.

## 4. Trabajo realizado

- Integración del checkout Mercado Pago de Control Gastronómico Express.
- Corrección de portadas y navegación del carrusel de proyectos.
- Documentación de JH-OPS-001: `/_next/static` 404 por separación runtime/document root.
- Creación del Asistente JoinHook.
- Definición de correos: `contacto@joinhook.cl`, `soporte@joinhook.cl`, `ventas@joinhook.cl`.
- Creación de `Asistente_IA_Conocimiento` en Google Drive.
- Creación del Issue #25 para Drive + n8n + RAG seguro.
- Creación de arquitectura de Revenue Intelligence.
- Creación del Issue #26 para instrumentación de navegación, chat y conversión.
- Creación del producto candidato Conversational Revenue Intelligence.
- Creación del RMDC.

## 5. Evidencias

Evidencia persistente guardada en ChatGPT Library:

```text
/Registro_Maestro_Gestion/JoinHook/2026-08-22/Evidencias/
```

Archivos iniciales:

- `2026-08-22_despliegue_assets_404.mp4` — evidencia del problema de assets/rutas durante despliegue.
- `2026-08-22_cge_404_wordpress.png` — captura de la ruta CGE siendo interceptada por WordPress.

Las capturas y videos sirven como evidencia del estado observado, no como sustituto del diagnóstico escrito.

## 6. Incidentes

### JH-OPS-001

Next.js entregaba HTML pero `/_next/static` respondía 404 desde el document root. Se resolvió sincronizando `document-root-assets` del mismo build hacia `public_html`.

### JH-OPS-002

El CTA `Conocer y probar` abre:

```text
/herramientas/control-gastronomico-express
```

pero Apache/WordPress entrega el 404 del sitio legado. La página sí existe en Next.js. El problema está en las reglas WordPress activas dentro de `public_html/.htaccess`, que compiten con Passenger por rutas no físicas.

## 7. Ideas/productos derivados

### Conversational Revenue Intelligence

Producto candidato que combina:

- marketing attribution;
- navegación y comportamiento;
- chat IA comercial;
- RAG autorizado;
- lead scoring;
- buying intent;
- CRM;
- handoff contextual;
- checkout/cierre;
- automatización;
- mejora continua de UX/producto/marketing.

Documento:

`docs/products/conversational-revenue-intelligence.md`

## 8. Pendientes

### Producción inmediata

- Corregir `.htaccess` para que WordPress deje de interceptar rutas internas.
- Validar `/herramientas/control-gastronomico-express`.
- Validar `/app/control-gastronomico-express`.
- Validar `/privacidad` y `/condiciones-beta`.
- Confirmar Mercado Pago desde producción real.
- Completar smoke test antes de declarar Launch Ready.

### Asistente

- Desplegar la nueva bienvenida amable.
- Conectar n8n/RAG.
- Implementar almacenamiento de conversaciones y lead handoff.
- Implementar avisos automáticos a ventas.

### Revenue Intelligence

- Crear Tracking Plan v1.
- Instrumentar first-party events.
- Definir consentimiento/retención.
- Evaluar product analytics + session replay privacy-by-default.

### Continuidad documental

- Crear un RMDC por conversación o hito relevante.
- Adjuntar/referenciar nuevas evidencias.
- Mantener enlaces entre RMDC, Bitácora, Issues, PR, deploys y resultados.

## 9. Siguiente punto de reanudación

Antes de continuar con marketing/lanzamiento:

1. Resolver **JH-OPS-002** en cPanel.
2. Ejecutar smoke test completo de producción.
3. Confirmar que CGE y Mercado Pago funcionan desde la web pública.
4. Publicar la versión refinada del Asistente.
5. Cerrar pendientes de Launch Gate.
6. Recién entonces pasar a lanzamiento y marketing.

## 10. Relaciones

- `docs/knowledge-base/incidents/JH-OPS-001-next-static-assets-bluehosting.md`
- `docs/knowledge-base/incidents/JH-OPS-002-wordpress-intercepts-next-routes.md`
- `docs/assistant-knowledge-center.md`
- `docs/analytics/revenue-intelligence-architecture.md`
- `docs/products/conversational-revenue-intelligence.md`
- Issue #25
- Issue #26

## 11. Etiquetas

`assistant` `marketing` `sales` `closing` `revenue-intelligence` `analytics` `product-discovery` `deploy` `wordpress` `nextjs` `passenger` `bluehosting` `documentation` `conversation-ledger`