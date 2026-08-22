# Decisión 2026-08-22 — Pagos y roadmap de productos

## Mercado Pago

Para el soft launch de JoinHook y Control Gastronómico Express se mantiene temporalmente el Link de Pago oficial ya configurado.

Razón: minimiza complejidad y riesgo operativo durante las primeras ventas.

La siguiente evolución recomendada, antes de automatizar entrega, conciliación y Revenue Intelligence, es migrar a Mercado Pago Checkout Pro mediante Preferences API, con `external_reference`, `back_urls`, credenciales de producción y Webhooks validados server-side. No construir esta integración de pagos como una app de Mercado Libre: Mercado Libre y Mercado Pago deben tratarse como unidades de integración separadas.

## SnowWise — prioridad inmediata

SnowWise pasa a ser el siguiente producto con prioridad de salida rápida. Antes del lanzamiento se debe cerrar el gap de lista/checklist personal de equipamiento:

- catálogo base amplio por actividad y condiciones;
- permitir al usuario marcar, desmarcar y guardar su lista;
- permitir agregar elementos manualmente cuando no existan en el catálogo;
- permitir editar/eliminar los elementos personales;
- distinguir equipamiento obligatorio, recomendado y opcional;
- separar este checklist personal del comparador comercial de equipamiento;
- considerar plantillas por ski, snowboard, travesía, familia/niños y nivel de experiencia;
- preparar persistencia por usuario y futura operación offline.

## JoinOps

Continuar JoinOps como plataforma operacional hiperconectada, con trazabilidad transversal y una arquitectura de datos orientada a eventos. Mantener fuentes de verdad operacionales por dominio, Audit Ledger, IDs correlacionables, versionado, linaje, observabilidad y modelos analíticos derivados. Evitar convertir n8n en fuente de verdad.

La línea Big Data debe construirse como consecuencia de datos operacionales confiables y trazables, no como almacenamiento indiscriminado.

## Microproductos y conocimiento regional

Crear una familia de microproductos sobre una plataforma de conocimiento centralizada para empresas y profesionales, comenzando por La Araucanía y luego escalando por región.

Dominios iniciales:
- turismo;
- gastronomía;
- legislación y cumplimiento;
- RR.HH.;
- capacitaciones;
- información empresarial regional.

Principios de arquitectura:
- fuente y procedencia obligatorias;
- fecha de vigencia y versionado;
- dimensión geográfica explícita (país, región, comuna, destino);
- taxonomía/ontología común;
- contenido estructurado + documentos fuente;
- API/RAG sobre contenido aprobado;
- separar información pública, editorial y privada;
- reutilizar el mismo núcleo de identidad, búsqueda, analítica, permisos y agentes.

## Estrategia de portafolio

Prioridad operativa:
1. cerrar soft launch de JoinHook/CGE;
2. preparar SnowWise para lanzamiento rápido;
3. continuar núcleo y trazabilidad de JoinOps;
4. diseñar plataforma común de conocimiento regional;
5. lanzar microproductos verticales sobre esa plataforma, evitando silos técnicos.