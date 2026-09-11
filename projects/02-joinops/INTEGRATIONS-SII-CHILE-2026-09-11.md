# JoinOps — Integración con Servicio de Impuestos Internos (SII) Chile

**Fecha:** 2026-09-11  
**Proyecto:** JoinOps  
**Categorías:** Integraciones / Fiscal-Tributario / Seguridad / Facturación Electrónica / Tesorería / Contabilidad / Asistencia / Mejora Continua  
**Estado:** Investigación profunda — requisito arquitectónico  
**Prioridad:** CRÍTICA

---

## 0. Objetivo

JoinOps debe incorporar una integración nativa, segura, auditable y asistida con el Servicio de Impuestos Internos de Chile (SII), evitando tratarla como una simple API aislada.

La integración debe cubrir, según las capacidades y autorizaciones efectivamente disponibles para cada contribuyente y servicio del SII:

- autenticación y gestión segura de credenciales/certificados;
- emisión y envío de Documentos Tributarios Electrónicos (DTE);
- boletas electrónicas cuando corresponda;
- consulta de estado de envíos;
- consulta/validación de DTE;
- recepción y almacenamiento de respuestas del SII;
- control de folios y CAF;
- Registro de Compras y Ventas (RCV), cuando exista interfaz/autorización aplicable;
- consulta y conciliación de información tributaria disponible;
- aceptación/reclamo de DTE cuando corresponda;
- libros electrónicos cuando corresponda;
- preparación para futuras APIs oficiales que el SII habilite;
- monitoreo de cambios normativos y técnicos.

No asumir que todos los servicios del SII usan la misma tecnología, autenticación o autorización. Cada integración debe declararse como un adaptador/servicio independiente y verificarse contra documentación oficial vigente.

---

# 1. Investigación oficial realizada

La documentación oficial del SII confirma que el sistema de facturación de mercado contempla desarrollo propio o soluciones de mercado y ofrece ambiente de certificación/prueba. Para determinados servicios se requiere ser facturador electrónico y contar con certificado digital. El propio SII publica funciones de envío de DTE/libros, consulta de estado de envíos, historia de envíos, timbraje y consulta de documentos. [SII: Sistema de facturación de mercado]

La autenticación automática tradicional para Web Services utiliza un flujo de semilla y token: se solicita una semilla, el contribuyente la firma con certificado digital, el SII valida la firma y entrega un token temporal. La documentación del SII indica que la semilla tiene un timeout de 2 minutos. [SII: WS de Autenticación con Certificado Digital]

Para DTE, el SII utiliza XML y firma electrónica. La documentación técnica establece el uso del CAF, folios autorizados, timbre electrónico, firma del documento y estructuras XML definidas por el SII. [SII: Instructivo Técnico Factura Electrónica]

La documentación oficial indica además que el CAF y la llave privada asociada al timbraje deben ser protegidos contra acceso no autorizado. [SII: Instructivo Técnico Factura Electrónica]

El SII dispone de ambiente de certificación y prueba para soluciones propias/de mercado. Para boletas electrónicas existen procesos específicos de set de pruebas, CAF, envío, reporte de consumo de folios y revisión/certificación. [SII: Certificación Boletas Electrónicas]

La documentación publicada también muestra que existen servicios específicos de consulta/registro de aceptación o reclamo de DTE mediante Web Service autenticado con certificado digital. [SII: Web Service Registro Reclamo DTE]

La normativa y los servicios del SII evolucionan. En septiembre de 2026 el SII publicó, entre otras, una resolución que implementa nuevas validaciones aplicables a archivos de DTE en procesos de facturación electrónica. Por ello JoinOps debe tener monitoreo normativo/técnico permanente y no codificar reglas tributarias como constantes inmóviles.

---

# 2. Principio arquitectónico

**SII no será una sola integración.**

Será un **SII Integration Hub** dentro de JoinOps.

```text
JoinOps
  |
  +-- SII Integration Hub
       |
       +-- Authentication Adapter
       +-- Certificate Manager
       +-- CAF / Folio Manager
       +-- DTE Generator
       +-- DTE Signer
       +-- DTE Sender
       +-- DTE Status Service
       +-- DTE Query Service
       +-- Boleta Service
       +-- RCV Adapter
       +-- Acceptance / Rejection Adapter
       +-- Electronic Books Adapter
       +-- Tax Data Adapter
       +-- SII Response Processor
       +-- Reconciliation Engine
       +-- SII Compliance Monitor
       +-- SII Health Monitor
       +-- SII Audit Ledger
       +-- SII Assistant
```

El resto de JoinOps no debe depender directamente de endpoints SII. Debe comunicarse con un contrato interno estable.

---

# 3. Modelo de integración desacoplado

```text
POS / Sales / Purchases / Finance / Treasury / Accounting
                    |
                    v
             JoinOps Tax Core
                    |
                    v
             SII Integration Hub
                    |
          +---------+---------+
          |                   |
       SII APIs/WS       SII Portal flows
          |                   |
          +---------+---------+
                    |
                    v
                 SII
```

Regla: la lógica tributaria y contable interna no debe quedar acoplada al transporte SOAP/REST/XML utilizado por una versión concreta del SII.

---

# 4. Autenticación

El flujo debe soportar los mecanismos oficiales requeridos por cada servicio.

Para los Web Services que utilicen el mecanismo tradicional documentado por el SII:

```text
1. Solicitar semilla
2. Recibir semilla
3. Firmar semilla con certificado autorizado
4. Enviar semilla firmada
5. Recibir token
6. Mantener token de forma segura y temporal
7. Consumir servicio autorizado
8. Renovar cuando corresponda
9. Invalidar/descartar secretos temporales
```

No guardar tokens en frontend, URL, logs ni tablas de negocio.

La semilla tiene una ventana temporal corta; por lo tanto el proceso debe ser transaccional y tolerante a expiración.

---

# 5. Certificado Digital

JoinOps debe separar:

- identidad del contribuyente;
- identidad del firmante;
- certificado digital;
- autorización del usuario;
- permisos JoinOps;
- permisos ante SII.

El certificado no debe tratarse como una contraseña común.

Debe existir un **Certificate Vault**:

```text
Certificate Vault
  |
  +-- certificate metadata
  +-- expiration
  +-- issuer
  +-- fingerprint
  +-- authorized taxpayer
  +-- usage policy
  +-- encrypted private material, when technically required
  +-- access audit
```

La clave privada nunca debe aparecer en logs ni ser entregada a módulos que no necesitan firmar.

Preferir, cuando la arquitectura/servicio lo permita, un componente de firma aislado y de mínimo privilegio.

---

# 6. CAF y Folios

El CAF debe tener módulo propio.

Debe controlar:

- RUT emisor;
- tipo de DTE;
- rango inicial;
- rango final;
- folios disponibles;
- folios utilizados;
- folios anulados;
- folios reservados;
- fecha de autorización;
- estado;
- archivo CAF;
- integridad;
- relación con documentos emitidos.

No permitir reutilización accidental de folios.

Debe existir bloqueo transaccional/concurrencia para asignación de folios.

```text
CAF
  -> Tipo DTE
  -> Rango
  -> Folio reservado
  -> DTE generado
  -> DTE firmado
  -> DTE enviado
  -> respuesta SII
  -> estado final
```

El sistema debe alertar sobre rangos antiguos, agotamiento, inconsistencias y folios sin trazabilidad.

La documentación oficial también contiene validaciones relacionadas con antigüedad de CAF; por ello la política de gestión de folios debe ser parametrizable y mantenerse alineada con la normativa vigente.

---

# 7. DTE Engine

No permitir que POS construya directamente XML tributario.

Debe existir:

**Commercial Document → Tax Document → DTE XML → Signature → Submission**

El DTE Engine debe manejar:

- tipos de DTE;
- folio;
- emisor;
- receptor;
- fecha;
- líneas;
- descuentos;
- recargos;
- impuestos;
- totales;
- referencias;
- medios de pago cuando correspondan;
- timbre electrónico;
- firma XML;
- representación tributaria;
- estados.

La estructura XML debe estar versionada según los schemas/documentación oficial aplicable.

---

# 8. Separar documento comercial y documento tributario

Esto es crítico.

```text
Order
  -> Invoice/Receipt business document
      -> Tax determination
          -> DTE
              -> SII
```

Una orden puede existir antes del DTE.

Un DTE puede ser rechazado por SII sin que necesariamente deba destruirse la operación comercial original.

Por eso deben coexistir:

- estado comercial;
- estado contable;
- estado tributario;
- estado SII.

---

# 9. Estados tributarios

Ejemplo:

```text
DRAFT
  -> READY
  -> SIGNED
  -> QUEUED
  -> SENT
  -> TRACK_ID_RECEIVED
  -> PROCESSING
  -> ACCEPTED
  -> ACCEPTED_WITH_WARNINGS
  -> REJECTED
  -> RETRY_REQUIRED
  -> CANCELLED
```

Los estados reales deben modelarse según las respuestas/documentación vigente del SII y no inventarse como sustituto de estados oficiales.

---

# 10. Idempotencia

Una de las reglas de mayor prioridad.

Si una solicitud se repite por timeout, caída de red o reintento, JoinOps debe evitar duplicar una operación tributaria.

Usar claves de idempotencia internas y una correlación robusta con:

- tenant;
- RUT;
- tipo DTE;
- folio;
- hash del XML;
- identificador de envío/track cuando exista;
- estado SII.

Nunca asumir que "timeout = no enviado".

Primero consultar/confirmar estado cuando el servicio lo permita.

---

# 11. Cola tributaria

SII debe funcionar mediante un **Tax Submission Queue**.

```text
DTE listo
  -> Queue
  -> Preflight validation
  -> Signature
  -> Send
  -> Track
  -> Poll/query
  -> Process response
  -> Reconcile
```

Esto evita que un problema momentáneo de SII bloquee POS o ventas.

El POS debe poder seguir operando según las reglas tributarias y contingencia que correspondan.

---

# 12. Preflight Validator

Antes de enviar un DTE al SII, JoinOps debe revisar:

- RUT;
- tipo DTE;
- folio;
- CAF;
- fechas;
- totales;
- impuestos;
- referencias;
- estructura XML;
- schema aplicable;
- firma;
- datos obligatorios;
- consistencia aritmética;
- configuración tributaria;
- estado del contribuyente según datos disponibles;
- reglas vigentes.

El objetivo es evitar rechazos previsibles.

---

# 13. SII Response Processor

Toda respuesta SII debe ser persistida como evidencia técnica.

Registrar:

- request ID interno;
- timestamp;
- endpoint/servicio lógico;
- ambiente;
- RUT;
- tipo DTE;
- folio;
- hash de payload;
- respuesta técnica;
- código/mensaje oficial;
- track ID cuando exista;
- estado interpretado;
- regla que procesó la respuesta;
- acción recomendada.

No exponer certificados, claves, tokens ni datos secretos en mensajes de error.

---

# 14. Reintentos inteligentes

No hacer reintentos ciegos.

Clasificar:

- error transitorio;
- timeout;
- servicio no disponible;
- error de autenticación;
- error de certificado;
- rechazo tributario;
- XML inválido;
- folio inválido;
- configuración incorrecta;
- error definitivo.

Sólo los errores reintentables deben entrar en retry policy.

Usar backoff y límites.

---

# 15. Modo asistido

El operador no debería interpretar por sí mismo los errores SII.

Ejemplo:

> 🔴 DTE rechazado
>
> **Qué ocurrió:** el SII rechazó el documento.
>
> **Causa:** regla tributaria/XML no satisfecha.
>
> **Afecta:** Factura F33-10582.
>
> **Acción recomendada:** revisar los campos indicados por la respuesta oficial.
>
> [Ver detalle] [Corregir] [Consultar SII] [Reintentar]

No convertir automáticamente una respuesta ambigua del SII en una explicación falsa. Mostrar mensaje oficial + interpretación de JoinOps claramente separadas.

---

# 16. SII Assistant

Asistente especializado dentro de JoinOps para:

- explicar estados;
- explicar errores;
- indicar siguiente paso;
- mostrar impacto;
- indicar si el problema es JoinOps, configuración, certificado, folio, XML o SII;
- guiar certificación;
- guiar pruebas;
- revisar conectividad;
- preparar evidencias para soporte.

Regla:

**SII Assistant no reemplaza asesoría tributaria ni instrucciones oficiales del SII.**

Cuando exista incertidumbre normativa, debe señalarla y dirigir al material oficial vigente.

---

# 17. Ambiente de certificación y producción

Nunca mezclar credenciales, certificados, CAF ni endpoints entre ambientes.

Modelo:

```text
SII CERTIFICACIÓN
  |
  +-- certificados de prueba
  +-- datos de prueba
  +-- CAF de prueba
  +-- pruebas automatizadas
  +-- certificación

SII PRODUCCIÓN
  |
  +-- credenciales productivas
  +-- certificados productivos
  +-- CAF productivo
  +-- operación real
```

Cada tenant/contribuyente debe tener claramente identificado su ambiente.

---

# 18. Onboarding SII asistido

Al configurar una empresa, JoinOps debe ejecutar un wizard:

### Paso 1 — Identificar contribuyente
RUT, razón social y datos básicos.

### Paso 2 — Determinar régimen/capacidades relevantes
Sin inventar información: consultar/confirmar con fuentes autorizadas.

### Paso 3 — Configurar certificado
Validar vigencia y asociación.

### Paso 4 — Configurar ambiente
Certificación primero cuando corresponda.

### Paso 5 — Probar autenticación
Semilla → firma → token/servicio aplicable.

### Paso 6 — Probar DTE
Generación → firma → envío → consulta → respuesta.

### Paso 7 — Validar folios/CAF

### Paso 8 — Validar boletas, si aplica

### Paso 9 — Validar compras/ventas y otros servicios autorizados

### Paso 10 — Checklist de producción

### Paso 11 — Activación controlada

---

# 19. Health Check SII

Dashboard permanente:

```text
SII CONNECTIVITY       🟢
CERTIFICATE            🟢
AUTHENTICATION         🟢
CAF                    🟢
FOLIOS                 🟡
DTE QUEUE              🟢
DTE ACCEPTANCE         🟢
DTE REJECTIONS         🟡
RCV                    🟢
CERTIFICATION          ✓
NORMATIVE MONITOR      🟢
```

Cada indicador debe poder abrir su diagnóstico.

---

# 20. Contingencia

Diseñar un **SII Contingency Manager**.

Debe distinguir:

- caída de JoinOps;
- caída de conexión del cliente;
- caída del SII;
- error de certificado;
- expiración de certificado;
- agotamiento de folios;
- rechazo tributario;
- problema de impresora/POS;
- pérdida temporal de conectividad.

El sistema debe aplicar las reglas de contingencia permitidas por la normativa vigente y mantener evidencia.

No improvisar procedimientos tributarios de contingencia.

---

# 21. Reconciliación SII ↔ JoinOps

Debe existir un **Tax Reconciliation Engine**.

Comparar cuando corresponda:

- DTE emitidos;
- DTE recibidos;
- folios;
- estados;
- montos netos;
- IVA;
- exentos;
- descuentos;
- documentos anulados;
- notas de crédito;
- notas de débito;
- compras;
- ventas;
- pagos relacionados;
- registros contables.

Objetivo:

```text
JoinOps
   ↕
SII
   ↕
Contabilidad
```

Las diferencias deben generar excepciones explicables.

---

# 22. RCV

El Registro de Compras y Ventas debe ser tratado como dominio propio, no como una simple tabla importada.

Debe modelarse:

- período;
- documento;
- emisor;
- receptor;
- tipo DTE;
- folio;
- fecha;
- montos;
- impuestos;
- estados;
- clasificación;
- origen;
- fecha de última sincronización;
- evidencia de consulta/importación;
- diferencias con contabilidad JoinOps.

La implementación concreta debe utilizar solamente los mecanismos oficiales vigentes y autorizados para el contribuyente.

---

# 23. Aceptación/Reclamo de DTE

Debe existir módulo específico cuando el servicio oficial esté habilitado para el caso.

El flujo debe registrar:

DTE recibido → revisión → aceptación/reclamo → respuesta SII → evidencia → actualización de estado.

Debe existir control de plazos y alertas, sin convertir reglas históricas en constantes: los plazos y condiciones deben ser configurables y mantenidos conforme a normativa vigente.

---

# 24. Seguridad tributaria

Mínimo:

- MFA para operadores;
- RBAC;
- mínimo privilegio;
- separación de funciones;
- cifrado en tránsito/reposo;
- vault de secretos;
- aislamiento de certificados;
- rotación/renovación;
- alertas de expiración;
- auditoría inmutable;
- bloqueo de exportación de claves;
- no registrar secretos en logs;
- acceso temporal;
- aprobación para acciones críticas;
- doble control para operaciones de máximo riesgo.

---

# 25. Multiempresa / Multi-RUT

JoinOps debe ser multi-tenant, pero la identidad tributaria debe ser inequívoca.

```text
Tenant
  -> Organization
      -> Tax Entity
          -> RUT
              -> SII Configuration
                  -> Certificates
                  -> CAFs
                  -> DTE Types
                  -> Environments
```

Nunca reutilizar accidentalmente certificados, CAF o numeración entre RUT distintos.

Una organización puede tener múltiples establecimientos, pero la configuración tributaria debe seguir el modelo oficial aplicable.

---

# 26. Auditoría y evidencia

Cada operación SII debe poder responder:

- quién la inició;
- bajo qué RUT;
- con qué autorización;
- qué documento se generó;
- qué XML fue firmado;
- qué certificado/firma lógica se utilizó, sin exponer secretos;
- qué folio se utilizó;
- qué CAF lo autorizaba;
- qué se envió;
- qué respondió el SII;
- cuándo;
- cuántos reintentos hubo;
- quién corrigió;
- quién aprobó;
- resultado final.

Integrar con el **Operation/Audit Ledger** de JoinOps.

---

# 27. Normative Change Monitor

El SII cambia validaciones, procedimientos, servicios y normativa. En septiembre de 2026 ya existen resoluciones nuevas relacionadas con validaciones de archivos DTE y APIs de servicios específicos.

JoinOps debe tener:

- catálogo de normativa relevante;
- fecha de vigencia;
- fecha de revisión;
- impacto estimado;
- módulos afectados;
- reglas afectadas;
- pruebas requeridas;
- responsable;
- estado de adaptación;
- evidencia de actualización.

Nunca actualizar una regla tributaria directamente en producción sin versionado y pruebas.

---

# 28. Test Suite SII

Automatizar pruebas para:

- autenticación;
- firma;
- XML;
- CAF;
- folios;
- DTE válidos;
- DTE inválidos;
- notas de crédito;
- notas de débito;
- documentos referenciados;
- montos;
- impuestos;
- duplicados;
- timeout;
- reintentos;
- respuestas tardías;
- rechazo SII;
- aceptación;
- caída de servicio;
- expiración de certificado;
- expiración/rotación de credenciales;
- conciliación.

Debe existir ambiente de pruebas separado del productivo.

---

# 29. Integración con Payment & Settlement Hub

El DTE no debe confundirse con el pago.

```text
Order
  -> Tax Document
  -> Payment
  -> Settlement
  -> Accounting
```

Un DTE aceptado por SII no significa que esté pagado.

Un pago confirmado tampoco sustituye el estado tributario.

Payment & Settlement Hub y SII Integration Hub deben comunicarse mediante eventos.

---

# 30. Integración con Accounting

SII debe alimentar evidencia tributaria, pero el Accounting Engine mantiene el modelo contable interno.

Ejemplo:

```text
Venta
 -> DTE
 -> SII
 -> Tax Result
 -> Accounting Event
 -> Journal
 -> Ledger
```

No hacer que la respuesta SII sea la única fuente del asiento contable; debe existir reconciliación entre operación, documento tributario y contabilidad.

---

# 31. Integración con POS

POS debe llamar a servicios de dominio internos, no directamente a SII.

```text
POS
 -> Order Engine
 -> Tax Engine
 -> DTE Engine
 -> SII Queue
```

Así POS puede continuar operando con mayor resiliencia ante latencia o indisponibilidad temporal del servicio externo, sujeto a las reglas tributarias aplicables.

---

# 32. Integración con Compras / Bodega

DTE recibidos pueden alimentar:

- proveedor;
- compra;
- recepción;
- productos;
- lotes;
- inventario;
- cuentas por pagar;
- impuestos;
- documentos.

Pero nunca asumir que una línea tributaria equivale automáticamente a un producto JoinOps. Debe pasar por Product Master / Supplier Product Mapping / Identity Resolution.

---

# 33. Migración desde sistemas anteriores hacia JoinOps + SII

La migración debe distinguir:

1. historial documental;
2. operaciones comerciales;
3. contabilidad;
4. estado tributario;
5. folios;
6. CAF;
7. documentos emitidos;
8. documentos recibidos;
9. RCV;
10. configuración vigente.

No intentar "reemitir" históricamente DTE como si fueran documentos nuevos.

Los documentos históricos deben conservarse como evidencia y relacionarse con sus identificadores originales cuando corresponda.

---

# 34. Regla crítica de migración

**JoinOps no debe asumir que puede importar al SII el histórico de una empresa como nuevos DTE.**

La migración tributaria y la emisión tributaria son procesos diferentes.

Histórico → preservar/reconciliar/documentar.

Operación nueva → generar DTE conforme a reglas vigentes.

---

# 35. Experiencia del operador

El operador debe recibir asistencia permanente:

> **Configuración SII — Paso 4 de 8**
>
> Certificado detectado.
>
> Vigencia: válida.
>
> RUT asociado: coincide.
>
> Ambiente: Certificación.
>
> Siguiente paso: ejecutar prueba de autenticación.
>
> [Ejecutar prueba]

Ante error:

> 🔴 No pudimos autenticar.
>
> La firma de la semilla no fue aceptada.
>
> Revise: certificado, vigencia y asociación al contribuyente.
>
> [Diagnosticar]

El sistema debe indicar qué parte funciona y cuál falla.

---

# 36. Checklist de activación productiva

No activar SII productivo hasta verificar:

- [ ] contribuyente identificado;
- [ ] permisos confirmados;
- [ ] certificado vigente;
- [ ] certificado protegido;
- [ ] ambiente correcto;
- [ ] autenticación probada;
- [ ] XML probado;
- [ ] CAF configurado;
- [ ] folios controlados;
- [ ] DTE de prueba exitoso;
- [ ] consultas probadas;
- [ ] errores probados;
- [ ] cola tributaria operativa;
- [ ] idempotencia probada;
- [ ] reconciliación probada;
- [ ] auditoría funcionando;
- [ ] contingencia documentada;
- [ ] rollback/recuperación preparado;
- [ ] monitoreo activo;
- [ ] responsable autorizado.

---

# 37. Principios de implementación

1. SII Integration Hub desacoplado.
2. No usar scraping cuando exista interfaz oficial apropiada.
3. Priorizar APIs/Web Services/documentación oficial.
4. No almacenar secretos en texto plano.
5. No registrar secretos en logs.
6. No confiar en IA para decisiones tributarias críticas.
7. No crear reglas tributarias no verificadas.
8. Versionar schemas y reglas.
9. Certificación antes de producción cuando corresponda.
10. Todo envío debe ser trazable.
11. Todo rechazo debe ser accionable.
12. Toda operación crítica debe ser auditable.
13. Diseñar para fallos del SII.
14. Diseñar para cambios del SII.
15. Separar operación comercial, tributaria, pago y contabilidad.
16. Mantener documentación oficial como autoridad normativa.
17. Revisar periódicamente endpoints, schemas, validaciones y procedimientos.
18. Crear pruebas de regresión ante cada cambio relevante.

---

# 38. Mejora continua

Cada incidente SII debe generar:

`Incidente → Diagnóstico → Corrección → Prueba → Runbook → Regla/Alerta → Métrica → Mejora`

Cada cambio normativo:

`Cambio SII → Impact Analysis → Desarrollo → Tests → Certificación → Release → Monitoreo`

Cada migración:

`Experiencia → patrón generalizable → prueba → certificación → Foundry Knowledge Base`

---

# 39. Fuentes oficiales consultadas

- SII — Sistema de facturación de mercado y ambiente de certificación/prueba.
- SII — WS de Autenticación con Certificado Digital.
- SII — Instructivo Técnico Factura Electrónica.
- SII — Documentación de boleta electrónica y certificación.
- SII — Web Service de consulta y registro de aceptación/reclamo de DTE.
- SII — Resoluciones 2026 y cambios recientes.

Las fuentes oficiales deben volver a verificarse antes de implementar cada endpoint, schema, procedimiento de certificación o regla tributaria concreta.

---

# 40. Estado

**REQUISITO ARQUITECTÓNICO OFICIAL DE JOINOPS — SII INTEGRATION HUB**

Esta especificación es investigación y diseño. No debe considerarse autorización legal/tributaria ni reemplazar la documentación oficial vigente del SII.

La implementación deberá comenzar por certificación, autenticación, seguridad, DTE, folios/CAF, respuestas, auditoría y reconciliación, y posteriormente ampliar RCV, aceptación/reclamo, libros y otras interfaces oficiales según necesidad y disponibilidad.
