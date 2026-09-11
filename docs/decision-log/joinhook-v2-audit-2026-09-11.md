# JoinHook V2 — Auditoría y plan de acción

**Fecha:** 2026-09-11  
**Repositorio:** `fjcamp/joinhook`  
**Rama de referencia:** `redesign-v2`  
**Commit auditado:** `b5cd6c64345836683c3e1da620032727d2fa7716`  
**Propósito:** respaldo operativo de la conversación de trabajo y registro de decisiones para preparar JoinHook V2 para publicación y apoyar la postulación al concurso.

## 1. Decisión principal

JoinHook V2 se mantiene en `fjcamp/joinhook`, rama `redesign-v2`. No se debe trasladar ni reemplazar destructivamente el código. La publicación en `main` queda condicionada a una validación completa en staging y a un GO explícito de producción.

## 2. Hallazgos de la auditoría

### Fortalezas
- Next.js 16.3 + React 19 + TypeScript.
- `output: standalone` preparado para despliegue en BlueHosting/Passenger.
- Pipeline CI/CD con instalación reproducible, auditoría de dependencias, ESLint, build, smoke tests y validaciones PWA.
- Controles base de seguridad: CSP, `nosniff`, Referrer-Policy, X-Frame-Options y Permissions-Policy.
- Artefacto de producción preparado para BlueHosting sin ejecutar `next build` en hosting compartido.
- Separación entre web corporativa y herramientas/productos.
- CGE dispone de controles específicos para staging y checkout.

### Riesgos / puntos pendientes
1. El README actual contiene lenguaje de posicionamiento como proyecto personal/en evolución que no representa adecuadamente la posición corporativa actual de JoinHook.
2. Debe revisarse todo texto visible que pueda transmitir aprendizaje, improvisación o falta de madurez empresarial.
3. JoinHook V2 debe quedar claramente diferenciado de CGE y JoinOps.
4. JoinOps es actualmente prioridad para la postulación al concurso y debe presentarse como producto/proyecto estratégico, sin mezclar su código innecesariamente con el sitio corporativo.
5. Debe verificarse el estado real de los workflows y no asumir que la existencia del CI implica que el commit esté verde.
6. Debe revisarse la configuración comercial/checkout de CGE antes de producción; las credenciales y secretos nunca deben exponerse mediante `NEXT_PUBLIC_*`.
7. Deben validarse SEO, metadatos, sitemap, robots, accesibilidad, responsive, navegación, formularios/contacto, activos y textos antes del merge a `main`.
8. La CSP deberá ajustarse únicamente si las integraciones reales de producción (analítica, WhatsApp, pagos u otras) lo requieren, con pruebas posteriores.

## 3. Prioridad operativa

### P0 — Protección y trazabilidad
- Mantener `redesign-v2` como rama de trabajo.
- Respaldar esta decisión en GitHub.
- No hacer reemplazo destructivo de `main`.
- Mantener separación dev/staging/prod.

### P1 — JoinHook V2 para publicación
Auditar y corregir, en este orden:
1. Home.
2. Navegación y arquitectura de información.
3. Posicionamiento corporativo.
4. Servicios.
5. Proyectos/productos.
6. Presentación de JoinOps.
7. Presentación de CGE.
8. Contacto/formularios.
9. SEO y metadatos.
10. Sitemap/robots.
11. Activos/imágenes/iconos.
12. Responsive.
13. Accesibilidad.
14. Seguridad/CSP.
15. Dependencias.
16. Rutas heredadas/legacy.
17. Despliegue BlueHosting/Vercel según el destino definido.

### P1 — JoinOps para concurso
- Continuar desarrollo como sistema modular interconectado.
- Diseñar módulos que permitan cubrir organizaciones con múltiples áreas/servicios, por ejemplo restaurantes con cafetería, heladería, pastelería y otros servicios.
- Mantener separación conceptual entre JoinOps y CGE.
- Preparar evidencia funcional, arquitectura, propuesta de valor, problema, usuarios, diferenciación, modelo de negocio y roadmap para la postulación.

## 4. Regla de publicación

No fusionar `redesign-v2` a `main` hasta completar:

`auditoría → correcciones → CI real → build producción → staging → pruebas funcionales → revisión visual/responsive → revisión SEO/accesibilidad/seguridad → revisión comercial → respaldo → GO → merge/publicación`

## 5. Posicionamiento de marca a aplicar

JoinHook debe comunicarse como una iniciativa tecnológica seria y profesional que diseña, desarrolla y documenta soluciones digitales, automatización y productos propios. No utilizar lenguaje que sugiera que el negocio existe principalmente como ejercicio personal o de aprendizaje.

La comunicación debe ser rigurosa y transparente, sin exagerar capacidades, clientes, alianzas o resultados que todavía no estén acreditados.

## 6. Separación de productos

- **JoinHook V2:** sitio corporativo y puerta de entrada del ecosistema.
- **JoinOps:** producto estratégico de gestión modular, prioridad de concurso.
- **CGE:** herramienta gastronómica específica, independiente de JoinOps aunque pueda compartir principios y componentes.
- **SnowWise:** producto independiente con su propio ciclo y base de datos de producción.

## 7. Próxima acción autorizada

Continuar desde este registro con la auditoría técnica y funcional de JoinHook V2, empezando por Home, navegación, posicionamiento, proyectos, JoinOps/CGE, contacto, SEO, seguridad y despliegue. Toda modificación de código debe hacerse en rama de trabajo y validarse antes de afectar `main`.

## 8. Nota de continuidad

Este documento funciona como respaldo permanente de las recomendaciones y decisiones tomadas en la conversación de 2026-09-11. Si la conversación se interrumpe, el trabajo puede retomarse desde este documento y desde la rama `redesign-v2`, sin depender de memoria conversacional.
