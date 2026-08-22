# Plataforma de Conocimiento Empresarial Regional — concepto

## Propósito
Crear una base común de información empresarial confiable, trazable y actualizable que permita lanzar microproductos especializados por industria y territorio sin duplicar infraestructura ni conocimiento.

## Territorio inicial
La Araucanía, Chile.

Escalabilidad geográfica prevista:
`país → región → provincia → comuna → destino/área operacional`.

## Verticales iniciales
- Turismo y hospitalidad.
- Gastronomía.
- Legislación y compliance.
- Recursos Humanos.
- Capacitación y desarrollo de personas.
- Información empresarial y operacional regional.

## Modelo de conocimiento
Cada unidad de conocimiento debe poder registrar:
- fuente oficial o editorial;
- URL/documento fuente;
- organismo/emisor;
- fecha de publicación;
- fecha de vigencia desde/hasta;
- territorio aplicable;
- industria/vertical;
- temas y entidades relacionadas;
- versión;
- estado: borrador, revisado, aprobado, obsoleto;
- fecha de última verificación;
- responsable/editor;
- nivel de confianza/procedencia.

## Arquitectura
Separar:
1. documentos originales;
2. conocimiento estructurado normalizado;
3. índice de búsqueda/RAG;
4. APIs de consulta;
5. productos/experiencias verticales;
6. analítica de uso y demanda.

Los microproductos deben consumir esta plataforma común mediante APIs/servicios y no copiar bases de información completas en cada producto.

## Casos de uso candidatos
- Guía normativa para pequeños negocios turísticos/gastronómicos.
- Calendario de obligaciones y vigencias.
- Centro de capacitación por rol/industria.
- Directorio inteligente de servicios y proveedores regionales.
- Radar de oportunidades, eventos y convocatorias.
- Asistente empresarial regional con RAG aprobado.
- Benchmark operacional y de mercado por territorio.

## Principios
- Regional-first, escalable nacionalmente.
- Procedencia y vigencia obligatorias, especialmente para legislación.
- Privacy-by-design.
- Contenido público/editorial separado de datos privados de clientes.
- Reutilización de identidad, permisos, auditoría, búsqueda, agentes y analítica.
- Eventualmente conectar con JoinOps, JoinHook Revenue Intelligence y productos turísticos sin crear dependencias rígidas.