# Estado de implementación — primera fundación JoinHook web

**Fecha:** 2026-11-24  
**Código:** JH-WEB-FOUNDATION-CP-2026-11-24-001  
**Rama:** `rebuild/angular-nestjs-cloud-first`  
**Estado:** IMPLEMENTED — FOUNDATION / PENDING BUILD

## Alcance incorporado

Se creó el workspace aislado `rebuild/` dentro del repositorio `fjcamp/joinhook`. La raíz histórica Next.js y la rama `main` se mantienen sin modificar como legado.

### Frontend Angular
- Configuración de workspace Angular y TypeScript.
- Bootstrap standalone, router y layout institucional compartido.
- Navegación principal, menú responsive, footer y enlace para saltar al contenido.
- Home inicial con headline, propuesta de valor, CTA de propietarios, segundo recorrido para negocios turísticos, servicios, método de seis pasos, criterio de evidencia y conocimiento.
- Rutas y contenido inicial basados en la simulación Canva de 24 páginas.
- Página editorial genérica y página 404.
- Estilos responsive iniciales y tokens visuales provisionales.

### Backend NestJS
- Configuración de proyecto NestJS.
- Estructura por capas hexagonales en módulo Health.
- Dominio y contrato de estado, puerto, caso de uso, adaptador de runtime y controlador HTTP.
- Prefijo `/api/v1`, CORS basado en allowlist y configuración de puerto.
- Respuesta Health marca PostgreSQL como `not_checked`, porque no hay adaptador de base ni prueba de conectividad.

### Documentación
- README de workspace.
- Arquitectura de frontend/backend.
- Base tecnológica de referencia y compatibilidad.
- Sitemap inicial.
- Gate futuro para instalación, pruebas y compilación.
- Archivo `.env.example` sin secretos.

## Límites conocidos de esta fundación

1. Formularios de clientes y colaboradores aún son contenido/recorridos visuales; no reciben ni almacenan datos.
2. No se implementó aún CRM, endpoints comerciales, persistencia, modelo de datos ni migraciones.
3. No se seleccionó ORM.
4. No se incorporó aún la fotografía/hero final exportada de Canva. La composición gráfica actual es provisional; tokens de color y tipografía tampoco son una validación final de marca.
5. Páginas blog y actualidad son contenido inicial de estructura, no un CMS/editor ni un sistema editorial dinámico.
6. SEO técnico avanzado, metadatos por ruta completos, sitemap generado y analítica quedan por cerrar.
7. La API tiene solo un endpoint de salud de proceso; no representa conectividad PostgreSQL ni estado integral de dependencias.

## Próximo trabajo de construcción (sin build)

- Revisar y afinar el contenido de cada página frente a la simulación Canva y el manual de contenidos.
- Incorporar los recursos visuales reales aprobados.
- Construir formularios con validación de cliente, estados y contratos API definidos, manteniéndolos desconectados hasta aprobar backend/privacidad.
- Definir contratos API y casos de uso comerciales (lead de cliente y solicitud de colaboración).
- Diseñar el modelo lógico PostgreSQL y políticas de retención/acceso, sin tocar bases existentes.
- Revisión de seguridad, accesibilidad, responsive y rutas.
- Completar pruebas como código/criterios, sin ejecutar compilación durante esta fase.

## Estado de validación

| Área | Estado |
|---|---|
| Estructura Angular | IMPLEMENTED / no compilada |
| Home y navegación | IMPLEMENTED / revisión visual pendiente |
| Páginas iniciales del sitemap | IMPLEMENTED / contenido sujeto a revisión |
| Estructura NestJS hexagonal | IMPLEMENTED / no compilada |
| Health API | Código incorporado / no ejecutado |
| Contrato de captación | PENDIENTE |
| Modelo de datos PostgreSQL | PENDIENTE |
| Conexión PostgreSQL | NOT TESTED |
| Formularios persistentes | NO IMPLEMENTED |
| Pruebas automatizadas | PENDIENTES |
| Build | DELIBERADAMENTE NO EJECUTADO |
| Staging | NO DESPLEGADO |
| Producción | SIN CAMBIOS |

## Controles de alcance

No ejecutar todavía `npm install`, `npm ci`, `ng build`, `nest build`, `npm run build`, generación de artefactos ni despliegues. No modificar cPanel, Passenger, las aplicaciones Node actuales, PostgreSQL, DNS, SSL ni correo.

**La presente entrega acredita archivos de código fuente versionados en la rama; no acredita compilación ni funcionamiento.** Regla: NO EVIDENCE = NO CLAIM.
