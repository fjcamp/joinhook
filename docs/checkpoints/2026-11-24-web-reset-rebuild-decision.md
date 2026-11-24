# JoinHook — Decisión de retiro del sitio anterior y reconstrucción

**Fecha:** 2026-11-24  
**Código:** JH-WEB-RESET-REBUILD-2026-11-24  
**Estado:** DECISIÓN DE RECONSTRUCCIÓN APROBADA · DESMANTELAMIENTO EN cPANEL NO EJECUTADO  
**Dominio público:** `joinhook.cl`  
**Hosting:** BlueHosting / cPanel / CloudLinux / Passenger  
**Fuente de diseño:** última maqueta Canva de JoinHook y archivo Figma `DcZ1k6h08aM7QVs0JlPIjw`

---

## 1. Decisión

Se acuerda retirar la web pública anterior y construir una nueva versión institucional de JoinHook a partir de la maqueta Canva más reciente, sus contenidos consolidados y los criterios comerciales aprobados.

El objetivo no es mantener por obligación la estructura visual ni el frontend anterior. Se conservarán el código fuente, su historial, los artefactos recuperables, la documentación de arquitectura, los workflows y las lecciones de despliegue que puedan servir.

**Esta decisión no autoriza borrar archivos, aplicaciones, bases de datos, registros DNS, correos ni configuraciones antes de completar inventario, respaldo y verificación de restauración.**

A la fecha de este checkpoint no se ha realizado ningún borrado ni modificación en cPanel.

## 2. Fotografía de cPanel entregada por el propietario

| App URI | Application root | Mode | Estado | Runtime |
|---|---|---|---|---|
| `joinhook.cl/` | `/home/joinhook/joinhook-production` | Production | Started | Node.js 20.20.2 |
| `staging.joinhook.cl/` | `/home/joinhook/staging-joinhook` | Production | Stopped | Node.js 20.20.2 |

La columna `Mode` de CloudLinux/Node.js Selector indica el modo de ejecución (Production/Development); no determina por sí sola si la aplicación es el entorno público o staging. El entorno también se identifica por App URI, application root, variables y document root.

**No pulsar Delete/Remove ni cambiar versiones/modos todavía.** Primero guardar configuración, variables (en un gestor seguro, nunca en GitHub), rutas, logs, archivos y documentación. La opción Remove application en el panel gestiona el registro de la aplicación Node.js; no se debe asumir qué archivos o entornos auxiliares elimina sin verificarlo con el proveedor.

## 3. Inventario de código y método que se deben preservar

### Repositorio `fjcamp/joinhook`

- Mantener el repositorio, historial Git, tags y ramas.
- Preservar `main` y `redesign-v2` como antecedentes del sitio Next.js.
- Conservar los workflows:
  - `.github/workflows/redesign-ci.yml`
  - `.github/workflows/production-artifact.yml`
- Preservar los runbooks:
  - `docs/bluehosting-staging.md`
  - `docs/bluehosting-production.md`
  - `docs/knowledge-base/incidents/JH-OPS-001-next-static-assets-bluehosting.md`
  - `docs/pre-staging-qa.md`
  - `docs/production-release-2026-08-21.md`
- Conservar configuraciones y archivos de arranque útiles como referencias de legado: `server.js`, `package.json`, lockfile, `next.config.js`, `.htaccess`, instrucciones de Passenger y documentación de artefactos.

### Lecciones técnicas verificadas del despliegue anterior

1. No compilar aplicaciones pesadas dentro de BlueHosting si exceden los límites LVE; compilar en CI y publicar artefactos reproducibles.
2. No desplegar un runtime distinto del conjunto de recursos estáticos de ese mismo build.
3. El incidente JH-OPS-001 fue un desacople específico de Next.js: Passenger entregaba HTML, pero Apache/LiteSpeed no encontraba los recursos `/_next/static` en el document root. Se resolvió sincronizando el mirror del mismo build. Esta lección se conserva; la implementación exacta del mirror Next.js no debe copiarse automáticamente al futuro frontend Angular.
4. Desplegar primero en staging, comprobar rutas, MIME, headers, formularios, móvil y logs; promover a producción solo con evidencia.
5. Mantener runtime anterior, artefacto, document root y configuración como conjunto recuperable para rollback.
6. Registrar commit, hash del artefacto, versión de runtime y resultados de smoke tests.

### Repositorio `fjcamp/joinhook-os`

Conservarlo como repositorio separado de JoinHook OS. No mezclar su backend o sus modelos de datos con la web institucional sin una decisión arquitectónica específica. La existencia de Prisma en ese repositorio no constituye una recomendación para adoptarlo en el nuevo sitio.

## 4. Elementos que no se deben borrar

Hasta completar el inventario y los respaldos, mantener:

- `/home/joinhook/public_html` completo, incluidos archivos ocultos, `.htaccess`, reglas de Passenger/CloudLinux, certificados o verificaciones de dominio y cualquier instalación WordPress heredada.
- `/home/joinhook/joinhook-production`.
- `/home/joinhook/staging-joinhook`.
- `/home/joinhook/logs/` y logs específicos de ambas aplicaciones.
- Todas las bases de datos PostgreSQL existentes, usuarios, permisos y datos.
- Configuraciones de entorno, nombres de variables y valores secretos guardados fuera de GitHub.
- Configuración de dominios, subdominios, document roots, DNS, MX, correo, SSL/AutoSSL y redirecciones.
- Formularios, registros, medios, URLs indexadas y cualquier dato de clientes.
- Copias y artefactos que puedan servir para rollback.

PostgreSQL ya fue identificado por el propietario como habilitado en cPanel. No se requiere repetir esa comprobación de presencia. Sigue pendiente la prueba segura de conectividad PostgreSQL–Node.js desde un entorno de staging (por ejemplo, una consulta `SELECT 1`). No borrar, recrear ni migrar bases durante esa prueba.

## 5. Riesgo de alcance: aplicaciones y rutas de productos existentes

El repositorio y los runbooks anteriores contienen rutas de producto que no son simplemente contenido institucional, incluyendo Control Gastronómico Express / Estado de Gastos Operacionales, PWA, manifest, service worker y checkout. Antes de retirar el frontend actual, inventariar estas rutas y decidir si:

- se mantienen temporalmente;
- se trasladan a subdominios o aplicaciones separadas; o
- se despublican mediante una decisión explícita.

No retirar una ruta o un checkout por accidente al reemplazar la página de Inicio. Los códigos, datos y configuraciones de producto deben preservarse aunque la nueva web institucional sea independiente.

## 6. Tratamiento del runtime Node.js

Node.js 20.20.2 aparece en ambas aplicaciones actuales, pero la rama Node.js 20 terminó soporte (EOL) el 2026-04-30. No elegirla para el nuevo runtime.

La documentación actual de CloudLinux Node.js Selector muestra Node.js 24.x entre las versiones soportadas en CloudLinux OS 8/9/10. La versión exacta disponible en esta cuenta debe confirmarse en el Selector o con BlueHosting antes de crear la nueva aplicación. Objetivo preliminar: la última versión 24.x que ofrezca el proveedor y que sea compatible con las versiones aprobadas de Angular y NestJS.

- Node.js 20.20.2 queda solo como referencia histórica del runtime antiguo.
- No actualizar a ciegas las aplicaciones actuales antes de respaldarlas.
- No confundir `Mode=Production` con entorno público: staging puede ejecutar un artefacto de producción bajo su propio subdominio y mantener protección `noindex`.

Fuentes:
- Node.js releases: https://nodejs.org/en/about/previous-releases
- CloudLinux Node.js Selector: https://docs.cloudlinux.com/cloudlinuxos/cloudlinux_os_components/
- CloudLinux cPanel Node.js Selector UI: https://docs.cloudlinux.com/cloudlinuxos/lve_manager/

## 7. Arquitectura objetivo para el nuevo sitio

La arquitectura que se tomará como base de trabajo es la recomendada por el desarrollador:

- Angular para la interfaz web.
- NestJS + TypeScript para el backend/API.
- Arquitectura hexagonal (Ports and Adapters) para separar dominio, casos de uso, puertos y adaptadores.
- PostgreSQL como opción prioritaria de persistencia, sujeto a validar versión, límites y conectividad real desde Passenger.
- Sitio público y administración con responsabilidades y accesos separados.
- GitHub como fuente de verdad del código; CI/CD para compilación, pruebas y artefactos.
- BlueHosting/cPanel como infraestructura inicial, condicionada a las pruebas de capacidad.

No incorporar Prisma ni otro ORM como decisión de arquitectura sin recomendación explícita del desarrollador. El modelo de datos debe diseñarse y aprobarse antes de conectar formularios.

### Distribución conceptual

- `joinhook.cl`: sitio institucional público Angular.
- `api.joinhook.cl` o ruta API equivalente: NestJS ejecutado mediante Passenger, si la configuración del host lo permite.
- `app.joinhook.cl`: panel privado futuro, sujeto a diseño y autorización.
- `staging.joinhook.cl`: entorno de pruebas independiente y no indexable.

La distribución final, los nombres de subdominios y la cantidad de aplicaciones Node se aprueban después de probar el plan de hosting.

## 8. Protocolo de retiro del sitio anterior

### Fase A — Auditoría y respaldo

1. Exportar/archivar el repositorio y registrar SHA de ramas/commits; no borrar ramas.
2. Descargar y conservar artefactos históricos de GitHub Actions cuando estén disponibles.
3. Respaldar todo `public_html`, `joinhook-production`, `staging-joinhook`, logs y configuración de las aplicaciones.
4. Exportar cada base de datos y sus roles/usuarios; comprobar integridad y procedimiento de restauración en una copia aislada.
5. Registrar dominios, subdominios, document roots, variables, cron/jobs, correo, DNS, MX, SSL, redirecciones, formularios y URLs.
6. Verificar qué rutas y productos se sirven actualmente desde `joinhook.cl`.
7. Guardar el backup fuera del document root y comprobar que es legible y recuperable.

### Fase B — Despublicación controlada

1. Preparar una página provisional de mantenimiento o reemplazo aprobada, sin alterar correo, DNS/MX ni certificados.
2. Mantener el backup íntegro.
3. Detener el runtime antiguo solo cuando el reemplazo provisional esté listo y se hayan registrado rutas y dependencias.
4. Retirar la aplicación de Node.js en cPanel solo después de validar respaldo y confirmar el alcance de la acción con el proveedor.
5. Eliminar archivos antiguos únicamente después de verificar una copia recuperable y recibir aprobación de la lista exacta de archivos/carpetas.
6. No eliminar bases de datos PostgreSQL como parte de la limpieza del frontend.

### Fase C — Nueva construcción y despliegue

1. Cerrar el diseño Canva/Figma y aprobar contenidos.
2. Definir contrato API, modelo entidad-relación y esquema de persistencia.
3. Crear estructura Angular y NestJS conforme a arquitectura hexagonal.
4. Fijar versiones de Node.js, Angular, NestJS, TypeScript y dependencias; lockfiles versionados.
5. CI: instalación reproducible, auditoría, lint, pruebas unitarias/integración, build, smoke tests y artefactos.
6. Desplegar en staging con base de datos aislada o esquema de pruebas; no tocar producción.
7. Probar conectividad PostgreSQL–NestJS, formularios, permisos, rutas, seguridad, accesibilidad y responsive.
8. Ejecutar QA y aprobación.
9. Respaldar la página provisional y promover a producción.
10. Verificar dominio, SSL, SEO, redirecciones y rollback.

## 9. Contenido y conversión de la nueva web

Fuente principal de diseño: última maqueta Canva de JoinHook. Mantener navegación por páginas, no una página infinita.

Prioridad comercial: propietarios de terrenos y espacios con potencial turístico. Segundo recorrido: negocios/establecimientos turísticos. El mensaje, servicios y límites deben coincidir con las capacidades reales.

Secciones de referencia:
- Inicio y rutas por tipo de visitante.
- Servicios y páginas de detalle.
- Cómo trabajamos.
- Proyectos y casos (solo evidencia autorizada).
- Nosotros.
- Conocimiento: blog, actualidad y análisis.
- Colaboraciones y modelos.
- Formulario de clientes.
- Formulario de colaboradores.
- Contacto/confirmación.
- Privacidad, 404 y newsletter solo cuando esté operativa.

La publicación de la actualización metodológica de SERNATUR del 13-11-2026 se ubicará en Conocimiento/Análisis y datos turísticos, con fuentes y advertencias metodológicas. No extrapolar datos de viajes internos a visitantes únicos, reservas o demanda de vehículos recreativos.

Regla editorial: **NO EVIDENCE = NO CLAIM**. No prometer permisos, certificaciones, rentabilidad, obras, reservas, integraciones ni resultados no verificados.

## 10. Criterio de cierre

La web anterior se considera retirada únicamente cuando:
- existe backup recuperable y el restore fue probado;
- las dependencias y productos/rutas se han reasignado o despublicado explícitamente;
- correo, DNS/MX y SSL permanecen operativos;
- no quedan credenciales o datos sensibles dentro de artefactos públicos;
- la página provisional o la nueva web funciona sin mezclar assets/runtime antiguos.

La nueva web se considera lista para producción solo con staging aprobado y rollback ensayado.

**Regla final:** conservar código e historial; cambiar el producto público; no hacer borrados irreversibles por conveniencia.
