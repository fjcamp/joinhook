# JoinOps — Bitácora Maestra de Continuidad

**Fecha:** 2026-09-11  
**Proyecto:** JoinOps  
**Repositorio:** `fjcamp/joinhook`  
**Propósito:** continuidad entre chats, IA, revisiones humanas y futuras fases de desarrollo.

---

## 0. Regla principal de esta bitácora

Esta bitácora es una **fuente de continuidad arquitectónica**, no un cierre del diseño.

Cada nueva investigación debe:

1. revisar esta bitácora;
2. conservar decisiones ya aprobadas salvo evidencia que justifique cambiarlas;
3. agregar nuevos hallazgos en su categoría correspondiente;
4. evitar contradicciones o duplicación innecesaria;
5. registrar cambios relevantes;
6. distinguir investigación, requisito, decisión y propuesta;
7. respaldar las decisiones importantes en GitHub;
8. mantener una ruta de mejora continua.

**Principio:** investigar → comparar → sintetizar → decidir → documentar → respaldar → validar → mejorar.

---

# 1. Índice de categorías

## A. Arquitectura JoinOps
Kernel, Business Core, Domain Apps, eventos, workflows, permisos, auditoría, configuración, documentos, Feature Flags y migraciones.

## B. Operaciones gastronómicas
POS, Caja, Tesorería operacional, Order Engine, Front of House/Garzón, routing por estaciones, KDS, Bodega, Compras, Recetas, Producción, desperdicios, inventario y trazabilidad.

## C. Finanzas y control
Payment & Settlement Hub, contabilidad, tesorería, impuestos, conciliación, presupuestos, costos, cuentas por cobrar/pagar y control de fondos.

## D. Tributario Chile / SII
DTE, boletas, CAF/folios, autenticación, certificados, consultas, estados, RCV, libros, contingencia, certificación, monitoreo normativo y auditoría.

## E. Migración y Onboarding
Migration & Onboarding Factory, Assistant, Copilot, MIE, Risk Engine, staging, sandbox, mapping, transformación, simulación, reconciliación, cutover y rollback.

## F. Datos
Master Data, Identity Resolution, Product ID, Supplier Mapping, Data Quality, perfiles, duplicados, dependencias y trazabilidad.

## G. Seguridad y cumplimiento
RBAC, MFA, mínimo privilegio, secretos, cifrado, auditoría, segregación de funciones, backups, recuperación, privacidad y controles críticos.

## H. IA y automatización
IA asistida, propuesta/validación/autorización, agentes, n8n CE únicamente para Automation & Agent Orchestration y nunca como fuente de verdad.

## I. UX y asistencia
Interfaces sin scroll, desktop-like, tarjetas/paneles, asistentes paso a paso, ayuda contextual, errores accionables, previews y estados claros.

## J. Integraciones
SII, bancos, medios de pago, APIs, sistemas externos, conectores de bases de datos, archivos, eventos y otros servicios.

## K. JoinHook Foundry
Extraer → generalizar → probar → versionar → certificar → reutilizar.

## L. Mejora continua
KPIs, post-mortems, runbooks vivos, patrones reutilizables, evaluación de migraciones y evolución de arquitectura.

## M. Implementación y desarrollo
Repositorios, ambientes, CI/CD, pruebas, staging, producción, observabilidad y despliegues.

---

# 2. Ruta oficial de investigación y desarrollo

Toda investigación futura debe seguir, cuando corresponda:

`Pregunta → Investigación oficial/primaria → Comparación empresarial → Casos difíciles → Riesgos → Requisito JoinOps → Arquitectura → UX → Seguridad → Pruebas → Documentación → GitHub → Mejora continua`

No copiar SAP, Oracle, Microsoft, Salesforce, AWS u otros sistemas. **Extraer principios probados y adaptarlos a JoinOps.**

---

# 3. Migración empresarial — decisión arquitectónica

JoinOps tendrá una **Migration & Onboarding Factory**, no un simple importador.

Componentes:

1. Migration Projects
2. Customer Discovery
3. Infrastructure Discovery
4. Source Registry
5. Connection Management
6. Data Inventory
7. Data Profiling
8. Data Quality
9. Master Data Management
10. Identity Resolution
11. Migration Objects
12. Dependency Graph
13. Field Mapping
14. Value Mapping
15. Transformation Engine
16. Staging
17. Validation Engine
18. Simulation / Dry Run
19. Correction Queue
20. Migration Waves
21. Trial Migration
22. Reconciliation
23. Cutover Manager
24. Rollback Manager
25. Post-Migration Validation
26. Stabilization
27. Historical Archive
28. Migration Audit Ledger
29. Migration Reports
30. Migration Risk Engine
31. Migration Intelligence Engine
32. Migration Assistant
33. Migration Copilot
34. Customer Migration Portal
35. Migration Knowledge Base

---

# 4. Experiencia del operador de migración

La persona que realiza la migración no debe necesitar conocimientos profundos de ETL, bases de datos o del modelo interno de JoinOps.

Siempre debe saber:

- dónde está;
- qué ya terminó;
- qué falta;
- qué problemas existen;
- qué bloquea;
- por qué bloquea;
- cómo resolverlo;
- qué ocurrirá si continúa;
- quién debe aprobar.

Regla UX: **ningún error sin explicación ni siguiente acción.**

Los errores deben mostrar causa, impacto, severidad, solución recomendada y acción directa.

Severidades:

- 🔴 BLOCKER
- 🟠 REVIEW REQUIRED
- 🟡 WARNING
- 🔵 INFO

Debe existir `Guardar y salir` y reanudación exacta del proyecto.

"No sé" debe ser una opción válida: preguntar al cliente, investigar, dejar pendiente o resolver después.

---

# 5. Migration Assistant + Copilot

El Assistant guía el flujo completo.

El Copilot responde, usando únicamente el contexto y permisos disponibles:

- ¿Por qué no puedo continuar?
- ¿Qué registros tienen problemas?
- ¿Qué significa el error?
- ¿Qué datos faltan?
- ¿Qué pasaría si continúo?
- ¿Qué cambió desde la última simulación?
- ¿Qué histórico queda fuera?
- ¿Cuál es el riesgo actual?

La IA propone; no autoriza operaciones críticas.

`IA → propuesta → reglas → validación → humano → autorización → ejecución → auditoría`

---

# 6. Migration Intelligence Engine

Debe reconocer estructuras, clasificar campos, detectar entidades y relaciones, duplicados, anomalías, obsolescencia, mappings y transformaciones.

Cada propuesta tendrá Confidence Score y explicación.

- 99–100 %: prácticamente seguro.
- 95–98 %: alta confianza.
- 80–94 %: revisión recomendada.
- 60–79 %: revisión humana obligatoria.
- <60 %: no permitir migración automática.

Reconocer una coincidencia **no equivale** a autorizar una fusión.

---

# 7. Staging, Sandbox y seguridad de migración

Nunca cargar datos externos directamente a producción.

`Origen → RAW → STAGING → Transformación → Validación → Sandbox JoinOps → Simulación → Migración de prueba → Reconciliación → Aprobación → Producción`

Debe existir preview de impacto antes de acciones críticas.

Migration Safety Net debe comprobar:

- backup;
- simulación;
- reconciliación;
- permisos;
- ventana de cutover;
- rollback;
- dependencias;
- bloqueadores;
- responsable autorizado.

Para máxima criticidad puede requerirse doble autorización.

---

# 8. Reconciliación y auditoría

La migración debe poder demostrar origen vs destino.

Objetos financieros y operacionales pueden incluir ventas, impuestos, descuentos, devoluciones, pagos, efectivo, tarjetas, transferencias, cuentas por cobrar/pagar, inventario, costos y documentos.

Migration Audit Ledger registra fuente, destino, objeto, registro, mapping, transformación, versión de reglas, usuario, timestamp, validación, decisión, aprobación, ejecución, error y corrección.

Cada migración debe ser versionable y comparable.

---

# 9. Mejora continua

Cada wave y cada proyecto debe alimentar:

- KPIs;
- incidentes;
- causas raíz;
- cambios de runbook;
- reglas reutilizables;
- mejoras de mapping;
- mejoras de validación;
- reducción de esfuerzo;
- aprendizaje operativo.

Las reglas aprendidas nunca deben convertirse automáticamente en reglas globales sin revisión/certificación.

Foundry:

`Extraer → Generalizar → Probar → Versionar → Certificar → Reutilizar.`

---

# 10. Integración SII — requisito arquitectónico

JoinOps debe contar con un **SII Integration Hub**, separado del dominio operativo.

Arquitectura conceptual:

`POS/Compras/Contabilidad/Tesorería → Tax Core → SII Integration Hub → SII`

Componentes previstos:

- Authentication
- Certificate Vault
- CAF/Folio Manager
- DTE Engine
- XML/Schema Engine
- Digital Signature
- DTE Submission Queue
- DTE Status
- DTE Query
- Boletas
- RCV
- Electronic Books
- SII Response Processor
- Tax Reconciliation
- Contingency Manager
- Compliance Monitor
- Health Monitor
- Audit Ledger
- SII Assistant

---

# 11. SII — seguridad y autenticación

La implementación debe seguir los mecanismos oficiales del SII y no asumir una única API genérica.

Cuando corresponda al servicio utilizado, el flujo de autenticación documentado por SII contempla semilla, firma con certificado, envío, validación y token. La semilla tiene una ventana temporal limitada, por lo que debe tratarse como credencial efímera.

Certificados y claves privadas deben estar protegidos mediante un Certificate Vault, nunca expuestos en frontend, código, logs o tablas ordinarias.

El sistema debe registrar vencimiento, huella, RUT asociado, ambiente, permisos y auditoría sin exponer material secreto.

---

# 12. SII — CAF y folios

CAF/Folio Manager debe controlar:

- tipo de DTE;
- rango;
- folio disponible;
- reservado;
- utilizado;
- anulado;
- agotado;
- autorización;
- relación DTE ↔ folio ↔ CAF.

Debe existir control de concurrencia e idempotencia.

---

# 13. SII — DTE Engine

No conectar directamente POS → SII.

Flujo:

`Operación → Order Engine → Tax Engine → DTE Engine → Queue → SII → respuesta → reconciliación → estado final`

Debe manejar reintentos, timeout, respuestas tardías, rechazos, errores de XML, problemas de certificado y conectividad sin duplicar emisiones.

---

# 14. SII — asistencia al operador

Configuración SII debe ser un wizard paso a paso:

`Diagnóstico → Identificación contribuyente → Certificado → Ambiente → Autenticación → CAF/Folios → Pruebas DTE → Pruebas boleta → Consultas → RCV/libros según alcance → Certificación → Producción → Monitoreo`

Cada error debe distinguir:

1. mensaje oficial;
2. interpretación técnica de JoinOps;
3. acción recomendada.

No inventar causas tributarias.

---

# 15. SII — certificación y cambio normativo

Debe existir separación de ambientes de certificación y producción.

Todo cambio relevante de SII debe pasar por:

`Cambio detectado → Impact Analysis → desarrollo → pruebas → certificación → checklist → release → monitoreo`

El sistema debe vigilar cambios técnicos/normativos del SII y no mantener reglas tributarias críticas únicamente como constantes enterradas en código.

---

# 16. SII — contingencia

Contingency Manager debe identificar si el incidente proviene de:

- JoinOps;
- Internet;
- SII;
- certificado;
- folios/CAF;
- XML;
- configuración;
- POS;
- servicio externo.

Las acciones de contingencia deben ajustarse a la normativa y documentación oficial vigente.

---

# 17. Migración + SII

No confundir migración histórica con emisión tributaria.

`Histórico antiguo → preservar/reconciliar/documentar`

No se debe asumir que documentos históricos deben ser reemitidos automáticamente al SII.

Las nuevas operaciones deben seguir:

`Operación nueva → Tax Engine → DTE → SII`

Las reglas exactas deben validarse contra la normativa vigente y el caso tributario de cada cliente.

---

# 18. Investigación empresarial de referencia

La investigación realizada hasta ahora identificó patrones de:

- SAP: proyectos, objetos, staging, mapping, simulación y corrección.
- Oracle: interface/staging tables, cargas estructuradas, importación, errores y reintentos.
- Microsoft: discovery, assessment, dependencias, waves, cutover, rollback y estabilización.
- Salesforce: wizard, mapping y matching.
- AWS: Migration Factory, waves, validación, cutover y mejora de runbooks.

Principio: **usar estas plataformas como fuentes de patrones, no como modelos a copiar.**

---

# 19. Documentos de continuidad relacionados

- `CONTINUITY-2026-09-11-BODEGA-ABASTECIMIENTO.md`
- `CONTINUITY-2026-09-11-MIGRATION-INTELLIGENCE.md`
- `INTEGRATIONS-SII-CHILE-2026-09-11.md`
- Este documento: `CONTINUITY-2026-09-11-BITACORA-MAESTRA-MIGRACION-SII.md`

---

# 20. Pauta obligatoria para la siguiente IA/revisor

Al retomar este trabajo:

### Paso 1 — Leer esta bitácora
No comenzar desde cero.

### Paso 2 — Identificar categoría
Clasificar la nueva petición en A–M.

### Paso 3 — Revisar documentos relacionados
No duplicar requisitos existentes.

### Paso 4 — Investigar fuentes primarias
Para SII, priorizar SII. Para plataformas empresariales, priorizar documentación oficial del fabricante.

### Paso 5 — Buscar casos difíciles
No quedarse en el happy path.

### Paso 6 — Evaluar seguridad
Preguntar qué puede fallar, qué puede duplicarse, qué puede quedar inconsistente y cómo se revierte.

### Paso 7 — Diseñar asistencia
Preguntar qué verá el operador, qué debe decidir y cómo se le explica el problema.

### Paso 8 — Definir estados y dependencias
No diseñar solamente pantallas.

### Paso 9 — Definir auditoría
Todo evento crítico debe poder reconstruirse.

### Paso 10 — Definir pruebas
Unitarias, integración, contract tests, sandbox, certificación, regresión, carga y contingencia según corresponda.

### Paso 11 — Documentar decisión
Separar claramente:

- HECHO / VERIFICADO
- REQUISITO
- DECISIÓN
- PROPUESTA
- PENDIENTE
- HIPÓTESIS

### Paso 12 — Respaldar
Toda decisión arquitectónica relevante debe quedar en GitHub.

### Paso 13 — Mejora continua
Preguntar: ¿qué aprendimos?, ¿qué puede reutilizarse?, ¿qué riesgo sigue abierto?, ¿qué documentación debe actualizarse?

---

# 21. Regla de no contradicción

Si una investigación futura encuentra una alternativa mejor:

1. no sobrescribir silenciosamente;
2. identificar el requisito anterior;
3. explicar la nueva evidencia;
4. comparar impacto;
5. decidir explícitamente;
6. actualizar la documentación;
7. registrar la decisión y fecha.

---

# 22. Estado actual

**Migration & Onboarding:** requisito arquitectónico definido; investigación continua.

**Migration Assistant/Copilot:** definido conceptualmente; pendiente diseño detallado y posterior implementación.

**SII Integration Hub:** requisito arquitectónico definido; pendiente matriz exhaustiva de servicios, contratos técnicos, certificación y pruebas.

**SII:** no considerar cerrado hasta completar investigación servicio por servicio y validación contra documentación vigente.

**Producción:** no implementar integraciones tributarias críticas sin certificación, pruebas y revisión de seguridad.

---

# 23. Principio rector

> **JoinOps debe hacer que una operación empresarial compleja sea técnicamente rigurosa sin obligar al usuario a convertirse en especialista técnico. El sistema debe acompañar, explicar, validar, proteger, auditar y mejorar continuamente.**
