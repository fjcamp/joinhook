# Registro Maestro de Decisiones y Conversaciones (RMDC)

Este registro es la memoria operativa durable de JoinHook y de sus proyectos. Su objetivo es que una conversación futura pueda retomarse con contexto suficiente sin depender exclusivamente del historial visible del chat.

## Qué debe conservarse

Cada conversación relevante debe transformarse en conocimiento estructurado, con redacción clara y ortografía normalizada, conservando la intención real del usuario.

El registro debe incluir cuando corresponda:

- fecha y hora;
- proyecto/área;
- objetivo de la conversación;
- comentario, solicitud o propuesta del usuario;
- interpretación normalizada;
- decisiones tomadas;
- cambios ejecutados;
- archivos, imágenes, videos y transcripciones utilizados;
- incidentes detectados;
- solución o diagnóstico;
- ideas de producto derivadas;
- pendientes y bloqueos;
- riesgos;
- enlaces a GitHub, Drive, Library, issues, PR y deployments;
- estado actual;
- siguiente paso recomendado;
- etiquetas y relaciones.

## Principio de fidelidad

No corregir el sentido del usuario al mejorar ortografía o redacción. Cuando una frase literal sea importante para una decisión, puede conservarse como cita y añadirse debajo una versión normalizada.

Distinguir siempre:

- **Hecho verificado:** evidencia disponible.
- **Decisión:** elección acordada.
- **Hipótesis:** idea por validar.
- **Propuesta:** alternativa sugerida.
- **Pendiente:** acción aún no ejecutada.
- **Incidente:** fallo observado.
- **Resultado:** consecuencia comprobada.

## Convención de ID

```text
JH-RMDC-YYYYMMDD-NNN
```

Ejemplo:

```text
JH-RMDC-20260822-001
```

Para otros proyectos puede mantenerse el prefijo del proyecto si conviene:

```text
SW-RMDC-...
JO-RMDC-...
```

## Estructura de cada registro

```markdown
# ID — Título

Fecha:
Proyecto:
Áreas:
Estado:

## 1. Contexto

## 2. Solicitud/comentario del usuario

## 3. Interpretación normalizada

## 4. Decisiones

## 5. Trabajo realizado

## 6. Evidencias

## 7. Incidentes y soluciones

## 8. Ideas/productos derivados

## 9. Pendientes

## 10. Siguiente punto de reanudación

## 11. Relaciones

## 12. Etiquetas
```

## Evidencia multimedia

GitHub debe conservar principalmente documentación textual, decisiones, código y referencias. Los archivos pesados o de origen deben mantenerse fuera del repositorio cuando corresponda.

### ChatGPT Library

Ruta adoptada para evidencia persistente:

```text
/Registro_Maestro_Gestion/<Proyecto>/<YYYY-MM-DD>/Evidencias/
```

Usar para:

- capturas;
- videos de errores;
- audios;
- documentos adjuntos;
- transcripciones;
- archivos de prueba relevantes.

### Google Drive

Puede utilizarse como repositorio documental editable o fuente autorizada para RAG/operación. No debe mezclarse documentación privada del proyecto con material que un asistente público pueda ingerir.

## Relación con la Bitácora Técnica

El RMDC no reemplaza la **Bitácora Técnica y Base de Conocimiento**.

- RMDC = qué se conversó, decidió, hizo y quedó pendiente.
- Bitácora Técnica = incidentes reutilizables, causa raíz y solución validada.
- Runbooks = procedimiento operativo repetible.
- Issues = trabajo pendiente o implementación.
- PR/commits = cambios efectivamente incorporados al código.

Una conversación puede generar simultáneamente:

```text
RMDC → Incidente KB → Issue → PR → Deploy → Resultado → actualización RMDC
```

## Protocolo de reanudación

Cuando se retome una conversación o proyecto:

1. buscar primero el registro RMDC más reciente relacionado;
2. revisar decisiones y pendientes;
3. consultar la Bitácora Técnica si existe un error similar;
4. revisar issues/PR/deployment vigentes;
5. recuperar evidencias solo si son necesarias;
6. continuar desde `Siguiente punto de reanudación`.

## Reglas de calidad

- No afirmar que una tarea está terminada sin evidencia.
- No convertir una propuesta en decisión sin aprobación o señal clara del usuario.
- No guardar contraseñas, tokens, secretos o credenciales en estos documentos.
- No copiar conversaciones completas cuando un resumen estructurado preserve mejor el conocimiento.
- Registrar cambios importantes inmediatamente después de validarlos.
- Usar fechas absolutas y nombres de archivos/rutas exactos cuando existan.
- Relacionar incidentes recurrentes con su ID de Bitácora.

## Objetivo final

Que el conocimiento acumulado pueda ser consultado por personas y agentes de JoinHook para disminuir repetición, evitar pérdida de contexto, mejorar decisiones y mantener trazabilidad entre conversación, desarrollo, operación y negocio.