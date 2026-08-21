# JoinHook Growth OS + JoinHook Command

Estado: concepto canónico / roadmap interno

## Objetivo

Construir un sistema comercial y de marketing orgánico para todo el ecosistema JoinHook que concentre y mantenga datos consistentes de productos, servicios, prospectos, clientes, precios, campañas, negociaciones, contenido, conversiones y resultados.

La meta es que JoinHook pueda investigar, planificar, producir, medir y optimizar su actividad comercial con apoyo de automatizaciones y agentes, mientras Francisco mantiene la aprobación humana en los puntos críticos y supervisa el ecosistema desde una aplicación privada móvil.

## Principios

- First-party data como activo principal.
- Costo inicial cercano a $0 siempre que sea viable.
- n8n como capa de orquestación, no como fuente de verdad.
- PostgreSQL/Supabase como fuente de verdad para datos comerciales y eventos.
- No depender de una sola plataforma o red social.
- No publicar ni enviar campañas masivas sin aprobación humana durante las primeras fases.
- No simular identidades humanas: el chat comercial se presenta como Asistente JoinHook.
- Trazabilidad completa desde contenido/campaña hasta lead, conversación, negociación y venta.
- Separación entre infraestructura comercial interna y productos para clientes.
- Privacidad, consentimiento, mínimos datos necesarios y trazabilidad de accesos.

## Arquitectura conceptual

```text
SEO / YouTube / TikTok / LinkedIn / Email / Comunidades
                         |
                         v
                    joinhook.cl
                         |
                         v
                 Eventos + Analítica
                         |
             +-----------+-----------+
             |                       |
             v                       v
       Captación / Chat             CRM
             |                       |
             +-----------+-----------+
                         |
                         v
                        n8n
               Orquestación / Flujos
                         |
        +----------------+----------------+
        |                |                |
        v                v                v
   Supabase          Email/CRM        Agentes IA
  datos/eventos      seguimiento      análisis/ventas
        |                |                |
        +----------------+----------------+
                         |
                         v
                 JoinHook Command
                panel privado móvil
```

## JoinHook Growth OS

Sistema interno responsable de:

1. Captación de demanda.
2. Registro de fuentes y campañas.
3. Perfilado de prospectos y clientes.
4. Gestión del embudo comercial.
5. Precios, ofertas y reglas de negociación.
6. Chat comercial asistido.
7. Seguimiento automatizado.
8. Producción y gestión de contenido.
9. Analítica de conversión.
10. Aprendizaje y recomendaciones para próximas campañas.

## JoinHook Command

Aplicación/PWA privada para supervisión desde móvil.

Debe mostrar como mínimo:

- visitantes del día;
- leads nuevos;
- chats activos;
- leads calientes;
- solicitudes de compra;
- ventas y monto vendido;
- productos/servicios con mayor interés;
- campañas con mejor conversión;
- estado de agentes y automatizaciones;
- alertas comerciales;
- tareas que requieren aprobación humana;
- conversaciones que necesitan intervención;
- piezas de contenido esperando visto bueno;
- calendario semanal de publicaciones;
- incidencias de integraciones.

La intención es que Francisco no tenga que entrar normalmente a n8n, Supabase, CRM, Analytics, Canva u otras herramientas para entender el estado del negocio.

## Base maestra de productos y servicios

Cada producto/servicio debe mantener una ficha canónica con:

- nombre;
- categoría;
- estado: idea, prototipo, MVP, beta, estable, pausado;
- propuesta de valor;
- problemas que resuelve;
- segmento objetivo;
- buyer personas;
- funcionalidades actuales;
- funcionalidades futuras;
- limitaciones conocidas;
- precio actual;
- reglas de descuento;
- rango negociable;
- condiciones comerciales;
- CTA vigente;
- landing;
- demo/beta;
- preguntas frecuentes;
- objeciones habituales;
- respuestas aprobadas;
- competidores y alternativas;
- métricas de interés;
- métricas de conversión;
- contenido asociado;
- campañas activas;
- historial de cambios de precio/oferta.

## Perfil comercial de cliente

El sistema debe permitir construir perfiles basados en datos reales, no supuestos permanentes.

Campos sugeridos:

- tipo de negocio;
- tamaño aproximado;
- rubro;
- ciudad/región;
- problema principal;
- problemas secundarios;
- producto de interés;
- canal de origen;
- contenido que consumió;
- preguntas realizadas;
- objeciones;
- nivel de intención;
- presupuesto declarado si lo entrega voluntariamente;
- estado del embudo;
- último contacto;
- próxima acción;
- resultado final;
- motivo de compra o pérdida;
- valor de venta;
- potencial de recurrencia/cross-sell.

## Embudo comercial

Estados iniciales:

```text
Visitante
  -> Lead
  -> Contactado
  -> Interesado
  -> Beta / Demo
  -> Propuesta
  -> Negociación
  -> Venta
  -> Onboarding
  -> Cliente activo
  -> Recompra / Cross-sell

Alternativa: Perdido / No calificado / Posponer
```

## Lead scoring

El Lead Intelligence Agent podrá proponer una puntuación usando señales como:

- producto visitado;
- profundidad de navegación;
- uso de beta/demo;
- cantidad y tipo de preguntas;
- solicitud de precio;
- solicitud de compra;
- retorno al sitio;
- apertura/clic en seguimiento;
- respuesta a email;
- compatibilidad con buyer persona;
- urgencia expresada.

El scoring orienta prioridades, pero no toma decisiones sensibles de forma autónoma.

## Sales Concierge / Asistente JoinHook

Chat comercial automático con lenguaje natural y transparente.

Debe poder:

- identificar qué busca el visitante;
- hacer preguntas breves de diagnóstico;
- recomendar el producto/servicio adecuado;
- explicar funcionalidades, estado Beta/MVP y limitaciones;
- informar precios vigentes aprobados;
- responder FAQs;
- ofrecer demo/beta/contacto;
- registrar intención y objeciones;
- escalar a Francisco cuando exista negociación, excepción, alto valor, duda no cubierta o solicitud humana.

No debe:

- hacerse pasar por una persona real;
- inventar descuentos;
- prometer funciones inexistentes;
- cerrar acuerdos fuera de reglas comerciales aprobadas;
- solicitar datos sensibles innecesarios.

## Agentes iniciales

### 1. Growth Orchestrator
Coordina el sistema, consolida recomendaciones y prioriza acciones.

### 2. SEO & Research Agent
Analiza intención de búsqueda, temas, competencia, preguntas y oportunidades orgánicas.

### 3. Content Agent
Transforma oportunidades en briefs, guiones, artículos, carruseles, publicaciones y piezas de campaña.

### 4. Creative / Design Agent
Prepara especificaciones visuales, layouts y prompts para Canva y otras herramientas de diseño.

### 5. Analytics Agent
Analiza tráfico, campañas, embudo, conversiones, contenido y resultados.

### 6. Lead Intelligence Agent
Clasifica y prioriza leads.

### 7. Sales Concierge
Atiende conversaciones de venta y deriva cuando corresponde.

### 8. CRM / Follow-up Agent
Gestiona recordatorios, secuencias y estados del pipeline dentro de reglas preaprobadas.

## Producción gráfica y Canva

El sistema debe convertir cada campaña aprobada en un paquete de producción.

Ejemplo de salida semanal:

```text
Campaña: Control de mermas para pequeños negocios gastronómicos
Objetivo: Leads para CGE
Buyer persona: dueño/a de cafetería pequeña
CTA: Probar Beta

Piezas:
- 1 video YouTube 3-5 min
- 3 Shorts/Reels/TikTok
- 1 carrusel Instagram/LinkedIn
- 2 posts estáticos
- 1 artículo SEO
- 1 email
- 1 pieza de seguimiento comercial
```

Cada pieza debe incluir:

- objetivo;
- plataforma;
- formato y tamaño;
- copy;
- CTA;
- hashtags/keywords cuando corresponda;
- brief visual;
- recursos necesarios;
- variante A/B si tiene sentido;
- enlace UTM/campaign id;
- fecha/hora sugerida;
- estado: borrador, generado, revisar, aprobado, publicado.

Canva podrá usarse como motor de creación/maquetación cuando resulte adecuado. Otras herramientas podrán emplearse para video, imagen, edición o prototipado según cada pieza.

## Flujo semanal deseado

```text
Datos semana anterior
       |
       v
Analytics Agent
       |
       v
Research + Growth
       |
       v
Plan semanal propuesto
       |
       v
Content + Creative
       |
       v
Piezas maquetadas / borradores listos
       |
       v
Notificación a Francisco
       |
       v
VISTO BUENO HUMANO
       |
       +------ aprobado ------> pauta final para publicar
       |
       +------ cambios -------> regenerar / ajustar
```

Objetivo operativo: Francisco recibe en móvil un resumen compacto y las piezas terminadas, revisa, aprueba o solicita cambios, y solo necesita publicar manualmente mientras las APIs/plataformas o la estrategia aconsejen mantener publicación humana.

## Planificación semanal

La planificación debe incluir:

- objetivos comerciales de la semana;
- producto/servicio prioritario;
- buyer persona;
- hipótesis a validar;
- contenido por canal;
- calendario;
- CTA por pieza;
- KPI esperado;
- responsable/agente;
- estado de producción;
- aprobación;
- resultado posterior.

## Métricas prioritarias

Evitar métricas de vanidad como objetivo principal.

Priorizar:

- visitas cualificadas;
- leads;
- tasa visita -> lead;
- chats iniciados;
- leads cualificados;
- solicitudes de demo/beta;
- solicitudes de compra;
- tasa lead -> venta;
- ventas;
- ingresos;
- valor promedio por venta;
- tiempo medio hasta venta;
- fuente de adquisición;
- campaña/content id;
- contenido que genera conversiones;
- objeciones más frecuentes;
- tasa de seguimiento efectivo;
- recompra/cross-sell.

## Trazabilidad de campañas

Toda pieza publicada debe utilizar identificadores/UTM cuando sea posible.

Ejemplo:

```text
source=tiktok
medium=organic
campaign=cge_mermas_2026w34
content=short_02
```

La venta debe poder atribuirse, cuando los datos lo permitan, hasta:

```text
Venta -> Lead -> Sesión/Chat -> Pieza -> Campaña -> Canal
```

## Herramientas candidatas costo $0

- JoinHook.cl: web/landing/PWA.
- Supabase/PostgreSQL: datos y eventos.
- n8n Community self-hosted: orquestación interna.
- CRM gratuito o módulo interno ligero en una fase posterior.
- Gmail/Brevo: comunicación y secuencias según límites vigentes.
- Google Search Console: SEO.
- Analytics/alternativa privacy-friendly según necesidad.
- Looker Studio o JoinHook Command: dashboards.
- Canva: producción gráfica.
- GitHub: código, documentación y trazabilidad.

Las herramientas finales deben revisarse por costo, límites, licencia, seguridad y riesgo de lock-in antes de adoptarlas.

## Publicación automática

Fase inicial: NO publicar automáticamente en redes.

Los agentes pueden:

- investigar;
- proponer;
- redactar;
- diseñar/maquetar;
- generar assets;
- preparar la pauta;
- programar sugerencias;
- medir resultados.

Francisco mantiene el visto bueno final y la publicación manual.

La automatización de publicación podrá evaluarse en una fase posterior por plataforma, respetando APIs y términos de servicio.

## Cadencia de notificaciones

La app privada debe reducir ruido.

Notificar principalmente cuando:

- está listo el plan semanal para aprobación;
- hay piezas listas para revisar;
- aparece un lead de alta intención;
- existe una negociación que requiere decisión;
- una campaña supera significativamente el rendimiento esperado;
- una campaña falla significativamente;
- hay una integración caída;
- existe riesgo de pérdida de lead por falta de seguimiento;
- se detecta una oportunidad comercial relevante.

El resto debe quedar resumido en dashboard.

## Fases de implementación

### Fase 0 — No frenar lanzamiento actual
Publicar JoinHook V2 + CGE Beta y mantener feature freeze del lanzamiento.

### Fase 1 — Instrumentación
- eventos web;
- UTMs;
- fuentes;
- funnel básico;
- base comercial central.

### Fase 2 — Captación y CRM
- formularios;
- leads;
- pipeline;
- historial;
- seguimiento.

### Fase 3 — Chat comercial
- Sales Concierge;
- FAQs/product knowledge;
- lead capture;
- escalation.

### Fase 4 — n8n / Automation
- workflows;
- seguimientos;
- alertas;
- consolidación de métricas;
- campañas.

### Fase 5 — Content & Creative Engine
- planificación semanal;
- generación de briefs;
- copy;
- piezas Canva;
- calendario;
- aprobación humana.

### Fase 6 — Analytics & Learning
- atribución;
- rendimiento por contenido;
- buyer personas basadas en datos;
- recomendaciones.

### Fase 7 — JoinHook Command
- PWA privada móvil;
- resumen comercial;
- aprobaciones;
- alertas;
- estado agentes;
- estado campañas;
- ventas.

## Resultado objetivo

El sistema debe permitir que JoinHook opere un ciclo continuo:

```text
INVESTIGAR
  -> PLANIFICAR
  -> CREAR
  -> APROBAR
  -> PUBLICAR
  -> CAPTAR
  -> CONVERSAR
  -> VENDER
  -> MEDIR
  -> APRENDER
  -> MEJORAR
```

La prioridad no es automatizar por automatizar. La prioridad es aumentar la capacidad de JoinHook para conseguir clientes y ventas con datos confiables, bajo costo operativo y control humano claro.