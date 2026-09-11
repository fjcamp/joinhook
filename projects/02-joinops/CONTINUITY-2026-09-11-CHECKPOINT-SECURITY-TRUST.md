# JoinOps — Security & Trust Architecture Checkpoint

**Fecha:** 2026-09-11  
**Repositorio:** `fjcamp/joinhook`  
**Rama:** `joinops/foundation-2026-09-11`  
**PR:** #44 (Draft)  
**Regla:** `main` no se modifica directamente.

## 1. Objetivo

Establecer Security & Trust como capa transversal de JoinOps, incorporando principios observados en arquitecturas de grandes proveedores tecnológicos: Zero Trust, mínimo privilegio, defensa en profundidad, aislamiento, seguridad de la cadena de suministro, detección, respuesta y recuperación.

La seguridad no se tratará como una fase final sino como requisito de diseño para cada módulo nuevo y para el endurecimiento progresivo de los módulos existentes.

## 2. Principios obligatorios

1. **Zero Trust:** no confiar automáticamente por ubicación de red, módulo, usuario, dispositivo o agente.
2. **Least Privilege:** cada identidad recibe solamente los permisos necesarios.
3. **Defense in Depth:** ninguna única barrera se considera suficiente.
4. **Data Integrity > Security > Traceability > Operational Continuity > Total Availability.**
5. **Fail safely:** ante incertidumbre de seguridad, bloquear o degradar la capacidad afectada sin derribar innecesariamente todo JoinOps.
6. **Auditability:** operaciones sensibles deben ser trazables.
7. **Security by Design:** cada módulo debe incorporar seguridad desde su creación.

## 3. Capas de protección

```text
Internet
  ↓
WAF / Firewall / Rate Limiting
  ↓
API Gateway / Edge Controls
  ↓
Authentication + MFA
  ↓
Authorization / RBAC / Least Privilege
  ↓
Input Validation / Anti-Abuse
  ↓
JoinOps Services
  ↓
Tool/API controlled data access
  ↓
Neon PostgreSQL
  ↓
Audit + Backup + Recovery
```

## 4. Protección contra amenazas

### Aplicación y API

- SQL injection: consultas parametrizadas, validación de tipos, constraints y pruebas de entradas maliciosas.
- XSS: validación/sanitización contextual y políticas de salida.
- CSRF: protección en operaciones con estado cuando corresponda.
- SSRF: destinos permitidos y ausencia de acceso arbitrario a URLs proporcionadas por usuarios.
- Replay attacks: idempotency keys y control de operaciones repetibles.
- Brute force / credential stuffing: rate limiting, detección y bloqueo progresivo.
- Parameter tampering: validación en servidor, nunca confiar en valores del cliente.
- Privilege escalation: RBAC, autorización por operación y mínimo privilegio.
- User enumeration: respuestas y flujos que no revelen innecesariamente existencia de cuentas.

### Archivos y documentos

Todo archivo externo debe considerarse no confiable:

```text
Upload
 → validación de tamaño/tipo real
 → extensión
 → contenido
 → malware/AV scanning
 → aislamiento
 → almacenamiento controlado
 → procesamiento
```

Esto será especialmente importante para facturas, cotizaciones, órdenes de compra, documentos de proveedores y entradas utilizadas por agentes IA.

## 5. Seguridad de agentes IA

Los agentes son identidades con capacidades limitadas.

**Regla fundamental:** ningún agente tendrá acceso administrativo SQL directo a producción.

Flujo obligatorio:

```text
Agente
 ↓
Tool/API autorizada
 ↓
Policy / Authorization
 ↓
Validación
 ↓
Operación
 ↓
Auditoría
```

Los datos provenientes de usuarios, proveedores, PDFs, correos, webs, WhatsApp, comentarios u otras fuentes externas son **datos no confiables**, nunca instrucciones de mayor prioridad.

La defensa contra prompt injection debe mantener una separación explícita entre:

- instrucciones del sistema;
- políticas de seguridad;
- herramientas autorizadas;
- datos externos no confiables.

## 6. Identidad y acceso

Se establece como objetivo de arquitectura:

- autenticación centralizada;
- RBAC;
- mínimo privilegio;
- MFA para cuentas sensibles;
- mayor nivel de autorización para operaciones críticas;
- revocación de sesiones/permisos;
- control de dispositivos/sesiones cuando el producto lo requiera;
- separación de responsabilidades entre operador, supervisor, administrador y agentes.

## 7. WAF, firewall y anti-abuso

Se incorporará progresivamente una protección perimetral/edge con:

- WAF;
- rate limiting;
- protección frente a patrones maliciosos conocidos;
- controles anti-bot/abuso cuando sean necesarios;
- límites por IP, identidad, endpoint y operación cuando corresponda.

El WAF no se considera sustituto de la seguridad de aplicación.

## 8. Secrets y configuración

- Nunca almacenar secretos en el repositorio.
- Variables protegidas por entorno.
- Rotación de credenciales.
- Alcance mínimo de cada secreto.
- Expiración cuando sea viable.
- Si un secreto aparece en Git, tratarlo como comprometido y rotarlo.

## 9. Seguridad de base de datos

Neon/PostgreSQL debe aplicar progresivamente:

- usuarios/roles con mínimo privilegio;
- separación de responsabilidades;
- constraints;
- claves foráneas;
- checks;
- políticas de acceso/RLS cuando correspondan;
- conexiones cifradas;
- auditoría;
- migraciones controladas;
- separación de entornos;
- backups y recuperación verificada.

La aplicación no debe depender de privilegios administrativos de base de datos para operaciones normales.

## 10. Protección contra destrucción y ransomware

Un backup existente no se considera suficiente.

Objetivo:

```text
Backup
 → verificación
 → copia protegida
 → recuperación probada
```

La capa de resiliencia debe permitir recuperar datos y reanudar operaciones sin aceptar datos duplicados o inconsistentes.

## 11. Detección y respuesta

JoinOps deberá poder detectar progresivamente:

- volumen anómalo de operaciones;
- intentos reiterados de autenticación;
- cambios de privilegios;
- accesos inusuales;
- operaciones sensibles fuera de patrón;
- comportamiento anómalo de agentes;
- actividad potencialmente automatizada/maliciosa.

Se integrará con el Incident Manager y el Security Center.

## 12. Security Kill Switch / aislamiento selectivo

No se debe asumir que ante un incidente hay que apagar JoinOps completo.

Debe ser posible aislar capacidades concretas, por ejemplo:

```text
POS              OPERATIVO
INVENTARIO       OPERATIVO
RECEPCIÓN        OPERATIVO
CAMBIO PRECIOS   BLOQUEADO
DEVOLUCIONES     BLOQUEADO
ADMINISTRACIÓN   BLOQUEADO
```

El objetivo es contener el riesgo manteniendo continuidad operacional donde sea seguro.

## 13. Seguridad de la cadena de suministro

El desarrollo deberá incorporar progresivamente:

- lockfiles;
- revisión de dependencias;
- detección de vulnerabilidades;
- Dependabot/Renovate según conveniencia;
- secret scanning;
- revisión de PR;
- CI obligatorio;
- permisos mínimos para GitHub Actions;
- trazabilidad commit → build → release;
- rollback controlado;
- revisión de dependencias antes de incorporarlas por conveniencia.

## 14. GitHub y ciclo de desarrollo

Reglas de referencia:

- `main` protegida;
- cambios mediante PR;
- CI obligatorio cuando esté disponible;
- revisión antes de integrar cambios críticos;
- secretos fuera del código;
- workflows con permisos mínimos;
- releases trazables;
- checkpoints de continuidad para bloques relevantes.

## 15. Integración con Resilience & Continuity

Security & Trust y Resilience & Continuity son capas transversales complementarias.

```text
Security & Trust
       ↕
Incident Control
       ↕
Resilience & Continuity
       ↕
JoinOps Modules
```

Una amenaza puede producir aislamiento; el aislamiento puede activar modo degradado/contingencia; la recuperación debe validar integridad, idempotencia, replay, reconciliación y auditoría.

## 16. Security Contract por módulo

Todo módulo nuevo deberá definir antes de considerarse completo:

- activos protegidos;
- amenazas relevantes;
- dependencias;
- identidades y permisos;
- operaciones críticas;
- entradas no confiables;
- controles de validación;
- comportamiento ante fallo/ataque;
- operaciones permitidas en degradación/contingencia;
- idempotencia;
- auditoría;
- alertas;
- aislamiento;
- recuperación;
- pruebas de seguridad;
- procedimiento de recuperación.

## 17. Estado actual

### Security & Trust Layer
**PLANIFICADO / ARQUITECTURA DEFINIDA**

### Implementación técnica completa
**DOCUMENTADO-NO-IMPLEMENTADO**

Este checkpoint no declara implementados WAF, MFA, malware scanning, SIEM, threat detection ni todos los controles descritos. Su propósito es fijar requisitos y evitar que futuros módulos nazcan sin ellos.

### Resilience & Continuity Layer
**PLANIFICADO / ARQUITECTURA DEFINIDA — checkpoint previo existente.**

### Cash Close & Reconciliation
**IMPLEMENTADO PARCIALMENTE / PENDIENTE DE VALIDACIÓN INTEGRAL** según checkpoint previo.

### Inventory Ledger
**PENDIENTE DE IMPLEMENTACIÓN.** Será el siguiente bloque funcional y deberá nacer bajo Security Contract + Failure Contract.

## 18. Próximo desarrollo

1. Validar conjuntamente Security & Trust + Resilience & Continuity.
2. Definir Threat Model y matriz de amenazas para JoinOps.
3. Implementar controles base reutilizables sin reconstruir POS/Caja/Pagos.
4. Iniciar Inventory Ledger bajo ambos contratos.
5. Añadir pruebas de seguridad y resiliencia junto con cada módulo.

**Regla de continuidad:** este checkpoint agrega arquitectura y requisitos; no reemplaza ni borra checkpoints anteriores.
