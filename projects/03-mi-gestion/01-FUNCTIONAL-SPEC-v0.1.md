# Mi Gestión Admin — Especificación funcional v0.1

**Fecha:** 2026-09-18  
**Estado:** DISEÑADO — base para implementación  
**Repositorio:** fjcamp/joinhook  
**Rama:** mga/foundation-2026-09-18

## 1. Alcance

MGA es una aplicación personal de gestión profesional para un administrador o encargado dentro de una empresa. El MVP no es un ERP ni un sistema multiusuario.

## 2. Modelo funcional

Propósito → Responsabilidad → Capacidad → Proceso → Ejecución → Resultado → Control → Decisión → Aprendizaje → Mejora.

El modelo debe permitir que una actividad operativa quede relacionada con el contexto que le da sentido, sin obligar al usuario a completar toda la cadena para cada registro.

## 3. Núcleo MVP

### Usuario / Perfil
Representa al único usuario de la instancia y su contexto profesional.

Datos mínimos:
- nombre;
- cargo;
- empresa;
- descripción del rol;
- objetivos;
- preferencias de gestión;
- configuración.

### Responsabilidad
Resultado o ámbito que el usuario declara que debe gestionar.

Campos:
- título;
- descripción;
- prioridad;
- estado;
- objetivo relacionado opcional.

### Capacidad
Competencia, recurso o capacidad necesaria para cumplir una responsabilidad.

Campos:
- nombre;
- descripción;
- nivel opcional;
- responsabilidades relacionadas.

### Proceso
Flujo de trabajo que el usuario ejecuta recurrentemente.

Campos:
- nombre;
- descripción;
- frecuencia opcional;
- estado;
- pasos/responsabilidades relacionadas.

### Objetivo
Resultado que el usuario pretende alcanzar.

Campos:
- título;
- descripción;
- periodo;
- estado;
- indicador opcional.

### Tarea
Unidad concreta de ejecución.

Campos:
- título;
- descripción;
- estado;
- prioridad;
- vencimiento;
- proceso opcional;
- responsabilidad opcional;
- objetivo opcional;
- resultado esperado;
- notas.

### Resultado
Registro de lo producido por una tarea o proceso.

Campos:
- descripción;
- fecha;
- estado;
- evidencia/referencia opcional;
- tarea/proceso relacionado.

### Control / Indicador
Mecanismo para comprobar el estado de una gestión.

Campos:
- nombre;
- definición;
- unidad;
- valor;
- objetivo opcional;
- periodo;
- fuente;
- fecha de medición.

### Decisión
Registro de una decisión relevante.

Campos:
- asunto;
- contexto;
- decisión;
- fecha;
- fundamento;
- resultado esperado;
- estado.

### Aprendizaje
Conocimiento derivado de experiencia, resultado o decisión.

Campos:
- título;
- contenido;
- origen;
- fecha;
- aplicabilidad;
- proceso/responsabilidad relacionada opcional.

### Mejora
Cambio propuesto o aplicado a un proceso, responsabilidad o forma de trabajo.

Campos:
- título;
- problema;
- cambio propuesto;
- estado;
- resultado esperado;
- resultado observado;
- fecha.

## 4. Regla de simplificación

Las relaciones opcionales son deliberadas. El usuario debe poder crear una tarea rápidamente sin completar todo el modelo estratégico.

El sistema puede sugerir relaciones posteriormente, incluida IA, pero no debe bloquear la operación básica.

## 5. Estados

Los estados deberán ser enums controlados y extensibles, evitando strings libres para estados críticos.

Tarea inicial:
- pendiente
- en_progreso
- bloqueada
- completada
- cancelada

Objetivo:
- activo
- pausado
- logrado
- abandonado

Proceso:
- activo
- pausado
- archivado

## 6. Auditoría

Las mutaciones relevantes deben poder reconstruirse. El MVP debe registrar como mínimo:
- entidad;
- operación;
- fecha/hora;
- usuario/actor;
- identificador de registro;
- resultado de la operación.

## 7. Provenance

Los datos utilizados posteriormente por IA deben distinguir, cuando aplique:
- user_input;
- system_record;
- external_source;
- ai_inference.

Una inferencia nunca debe persistirse como hecho confirmado sin marcar su naturaleza.

## 8. Agent Core

El Agent Core queda fuera del primer núcleo CRUD, pero el modelo debe dejar puntos claros de integración.

Debe poder:
- leer contexto autorizado;
- consultar registros;
- proponer relaciones;
- detectar pendientes;
- resumir;
- sugerir controles/mejoras.

Las acciones externas requieren permisos y confirmación cuando sean relevantes o irreversibles.

## 9. Integraciones

Fuera del MVP inicial salvo que el repositorio real demuestre otra cosa:
- Gmail/Outlook;
- Drive/OneDrive;
- Notion;
- Calendar.

Se implementarán mediante adaptadores, nunca mezclando lógica de proveedor con dominio.

## 10. Offline/local-first

El núcleo funcional debe poder operar sin depender permanentemente de un proveedor cloud. La sincronización es una capacidad adicional.

## 11. No objetivos del MVP

- multiempresa;
- multiusuario;
- nómina;
- contabilidad;
- POS;
- inventario empresarial;
- CRM completo;
- ERP;
- automatizaciones irreversibles autónomas.

## 12. Criterio de aceptación funcional

El primer incremento debe permitir:
1. configurar perfil y contexto profesional;
2. crear responsabilidades;
3. crear objetivos;
4. crear procesos;
5. crear tareas;
6. completar tareas;
7. registrar resultados;
8. registrar controles/indicadores;
9. consultar actividad y pendientes;
10. exportar datos;
11. auditar cambios básicos.

