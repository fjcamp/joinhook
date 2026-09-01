# JoinHook — Empresa, marca y web pública — Handoff 2026-08-31

**Fecha de corte:** 2026-08-31  
**Repositorio:** `fjcamp/joinhook`  
**Rama canónica:** `main`  
**Último commit observado antes de este handoff:** `f30fa361f4b6c129796601e272b05829e6869196` (`feat: private JoinHook Agent Center`)  
**Dominio:** `joinhook.cl`

---

## 0. Instrucción para cualquier IA que retome JoinHook.cl

1. Separar tres capas: **empresa/marca**, **web pública**, **productos que viven o se muestran en el repo**.
2. No afirmar capacidades, clientes, certificaciones, ingresos, equipo, madurez o despliegues que no estén comprobados.
3. Diferenciar explícitamente: disponible, beta, en desarrollo, experimental y planificado.
4. No volver a presentar JoinHook como “aprendiendo mientras construye”. Debe comunicar rigor, transparencia, compromiso y capacidad técnica real sin exageración.
5. Mantener la experiencia profesional del fundador como respaldo contextual, pero sin convertir la web en un CV personal.
6. No mezclar contenido universitario con JoinHook. Los proyectos universitarios son independientes.
7. Antes de cambiar routing/producción en BlueHosting/cPanel, revisar los runbooks y el incidente JH-OPS-002.
8. No activar pagos ni Commerce productivo sin gates técnicos, legales y tributarios.
9. Mantener secretos fuera de repo/chat.
10. Todo cambio público debe tener build, artifact, smoke test desktop/móvil, accesibilidad básica y rollback.

---

## 1. Qué es JoinHook

JoinHook es una empresa/proyecto tecnológico chileno en construcción orientado a diseñar soluciones digitales, software, automatización y productos propios. La IA se usa como acelerador de investigación, diseño, desarrollo, QA, documentación y operación, pero el control de decisiones críticas permanece en manos humanas.

### Propuesta de valor corporativa

**Diseñar y operar soluciones digitales útiles, escalables y trazables, seleccionando la tecnología adecuada para cada problema en lugar de vender una única plataforma.**

### Principios de relación

- transparencia;
- respeto;
- escucha activa;
- claridad de alcance;
- responsabilidad y cumplimiento;
- no exagerar capacidades;
- proteger datos, credenciales e IP;
- evidencia y trazabilidad para decisiones relevantes;
- declarar limitaciones y riesgos;
- control humano final.

---

## 2. Líneas de negocio

### A. Productos propios

- Control Gastronómico Express (CGE).
- SnowWise.
- Mi Gestión Admin.
- JoinOps.
- JoinHook Business OS / Agent Control Plane (primero uso interno).
- JoinHook Pulse / Directorio territorial, sujeto a naming/estrategia actual.
- futuros productos incubados.

### B. Servicios a terceros

JoinHook puede ofrecer:

- diseño y desarrollo web;
- PWA y aplicaciones web;
- software a medida;
- automatización e integraciones;
- arquitectura y modernización;
- paneles/dashboards;
- desarrollo con WordPress/Divi cuando las especificaciones y hosting lo hagan conveniente;
- frontend estático, React/Vite, Next.js u otros stacks según requisitos;
- operación y mejora continua acordada.

### Regla de tecnología

No limitar JoinHook a Divi, WordPress, Next.js o un único stack. Elegir por:

- necesidades del cliente;
- capacidades del hosting;
- presupuesto;
- mantenibilidad;
- seguridad;
- rendimiento;
- autonomía requerida;
- integraciones;
- escalabilidad.

---

## 3. Posicionamiento de la web pública

La web debe responder con claridad:

1. Qué hace JoinHook.
2. Qué problemas resuelve.
3. Qué productos están disponibles y cuál es su estado.
4. Qué servicios se pueden contratar.
5. Cómo contactar/cotizar.
6. Qué principios de privacidad, seguridad y transparencia aplica.

### Arquitectura de contenido sugerida

- Inicio.
- Soluciones/Servicios.
- Productos.
- Control Gastronómico Express.
- SnowWise.
- Mi Gestión / JoinOps como “en desarrollo” si corresponde.
- Cómo trabajamos.
- Seguridad/Privacidad.
- Acerca de JoinHook.
- Contacto/Cotización.
- Condiciones/Privacidad.

### Evitar

- lenguaje grandilocuente sin evidencia;
- claims de “líder”, “mejor”, “revolucionario” sin prueba;
- mezclar pruebas universitarias con portfolio comercial;
- mostrar productos experimentales como disponibles para compra;
- CTA roto o pago accidental.

---

## 4. Estado técnico verificado del repo

### Main

Commits recientes relevantes observados:

- `7c953f27...` — JoinHook Local v1, experiencia no-scroll, PWA, geolocalización, clima, caché y QA.
- `e013e7d0...` — backend territorial y panel administrativo.
- `bc624925...` — Supabase Auth y roles administrativos.
- `c1550610...` — descubrimiento territorial multi-negocio.
- `a2c2c826...` — CRUD administrativo de contenido/catálogo.
- `a52bdd9f...` — cierre de puesta en operación de JoinHook Local y readiness.
- `6746ba5e...` — actualización de contenido público.
- `f30fa361...` — Agent Center privado con sesión HttpOnly, proxy server-side, approvals, audit visibility y kill switch.

### Importante

El repo contiene más que la web corporativa: también CGE, Commerce, JoinHook Local/Pulse y Agent Center. No asumir que todo comparte el mismo ciclo de release.

---

## 5. Producción BlueHosting / cPanel

### Incidente JH-OPS-001

Se documentaron errores por extraer artifact/reiniciar Passenger antes de sincronizar correctamente document root y assets.

### Incidente JH-OPS-002 — routing WordPress

Existe evidencia de que WordPress legacy/.htaccess interceptó rutas internas de la app Next.js, mostrando 404 de WordPress aunque la página existía en Next.

Antes de corregir:

1. respaldar `public_html/.htaccess`;
2. preservar bloque CloudLinux Passenger;
3. revisar reglas WordPress;
4. no borrar a ciegas;
5. desplegar artifact correcto;
6. reiniciar Passenger solo cuando corresponda;
7. smoke-test rutas principales y CGE;
8. comprobar assets públicos/PWA;
9. rollback si falla.

### Restricción operativa histórica

En varias sesiones no hubo SSH/Git/Terminal en cPanel; se trabajó con artifacts/ZIP y despliegue manual. Si esto cambia, verificar antes de asumirlo.

---

## 6. Agent Center en web

El commit `f30fa361...` agregó una superficie privada del Agent Center con:

- sesión firmada HttpOnly;
- proxy server-side;
- approvals;
- visibilidad de auditoría;
- kill switch.

Regla: esta superficie es privada/owner-only. No exponer endpoints/controles por conveniencia visual. La web pública y el plano de control de agentes tienen fronteras distintas.

---

## 7. Estrategia comercial de JoinHook

### Cliente objetivo inicial de servicios

- pymes chilenas;
- turismo/hospitalidad;
- gastronomía;
- comercio local;
- profesionales y negocios que necesitan digitalización/automatización pragmática;
- clientes con infraestructura existente que debe aprovecharse sin sobrecostos.

### Jobs-to-be-done

- “Necesito una web profesional que pueda mantener”.
- “Necesito reemplazar planillas/procesos manuales”.
- “Necesito conectar herramientas y automatizar tareas”.
- “Necesito una app/PWA sin construir infraestructura empresarial innecesaria”.
- “Necesito mejorar una solución ya existente sin rehacer todo”.

### Modelo de ingresos

**Servicios:**

- proyecto cerrado por alcance;
- discovery/diagnóstico;
- implementación;
- mantenimiento/soporte;
- integración/automatización;
- mejoras evolutivas.

**Productos:**

- licencia/suscripción según producto;
- compra única si el producto lo justifica;
- planes premium/modulares con valor claro;
- servicios de onboarding/integración.

### Política comercial

- alcance y precio explícitos;
- no prometer fechas/capacidades sin evaluación;
- cambios de alcance documentados;
- propiedad intelectual y licencias definidas;
- respaldo/entrega acordados;
- datos del cliente exportables cuando corresponda.

---

## 8. Plan de negocio de JoinHook

### Problema de mercado

Muchas pymes necesitan digitalización pero enfrentan dos extremos: herramientas genéricas rígidas o desarrollos complejos/costosos. JoinHook busca ocupar el espacio de soluciones pragmáticas, modulares y adecuadas a la infraestructura real.

### Ventaja inicial

- conocimiento de operaciones gastronómicas/turismo/hospitalidad;
- capacidad de prototipar productos propios;
- enfoque multi-stack;
- automatización gobernada;
- costos controlados;
- diseño de continuidad/documentación desde el inicio.

### Estrategia de ingresos tempranos

1. servicios web/software de alcance acotado;
2. CGE como producto de entrada;
3. SnowWise como producto/experiencia vertical;
4. Mi Gestión para usuario individual;
5. JoinOps como producto B2B más amplio cuando exista MVP validado.

### Objetivo de corto plazo

Generar ingresos con una oferta simple y comprensible antes de expandir productos de alta complejidad.

### Costos a controlar

- hosting/dominios;
- bases de datos;
- correo;
- storage;
- observabilidad;
- APIs de terceros;
- uso de IA;
- soporte;
- herramientas de diseño/desarrollo.

### Métricas corporativas

- leads calificados/mes;
- propuestas enviadas;
- conversión;
- ingreso mensual;
- margen bruto;
- cash runway;
- tiempo promedio de entrega;
- incidentes post-entrega;
- satisfacción;
- MRR/ARR de productos cuando aplique;
- churn;
- costo de infraestructura por producto.

---

## 9. Formalización — continuidad

JoinHook planea formalizarse como SpA en Chile con costo mínimo posible y gobernanza clara.

Mantener como trabajo separado y riguroso:

- constitución;
- giros;
- inicio de actividades SII;
- domicilio;
- patente municipal cuando corresponda;
- INAPI/marca;
- contratos;
- privacidad;
- tributación;
- obligaciones laborales;
- gobierno societario.

No habilitar cobros productivos ni emitir afirmaciones tributarias definitivas basadas solo en memoria: usar fuentes oficiales vigentes al momento de ejecución.

---

## 10. Roadmap de web/empresa

### P0

- mantener repo/CI sano;
- cerrar routing productivo JH-OPS-002 con evidencia;
- verificar navegación/CTA/contacto;
- revisar que estados de productos sean exactos;
- revisar privacidad/condiciones;
- confirmar analytics solo con configuración respetuosa y documentada.

### P1

- mejorar arquitectura de información y conversión;
- portfolio de servicios con casos/prototipos reales;
- formulario de discovery/cotización;
- CRM/lead capture mínimo;
- Revenue Intelligence respetando privacidad.

### P2

- contenido SEO útil por vertical;
- automatización de seguimiento;
- panel interno de marketing/ventas.

### P3

- escalar productos y servicios con evidencia de demanda.

---

## 11. Bitácora resumida

### 2026-08-25

- JoinHook Local avanzó desde PWA no-scroll a backend territorial, Auth/RBAC, discovery multi-negocio, CRUD administrativo, importación y readiness.

### 2026-08-29

- Se actualizó contenido público de JoinHook.
- Se agregó Agent Center privado owner-only.

### 2026-08-30

- En JoinHook OS se consolidó estrategia de Design Experience Guild y Divi como capacidad de servicio. Esta decisión debe reflejarse en la oferta web sin encerrar la empresa en una tecnología.

### 2026-08-31

- Se crea handoff integral de empresa/web.

---

## 12. Instrucción lista para otra IA

```text
Estoy retomando JoinHook empresa/web.
Fuente canónica: fjcamp/joinhook + docs/continuity/JOINHOOK_COMPANY_AND_WEB_HANDOFF_2026-08-31.md.
Antes de cambiar producción revisa JH-OPS-001/JH-OPS-002, BlueHosting/cPanel y el estado real de cada producto.
No mezcles contenido universitario con JoinHook ni presentes prototipos como productos terminados.
No actives pagos ni cambios productivos de alto impacto sin gates y aprobación humana.
Primero verifica main, CI, routing, CTA, privacidad y artifacts; luego continúa desde P0.
```

**Fin del handoff — corte 2026-08-31.**
