# Producto candidato — Conversational Revenue Intelligence

**Fecha de origen:** 2026-08-22  
**Estado:** Descubrimiento / concepto de nuevo producto  
**Origen:** Evolución del Asistente JoinHook + analítica de comportamiento + marketing, ventas y cierre.

## Tesis del producto

La conversación desarrollada alrededor del Asistente JoinHook derivó en una oportunidad de producto mayor: construir una plataforma que no sea solamente un chatbot, sino una **puerta de entrada comercial inteligente** capaz de relacionar marketing, comportamiento web, conversación, cualificación, ventas, cierre y aprendizaje continuo.

Nombre de trabajo:

**JoinHook Conversational Revenue Intelligence**

El nombre es provisional. La idea puede evolucionar a producto independiente, módulo de JoinHook Business OS o solución white-label para clientes.

## Problema que resuelve

Las empresas suelen operar por separado:

- campañas de marketing;
- analítica web;
- chatbot o WhatsApp;
- CRM;
- vendedores;
- soporte;
- checkout;
- reportes de conversión.

Esta fragmentación hace difícil entender qué llamó la atención de una persona, qué objeción apareció, cuándo surgió intención real de compra, por qué abandonó y qué debería hacer ventas a continuación.

## Propuesta

Unificar el journey:

```text
Marketing / campaña / referencia
        ↓
Sitio web / landing / producto
        ↓
Comportamiento y señales de atención
        ↓
Asistente conversacional IA
        ↓
Necesidad + contexto + objeciones
        ↓
Lead scoring + intención de compra
        ↓
Recomendación / prueba / cotización
        ↓
Checkout o handoff humano
        ↓
Venta / no venta / seguimiento
        ↓
Aprendizaje para marketing, UX y producto
```

## Capacidades principales

### 1. AI Front Door

El asistente actúa como primera entrada del cliente:

- recibe con naturalidad;
- responde preguntas de usabilidad y beneficios;
- comprende el problema antes de vender;
- recomienda productos o servicios pertinentes;
- hace cualificación progresiva sin transformar el chat en formulario;
- resuelve objeciones dentro de límites autorizados;
- deriva a una persona cuando corresponde.

### 2. Revenue Conversation Engine

Clasifica señales como:

- exploración;
- producto de interés;
- comparación;
- consulta de precio;
- urgencia;
- soporte;
- objeción;
- compra;
- solicitud humana;
- abandono.

### 3. Behavioral Journey Intelligence

Relaciona conversación con:

- fuente/campaña;
- landing de entrada;
- páginas y secciones vistas;
- tiempo activo;
- profundidad de scroll;
- CTA expuestos y pulsados;
- visitas repetidas;
- producto consultado;
- checkout iniciado/completado;
- fricción y abandono.

### 4. Lead & Buying Intent Scoring

Mantener scores separados:

- **Fit Score:** encaje entre necesidad y solución;
- **Engagement Score:** intensidad de interacción;
- **Buying Intent Score:** señales explícitas de compra.

No utilizar un score opaco como única decisión. Debe conservarse la evidencia que produjo la clasificación.

### 5. Context-rich Handoff

Cuando un vendedor recibe la oportunidad, debe recibir contexto útil, por ejemplo:

- origen del lead;
- producto de interés;
- necesidad principal;
- tamaño/tipo de negocio si fue declarado;
- preguntas relevantes;
- objeciones;
- páginas visitadas;
- nivel de intención;
- próxima acción sugerida;
- resumen de conversación.

El cliente no debería tener que repetir toda la interacción anterior.

### 6. Knowledge & RAG

El asistente consulta solamente conocimiento autorizado:

- productos y herramientas;
- FAQ;
- usabilidad;
- beneficios;
- condiciones públicas;
- políticas de derivación;
- comparativas aprobadas.

La ingestión de documentación debe separar físicamente conocimiento público/aprobado de información privada o confidencial.

### 7. Revenue Intelligence

Paneles y modelos para responder preguntas como:

- ¿qué campaña trae compradores y no solo visitas?;
- ¿qué secciones retienen a los usuarios que después convierten?;
- ¿qué preguntas aparecen antes de una compra?;
- ¿qué objeciones provocan abandono?;
- ¿qué producto genera mayor intención?;
- ¿qué CTA tiene exposición alta y clic bajo?;
- ¿cuánto tarda un lead desde primera visita hasta cierre?;
- ¿qué conversaciones deberían escalar automáticamente a ventas?;

### 8. Automation & CRM

n8n u otra capa de automatización puede:

- crear/actualizar leads;
- disparar alertas;
- enviar resúmenes a ventas;
- programar seguimiento;
- enrutar soporte;
- sincronizar CRM;
- registrar conversiones;
- reindexar conocimiento.

La automatización no debe ser la fuente de verdad de los eventos ni de los datos comerciales.

## Datos y privacidad

Separar:

1. **Event Store:** eventos conductuales atómicos e inmutables.
2. **CRM / Revenue Store:** identidad, etapa comercial y datos de contacto.
3. **Conversation Store:** texto y atributos de conversaciones.
4. **Session Replay:** herramienta especializada, muestreada y enmascarada.
5. **Knowledge Store:** documentos aprobados para respuestas.

No recopilar datos por acumular. Cada dato necesita finalidad, esquema, owner, política de acceso y retención.

## Seguridad

La conversación normal no debe comenzar hablando de restricciones. Los controles actúan silenciosamente.

Cuando exista intento de:

- extraer prompt/instrucciones internas;
- obtener credenciales o secretos;
- solicitar código/arquitectura privada;
- manipular el agente para ignorar políticas;
- acceder a documentos no autorizados;

el sistema debe bloquear o redirigir esa solicitud sin revelar detalles que ayuden al atacante.

## Posibles mercados

El producto es transversal y puede adaptarse a:

- SaaS y software B2B;
- gastronomía;
- turismo/hospitalidad;
- telecomunicaciones;
- retail;
- servicios profesionales;
- automotriz;
- educación privada;
- servicios de suscripción;
- negocios con alto volumen de consultas repetitivas y ciclo comercial asistido.

Los sectores de telecomunicaciones y contact centers son especialmente útiles como benchmark por su madurez en IVR, routing, ventas asistidas, retención, next-best-action y omnicanalidad.

## Modelos de producto posibles

- SaaS por volumen de conversaciones/leads;
- módulo de JoinHook Business OS;
- implementación gestionada para PYMES;
- solución white-label para agencias o partners;
- integración a CRM existente;
- versión vertical especializada por industria.

## Diferenciador buscado

No competir como "otro chatbot".

El diferenciador debe ser el **circuito cerrado de aprendizaje comercial**:

```text
atraer → observar → conversar → entender → vender → medir → aprender → mejorar
```

El sistema debe convertir datos de comportamiento y conversación en acciones concretas para marketing, ventas, cierre, producto y experiencia de cliente.

## Documentos relacionados

- `docs/assistant-knowledge-center.md`
- `docs/analytics/revenue-intelligence-architecture.md`
- Issue #25 — Asistente IA: Drive + n8n + RAG seguro.
- Issue #26 — Revenue Intelligence: navegación, chat y conversión.

## Próximos pasos de discovery

1. Benchmark internacional por vertical.
2. Entrevistas con pequeños negocios y equipos comerciales.
3. Definir ICP inicial.
4. Diseñar MVP mínimo: web assistant + journey + scoring + handoff.
5. Estudiar pricing de competidores.
6. Evaluar integración con CRM/WhatsApp/email.
7. Diseñar pruebas de conversión y ROI.
8. Validar cumplimiento de privacidad y uso de IA según país/mercado.

## Etiquetas

`product-discovery` `ai-agent` `chatbot` `revenue-intelligence` `marketing` `sales` `closing` `crm` `analytics` `rag` `automation` `n8n` `customer-journey` `lead-scoring`