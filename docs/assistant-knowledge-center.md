# Centro de Conocimiento — Asistente JoinHook

## Objetivo

Mantener una fuente privada, revisable y ampliable para alimentar al asistente web con información útil para clientes sin mezclarla con secretos técnicos, credenciales ni documentación interna sensible.

## Fuente editorial

La fuente editorial inicial será una carpeta privada de Google Drive bajo el espacio JoinHook:

- `Asistente_IA_Conocimiento/`
  - `01_Productos_y_Herramientas/`
  - `02_FAQ_Usabilidad_y_Soporte/`
  - `03_Ventas_Beneficios_y_Comparativas/`
  - `04_Politicas_Contactos_y_Derivacion/`
  - `90_Pendiente_de_Revision/`
  - `99_PRIVADO_NO_INGESTAR/`

### Regla de publicación

Solo las carpetas `01` a `04` son elegibles para alimentar al asistente.

`90_Pendiente_de_Revision` sirve como bandeja de entrada para material que aún debe ser validado antes de publicarse en la base de conocimiento.

`99_PRIVADO_NO_INGESTAR` queda explícitamente excluida de cualquier flujo automático y puede contener material técnico o administrativo que nunca debe exponerse al asistente público.

## Qué documentación conviene cargar

- descripción funcional de cada herramienta;
- beneficios y casos de uso;
- preguntas frecuentes;
- pasos de uso permitidos para clientes;
- precios y condiciones comerciales vigentes;
- políticas de soporte y derivación;
- correos y canales oficiales;
- limitaciones conocidas que sea correcto comunicar públicamente;
- comparativas aprobadas y argumentos comerciales verificables.

## Qué no debe ingresar a la base pública

- contraseñas, tokens o API keys;
- credenciales de hosting, cPanel, GitHub, correo o proveedores;
- prompts internos del agente;
- código fuente privado;
- arquitectura de seguridad interna;
- rutas administrativas sensibles;
- datos personales de clientes;
- información tributaria o contractual no destinada al público;
- documentación clasificada como `NO_INGESTAR`.

## Flujo objetivo de ingestión

1. El administrador sube o actualiza un documento en Google Drive.
2. n8n observa únicamente las carpetas aprobadas `01` a `04`.
3. El flujo extrae texto y metadatos.
4. Se rechazan archivos con etiquetas o rutas privadas.
5. El contenido se divide en fragmentos con fuente, fecha y versión.
6. Los fragmentos se indexan en una base de conocimiento consultable por el asistente.
7. El asistente recupera solo el contexto necesario para cada pregunta.
8. La IA redacta una respuesta natural usando el contexto autorizado.
9. Consultas comerciales o de soporte pueden generar un lead para `ventas@joinhook.cl` o una derivación a `soporte@joinhook.cl`.
10. Intentos de extracción de secretos, prompt injection o información fuera de alcance activan guardrails y no recuperan documentación privada.

## Principio de conversación

La seguridad debe ser silenciosa mientras no sea necesaria. La bienvenida y las respuestas normales deben enfocarse en ayudar al cliente, explicar usabilidad y beneficios y guiarlo hacia una decisión. Los límites de seguridad se explican solamente cuando el usuario intenta solicitar información restringida o manipular al asistente para obtenerla.

## Estado

- [x] Asistente web inicial disponible.
- [x] Guardrails contextuales básicos.
- [x] Endpoint de leads preparado para webhook n8n.
- [x] Estructura de Google Drive creada.
- [ ] Automatizar lectura de Drive con n8n.
- [ ] Implementar extracción y versionado de documentos.
- [ ] Implementar índice semántico/RAG.
- [ ] Conectar modelo generativo al asistente.
- [ ] Añadir trazabilidad de fuentes y fecha de actualización.
- [ ] Añadir panel administrativo de estado de documentos y sincronización.
