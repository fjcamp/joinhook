# JoinHook — Checkpoint 2026-09-17 — Platform Distribution & Compliance Standard

**Fecha:** 2026-09-17  
**Alcance:** Transversal a proyectos de JoinHook que desarrollen apps, sistemas, MVPs o herramientas con potencial de distribución a clientes o publicación en plataformas.  
**Repositorio:** `fjcamp/joinhook`  
**Rama:** `main`  
**Estado:** ESTABLECIDO COMO CRITERIO ARQUITECTÓNICO TRANSVERSAL

## 1. Propósito

Registrar como estándar de JoinHook que los requisitos de distribución, privacidad, seguridad, gestión de permisos, gobernanza de datos y cumplimiento de plataformas deben considerarse desde la arquitectura inicial del proyecto cuando resulten aplicables.

No significa que todos los proyectos deban publicarse en todas las tiendas ni que todos deban implementar todos los controles. Cada proyecto debe determinar su alcance real antes del desarrollo.

## 2. Canales considerados

- Web / PWA
- Android / Google Play
- iOS / Apple App Store
- Windows / Microsoft Store

La estrategia de distribución debe definirse por proyecto. Web/PWA puede utilizarse como canal inicial cuando permita validar el producto sin introducir inmediatamente la complejidad de las tiendas.

## 3. Security & Compliance Core

Cuando corresponda, la arquitectura deberá contemplar:

- Identity
- Authentication
- Authorization
- OAuth
- Consent Management
- Permission Management
- Data Provenance
- Data Classification
- Data Retention
- Data Export
- Account Deletion
- Audit Log
- Privacy Policy
- Terms
- Store Compliance
- Security controls
- Release / certification controls

## 4. Privacy by Design

Los proyectos que procesen información de usuarios o terceros deberán diseñarse bajo principios de:

- minimización de datos;
- finalidad explícita;
- acceso limitado por necesidad;
- consentimiento cuando corresponda;
- revocación de permisos;
- retención definida;
- eliminación cuando corresponda;
- exportación de información;
- trazabilidad del uso de datos.

No se debe solicitar acceso indiscriminado a toda la información del usuario.

## 5. Integraciones

Las conexiones con servicios externos deben gestionarse individualmente.

Ejemplos:

- Gmail
- Google Drive
- Calendar
- Outlook
- OneDrive
- Notion

La interfaz deberá permitir, cuando corresponda:

- conectar;
- visualizar estado;
- limitar permisos;
- revocar;
- desconectar.

Los agentes o módulos de IA no deberán recibir acceso global por defecto. El acceso debe limitarse al contexto y operación necesarios.

## 6. Data Provenance

Para datos relevantes, especialmente aquellos utilizados por automatizaciones o IA, se debe considerar la trazabilidad de:

- dato;
- origen;
- fuente;
- fecha/hora;
- contexto;
- estado;
- transformación;
- interpretación de IA, si existe.

Debe distinguirse, cuando sea relevante:

- hecho confirmado;
- dato proporcionado por usuario;
- observación;
- inferencia;
- salida de IA.

## 7. Ciclo de vida de la cuenta

Cuando una aplicación utilice cuentas personales, la arquitectura deberá evaluar desde el inicio:

```
Cuenta
├── Gestionar conexiones
├── Permisos
├── Revocar accesos
├── Exportar datos
├── Descargar información
└── Eliminar cuenta
```

La implementación concreta dependerá del modelo del producto y de las obligaciones aplicables.

## 8. Requisitos de publicación

Antes de una publicación en una tienda se deberá realizar una revisión específica del canal:

### Google Play
Evaluar cuenta de desarrollador, identidad, ficha, privacidad, Data Safety, permisos, estabilidad, credenciales de revisión y requisitos de testing/publicación vigentes.

### Apple App Store
Evaluar cuenta, identidad, privacidad, permisos, consentimiento, acceso para revisión, cuentas demo cuando corresponda y mecanismos de eliminación de cuenta cuando exista creación de cuentas.

### Microsoft Store
Evaluar tipo de cuenta/editor, identidad, paquete, versionado, pruebas y certificación aplicables.

### Web/PWA
Evaluar seguridad web, privacidad, autenticación, permisos del navegador, instalación PWA, compatibilidad y operación en producción.

**Nota:** Los requisitos de plataforma son dinámicos. Antes de cada publicación deberán verificarse contra la documentación oficial vigente de la plataforma correspondiente.

## 9. Regla de arquitectura JoinHook

Cada nuevo proyecto deberá incluir, durante la fase de arquitectura, una evaluación:

```
PROJECT COMPLIANCE & DISTRIBUTION
├── Target platforms
├── Identity
├── Authentication / Authorization
├── External integrations
├── Data inventory
├── Privacy
├── Consent
├── Permissions
├── Data provenance
├── Retention / deletion
├── Export
├── Audit
├── AI governance
├── Security
└── Release / Store compliance
```

Los elementos no aplicables deberán marcarse explícitamente como **N/A**, evitando tanto omisiones como sobreingeniería.

## 10. Aplicación a Mi Gestión Admin

Mi Gestión Admin (MGA) queda identificado como proyecto que requiere especial atención a este estándar debido a su potencial integración con correo, archivos, calendario, Notion, información laboral/empresarial y capacidades de IA.

MGA deberá diseñarse con separación entre:

- núcleo funcional;
- identidad;
- integraciones;
- permisos;
- consentimiento;
- gobernanza de datos;
- provenance;
- Agent Core;
- adaptadores de plataforma.

La estrategia inicial considerada es:

1. Web/PWA para validación;
2. Android / Google Play;
3. Windows / Microsoft Store;
4. iOS / App Store.

El orden es una estrategia de desarrollo y validación, no una obligación permanente.

## 11. JoinHook Agent Lab

Los agentes utilizados para investigar, diseñar o desarrollar proyectos deberán detectar cuando una iniciativa tenga implicancias de:

- distribución;
- privacidad;
- seguridad;
- datos;
- integraciones;
- IA;
- publicación en tiendas.

Cuando corresponda, estas consideraciones deben incorporarse antes de cerrar la arquitectura.

## 12. Regla de continuidad

Este checkpoint pertenece a **JoinHook** y establece un estándar transversal.

No constituye una especificación exclusiva de MGA ni de JoinOps.

Cuando un proyecto concreto requiera controles adicionales, deberá crear su propia especificación o checkpoint sin eliminar este estándar transversal.

## 13. Resultado del checkpoint

Queda establecido:

**JoinHook no tratará compliance, privacidad, seguridad, distribución y gobernanza de datos como tareas exclusivamente posteriores al desarrollo. Cuando sean aplicables, formarán parte del diseño desde la etapa de arquitectura.**

**Próximo uso:** aplicar este estándar en el siguiente proyecto nuevo o en la siguiente revisión arquitectónica de un proyecto existente.
