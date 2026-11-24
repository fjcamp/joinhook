# JoinHook — Fase de construcción cloud-first de la nueva web

**Fecha:** 2026-11-24  
**Código:** JH-WEB-CLOUDFIRST-CP-2026-11-24-001  
**Estado:** DECISIÓN APROBADA / CONSTRUCCIÓN DE CÓDIGO PENDIENTE DE EJECUCIÓN  
**Repositorio de referencia:** `fjcamp/joinhook`  
**Rama de trabajo prevista:** `rebuild/angular-nestjs-cloud-first`

---

## 1. Decisión de trabajo

La nueva web institucional de JoinHook se construirá primero en la nube, trabajando el código fuente y la documentación dentro de GitHub. El repositorio será la fuente de verdad del nuevo desarrollo.

**No se compilará todavía.** Primero se debe completar y revisar el conjunto de código, estructura, componentes, páginas, contenidos, recursos visuales, contratos de API, modelo de datos y configuración de proyecto. Una vez que el conjunto esté armado y revisado, se abrirá una fase separada de instalación reproducible, pruebas, compilación y generación de artefactos.

Esta decisión prioriza la construcción ordenada del producto antes de consumir recursos del hosting o iniciar despliegues.

## 2. Separación del legado

- Mantener intacta la rama `main` como historial y referencia del sitio Next.js anterior.
- Desarrollar la nueva web en una rama dedicada, prevista como `rebuild/angular-nestjs-cloud-first`, sin sobrescribir ni reutilizar automáticamente el frontend Next.js.
- Mantener separados el código nuevo, la documentación histórica y los artefactos antiguos.
- Los cambios iniciales de esta fase serán commits de código fuente, especificaciones y documentación; no despliegues.
- No alterar cPanel, BlueHosting, Passenger, DNS, SSL, correo, aplicaciones Node existentes ni PostgreSQL durante esta etapa.

La creación de la rama dedicada es un paso de aislamiento del trabajo; no equivale a que la nueva aplicación ya esté implementada.

## 3. Arquitectura objetivo acordada

- **Frontend:** Angular + TypeScript, sitio institucional público organizado por páginas.
- **Backend:** NestJS + TypeScript, API y lógica del servidor.
- **Arquitectura:** hexagonal (Ports and Adapters), separando dominio, casos de uso, puertos y adaptadores.
- **Persistencia:** PostgreSQL como base objetivo, sujeto a definir modelo, versión, límites y conectividad efectiva antes de integración real.
- **Repositorio:** GitHub como fuente única de verdad del código y de los cambios.
- **Diseño y contenido:** identidad visual y contenidos consolidados en la maqueta Canva vigente, con páginas independientes y enfoque de captación de propietarios de espacios con potencial turístico.
- **ORM:** no seleccionar ni incorporar Prisma u otro ORM sin evaluación y aprobación técnica explícita.

La habilitación de PostgreSQL en cPanel está confirmada por el propietario; la conectividad desde la aplicación todavía no está verificada. Esta fase puede preparar interfaces, contratos, modelos y migraciones versionadas, pero no debe tocar las bases existentes.

## 4. Alcance de construcción antes de compilar

La fase cloud-first comprende:

1. Consolidar sitemap, contenido aprobado, navegación, CTA, formularios y recursos de Canva.
2. Definir estructura de repositorio y límites entre frontend, backend, dominio compartido (solo si corresponde) y documentación.
3. Construir páginas, layouts, componentes visuales, estilos, responsive y accesibilidad prevista del frontend.
4. Construir módulos NestJS, controladores/adaptadores, casos de uso, puertos, validación, configuración y manejo de errores.
5. Definir contratos API, DTOs, reglas de negocio, esquema de datos y estrategia de persistencia sin conectar ni alterar datos productivos.
6. Preparar formularios y flujos de captación conforme a JH-CRM-FRM-001; no exponer secretos ni integrar credenciales en navegador.
7. Añadir archivos de ejemplo de configuración (por ejemplo, `.env.example`) sin valores secretos, documentación y decisiones técnicas.
8. Escribir pruebas y criterios de aceptación como código/documentación, dejando su ejecución para la fase de validación posterior.
9. Revisar coherencia completa del conjunto y registrar pendientes antes de declarar la construcción terminada.

## 5. Actividades expresamente aplazadas

Hasta que el conjunto esté armado y revisado, no ejecutar:

- `npm install` / `npm ci` como instalación de dependencias en el hosting;
- `ng build`, `nest build`, `npm run build` ni compilaciones equivalentes;
- generación de artefactos de despliegue;
- despliegue a BlueHosting, Passenger, staging o producción;
- cambios de runtime de Node.js de las aplicaciones existentes;
- pruebas que requieran modificar PostgreSQL productivo;
- cambios de DNS, SSL, correo, document roots o reglas `.htaccess`;
- eliminación o detención de aplicaciones, archivos o respaldos antiguos.

Se pueden preparar manifiestos, scripts, workflows y pruebas como archivos versionados, pero no se deben ejecutar workflows de build ni publicar artefactos antes de abrir expresamente esa fase.

## 6. Puerta de salida: “código armado”

La fase de construcción se considerará lista para pasar a compilación cuando exista y se haya revisado:

- estructura acordada del repositorio;
- páginas y componentes del frontend;
- navegación y rutas;
- contenido y assets aprobados;
- formularios y estados de interacción definidos;
- API y contratos frontend/backend coherentes;
- arquitectura hexagonal trazable;
- modelo de datos y decisiones de persistencia documentados;
- configuración por ambiente y secretos fuera de Git;
- pruebas definidas;
- documentación de instalación y operación;
- lista explícita de pendientes, riesgos y criterios de aceptación.

La etiqueta **ARMADO / PENDIENTE DE BUILD** no significa que compile, funcione o esté desplegado.

## 7. Fase posterior: validación y compilación

Solo después de cumplir la puerta de salida y acordar avanzar:

1. Verificar versiones compatibles y seleccionar runtime soportado por el entorno objetivo.
2. Instalar dependencias de forma reproducible a partir de lockfiles.
3. Ejecutar auditorías, lint, pruebas unitarias e integración.
4. Compilar Angular y NestJS en CI/nube, no dentro de BlueHosting si sus límites de recursos no lo permiten.
5. Corregir errores y repetir las validaciones.
6. Generar artefactos inmutables identificados por commit.
7. Desplegar primero en staging aislado y no indexable.
8. Validar API, PostgreSQL con prueba controlada, formularios, permisos, responsive, seguridad, rendimiento, rutas y logs.
9. Aprobar publicación y ejecutar un despliegue coordinado con rollback.
10. Mantener la producción anterior respaldada hasta verificar la nueva versión.

No declarar BUILD-VERIFIED, STAGING-VERIFIED ni PRODUCTION por el solo hecho de que el código esté escrito en GitHub.

## 8. Historial técnico que se conserva y no debe volver a reconstruirse

El historial anterior ya se encuentra documentado; se reutiliza como referencia y no como plantilla automática del nuevo stack:

- [Runbook de producción BlueHosting](../bluehosting-production.md)
- [Runbook de staging BlueHosting](../bluehosting-staging.md)
- [Incidente JH-OPS-001 — Next.js static assets / 404](../knowledge-base/incidents/JH-OPS-001-next-static-assets-bluehosting.md)
- [GitHub Issue #13 — Launch Gate](https://github.com/fjcamp/joinhook/issues/13)
- [Checkpoint PR49 staging — preparación y respaldo](https://app.notion.com/p/3f8b7fe8cfac81c59426c3c8a049d6df)
- [Checkpoint PR49 — auditoría de rutas y respaldo](https://app.notion.com/p/3f8b7fe8cfac8133b671cf591f570ee1)
- [Decisión de retiro y reconstrucción 2026-11-24](./2026-11-24-web-reset-rebuild-decision.md)

El mecanismo `document-root-assets` y el incidente `/_next/static` son aprendizajes específicos de Next.js. Para Angular se diseñará el empaquetado y la publicación estática adecuados a su salida de compilación; para NestJS se diseñará el despliegue independiente de la API.

## 9. Estado de infraestructura conocido al iniciar esta fase

Según la evidencia compartida por el propietario el 2026-11-24:

- `joinhook.cl/` → `/home/joinhook/joinhook-production`, Node.js 20.20.2, aplicación iniciada.
- `staging.joinhook.cl/` → `/home/joinhook/staging-joinhook`, Node.js 20.20.2, aplicación detenida.
- En `joinhook-production` se observaron `.next`, `document-root-assets`, `node_modules`, `public`, `tmp`, `DEPLOYMENT.txt`, `DOCUMENT_ROOT_SYNC.txt`, dos ZIP de despliegue, `package.json` y `server.js`.
- En `/home/joinhook` se observaron carpetas de respaldo y releases de septiembre/octubre de 2026.

Este inventario es evidencia parcial del listado mostrado, no una verificación de integridad o restauración de los respaldos. No se ha eliminado, detenido ni modificado ninguna aplicación, archivo o base de datos en cPanel durante esta fase.

## 10. Regla de control

Mantener los estados separados:

- `DESIGNED`: diseño o decisión documentada.
- `IMPLEMENTED`: código escrito y versionado.
- `ARMED / PENDING BUILD`: conjunto de código y documentación ensamblado y revisado, aún sin compilar.
- `BUILD-VERIFIED`: compilación y pruebas de CI ejecutadas correctamente.
- `STAGING-VERIFIED`: despliegue de prueba y validación funcional completados.
- `PRODUCTION`: publicación aprobada y verificada.

**Regla:** NO EVIDENCE = NO CLAIM.  
**Decisión vigente:** construir primero en la nube y en GitHub; compilar después de que el conjunto esté armado y revisado.