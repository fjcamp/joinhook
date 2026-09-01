# JoinHook Local / Pulse / Directorio territorial — Handoff técnico y de negocio

**Fecha de corte:** 2026-08-31  
**Repositorio actual con implementación verificable:** `fjcamp/joinhook`  
**Superficie pública:** `/local`  
**Administración:** `/local-admin`  
**Estado:** implementación territorial funcional en `main`, con evolución conceptual previa bajo nombres “Directorio Nacional” y “JoinHook Pulse”. El naming y la arquitectura histórica deben reconciliarse antes de escalar.

---

## 0. Instrucción obligatoria para otra IA

1. Antes de modificar, resolver la identidad del producto: **JoinHook Local**, **JoinHook Pulse** y **Directorio Nacional** corresponden a evoluciones del mismo espacio de problema, pero no asumir que todos los contratos históricos siguen vigentes.
2. Tomar el código actual de `fjcamp/joinhook` como fuente de verdad técnica para lo que está implementado hoy.
3. Tomar handoffs históricos de Pulse solo como antecedentes de producto/arquitectura; no reintroducir Neon/PostGIS u otras capas sin ADR si el runtime actual usa Supabase.
4. No prometer streaming, marketplace, checkout, comunidad abierta, traducción automática ni monetización si no están implementados y verificados.
5. Mantener privacidad por diseño: ubicación con permiso, minimización, revocación y no venta de perfiles personales.
6. No publicar contenido administrativo sin moderación/estado `published`.
7. Mantener escritura pública cerrada; mutaciones solo server-side con Auth/RBAC.
8. No compartir `service_role`, setup tokens ni secretos.
9. Cualquier geolocalización debe degradar con seguridad y funcionar sin exigir ubicación si el usuario no la concede.
10. Registrar naming, decisiones de datos e integraciones mediante ADR/bitácora antes de expandir.

---

## 1. Visión del producto

El espacio de producto busca crear una experiencia territorial dinámica para descubrir comercios, servicios, turismo, eventos, señales locales y contenido editorial relevante según contexto y preferencias.

### Propuesta de valor

**Ayudar a una persona a descubrir qué puede hacer, comprar, visitar o conocer cerca de ella mediante una experiencia visual rápida y contextual, mientras los negocios locales obtienen visibilidad y oportunidades de contacto sin obligar al producto a convertirse de inmediato en marketplace transaccional.**

### Cliente/usuario dual

**Usuario final:** persona que busca opciones locales, turismo, servicios, actividades o comercio relevante.

**Negocio/operador:** comercio, experiencia, prestador turístico, pyme, editorial local u operador territorial que necesita presencia, catálogo y señales actualizadas.

---

## 2. Evolución conceptual

### Directorio Nacional

Idea inicial amplia:

- turismo;
- comercios;
- pymes;
- eventos;
- editoriales locales;
- comunidades indígenas;
- perfiles/catalogo;
- ubicación y recomendaciones;
- interfaz dinámica sin scroll vertical.

### JoinHook Pulse 0.2 — antecedente

Un handoff previo documentó una arquitectura React/TypeScript + Cloudflare Workers + Neon/PostGIS, con entidades territoriales y preferencias. Ese checkpoint no estaba production-ready: el build real npm/CI/staging quedaba pendiente.

### JoinHook Local — implementación actual en `main`

La implementación actual usa el repo `joinhook` y un backend territorial en Supabase con:

- `local_businesses`;
- `local_catalog_items`;
- `local_signals`;
- `local_moderation_log`;
- `local_user_roles`;
- Supabase Auth;
- RLS;
- roles admin/editor/moderator/viewer;
- API server-side;
- dataset local de contingencia;
- geolocalización/clima;
- discovery multi-negocio;
- CRUD administrativo;
- setup inicial seguro;
- importación y readiness.

### Decisión pendiente P0

Documentar mediante ADR si:

A. **JoinHook Local** es el nombre definitivo y reemplaza Pulse/Directorio; o
B. **Pulse** será marca comercial y “Local” nombre técnico; o
C. se separan en productos distintos.

No desarrollar branding/marketing masivo antes de esta decisión.

---

## 3. Estado técnico actual verificado

Commits relevantes en `main`:

- `7c953f278d86eb20df923f8974271deccb6feb8d` — JoinHook Local v1: shell `100dvh` sin scroll vertical, dominio tipado, gateway desacoplado, geolocalización, clima Open-Meteo, caché, favoritos, contingencia, PWA y QA.
- `e013e7d0a2c232baf6ef10081ab5feb9f2a1b817` — backend territorial y panel administrativo.
- `bc6249252086d2ad388af1211a7ba4c0d91b17b8` — Supabase Auth y RBAC.
- `c155061020b0b7cef09fb499fc85be9b80eef736` — discovery territorial multi-negocio.
- `a2c2c8262687014106753e461d9f6a52ab522db7` — CRUD administrativo de contenido/catálogo.
- `a52bdd9fbf1bb89c3f63bfd992fe02aa4e418ce2` — readiness, wizard primer admin, importación autenticada y checklist.

### Backend actual

El documento `docs/joinhook-local-backend.md` indica que Local usa infraestructura PostgreSQL Supabase y tablas `local_*` aisladas del dominio `commerce_*`.

### Lectura pública

Solo contenido `published` puede leerse públicamente. No existe política pública de escritura.

### Administración

Cada llamada administrativa valida JWT y rol server-side. Las mutaciones generan auditoría en `local_moderation_log`.

### Degradación

Si Supabase falla/no está configurado:

- `/local` puede mantener dataset local de contingencia y clima/geolocalización;
- administración debe fallar cerrada.

---

## 4. Arquitectura actual vs arquitectura histórica

### Actual verificable

- Next.js/React/TypeScript dentro de `fjcamp/joinhook`.
- Supabase/PostgreSQL para backend territorial actual.
- Auth/RLS/RBAC server-side.
- PWA/local cache.
- Open-Meteo para clima.

### Histórica documentada en Pulse

- React/TypeScript PWA.
- Cloudflare Worker/BFF.
- Neon/PostGIS.
- edge cache/queues.

### Regla de continuidad

No mezclar ambas arquitecturas. Primero hacer un **ADR de convergencia**:

- ¿se necesita PostGIS hoy?;
- ¿Supabase actual satisface geospatial/discovery?;
- ¿Cloudflare Worker aporta un caso medible?;
- ¿qué costo/operación agrega?;
- ¿cómo migrar datos sin pérdida?;
- ¿qué pruebas justifican el cambio?

Hasta entonces, mantener el stack actual estable.

---

## 5. Experiencia de usuario

### Principios

- una superficie de alto aprovechamiento visual;
- evitar scroll vertical cuando el diseño lo permita sin sacrificar accesibilidad;
- carruseles/rails para descubrimiento;
- tarjetas con contenido jerarquizado;
- contexto de proximidad sin forzar GPS;
- favoritos persistentes;
- estados de contingencia;
- navegación rápida móvil;
- movimiento/animación subordinados a legibilidad y rendimiento;
- `prefers-reduced-motion`.

### No convertir en “feed infinito” por defecto

El valor debe provenir de relevancia local y contexto, no de maximizar tiempo de pantalla.

---

## 6. Modelo de contenido y moderación

### Tipos actuales/compatibles

- negocio/comercio;
- catálogo/producto/servicio;
- oferta/señal;
- editorial;
- turismo;
- evento;
- comunidad si se habilita en futuro con gobernanza adecuada.

### Estados

Recomendación:

- draft;
- pending_review;
- published;
- paused;
- rejected;
- archived.

### Regla de publicación

Nada aportado por operador/tercero debe publicarse automáticamente si afecta seguridad, veracidad, precios, ubicación o reputación sin reglas de moderación verificables.

---

## 7. Privacidad y cumplimiento

Diseñar desde el inicio para el marco chileno aplicable, incluyendo la nueva Ley 21.719 cuando entre en vigencia, además de protección al consumidor, comercio electrónico, propiedad intelectual y comunicaciones comerciales.

### Reglas de producto

- ubicación solo con permiso;
- permitir uso sin ubicación;
- consentimiento granular cuando corresponda;
- revocación;
- minimización;
- retención limitada;
- no vender perfiles personales;
- secretos solo backend;
- logs minimizados;
- contratos con proveedores/encargados cuando proceda;
- proceso de incidentes;
- evidencia de origen/vigencia para datos sensibles o normativos.

No usar este documento como asesoría legal definitiva: revalidar normativa vigente antes del lanzamiento.

---

## 8. Propuesta de negocio

### Estrategia MVP recomendada

**Discovery + catálogo + lead generator + redirección al comercio**, antes de operar checkout propio.

Esto reduce:

- carga tributaria/transaccional inicial;
- fraude/refunds;
- complejidad de pagos;
- soporte;
- responsabilidad logística.

### Fuentes de ingresos posibles

1. ficha premium verificada;
2. contenido destacado claramente identificado;
3. suscripción de negocio por herramientas/analytics;
4. leads/contactos medibles;
5. campañas territoriales;
6. servicios de digitalización de catálogo;
7. comisión transaccional solo en una etapa futura si existe infraestructura y compliance suficientes.

### Segmentos

- turismo;
- gastronomía;
- comercio local;
- experiencias;
- servicios;
- eventos;
- pymes regionales;
- municipios/destinos/organizaciones como potenciales alianzas, no como clientes asumidos.

### Diferenciador

Combinar descubrimiento territorial, contexto, contenido y catálogo en una experiencia visual rápida, con datos administrables y trazabilidad, evitando depender de un feed social genérico.

---

## 9. Métricas

### Usuario

- sesiones con descubrimiento útil;
- fichas abiertas;
- favoritos;
- clics a contacto/mapa/web del negocio;
- búsquedas resueltas;
- uso con/sin ubicación;
- retorno 7/30 días.

### Negocio

- leads generados;
- CTR a canales del comercio;
- fichas actualizadas;
- tiempo hasta aprobación;
- conversión de prueba a plan;
- churn de operadores;
- ingresos por negocio;
- contenido rechazado/moderado.

### Calidad

- contenido desactualizado;
- errores de ubicación;
- incidentes de moderación;
- latencia;
- disponibilidad;
- tasa de fallbacks;
- permisos/RLS fallidos correctamente.

---

## 10. Roadmap

### P0 — Identidad y arquitectura

1. Resolver naming Local/Pulse/Directorio.
2. ADR Supabase actual vs Neon/PostGIS histórico.
3. Inventariar esquema actual y migrations.
4. CI/build/smoke tests.
5. separar claramente Local de Commerce aunque compartan infraestructura.

### P1 — Calidad territorial

- ingestión administrada;
- verificación/frescura;
- búsqueda/filtros;
- categorías;
- geospatial suficiente;
- favoritos;
- métricas básicas.

### P2 — Operadores

- onboarding;
- autoservicio controlado;
- catálogo;
- actualización;
- moderación;
- analítica.

### P3 — Monetización no transaccional

- premium/featured;
- lead generation;
- campañas;
- suscripción.

### P4 — Personalización

- preferencias;
- feedback;
- recomendaciones explicables;
- consentimiento.

### P5 — Marketplace/transacción

Solo si existe evidencia de demanda y se completan pagos, soporte, impuestos, fraude, reembolsos, contratos y seguridad.

---

## 11. Bitácora resumida

### 2026-08-25

- Se documentó checkpoint Pulse 0.2 Alpha 2 con visión territorial, arquitectura Neon/PostGIS y build real pendiente.
- En `joinhook` main, JoinHook Local evolucionó rápidamente: PWA no-scroll, backend territorial, Auth/RBAC, discovery, CRUD e importación/readiness.

### 2026-08-29

- El repo `joinhook` recibió contenido público y Agent Center; Local permanece como dominio dentro del mismo repo.

### 2026-08-31

- Se crea este handoff y se marca explícitamente la divergencia histórica de naming/arquitectura para evitar que otra IA “fusione” diseños incompatibles sin decisión.

---

## 12. Instrucción lista para otra IA

```text
Estoy retomando JoinHook Local/Pulse.
Fuente técnica actual: fjcamp/joinhook main + docs/continuity/JOINHOOK_LOCAL_PULSE_HANDOFF_2026-08-31.md.
Los handoffs antiguos de Pulse/Neon/PostGIS son antecedentes, no una orden de migración.
Primero resuelve mediante ADR el naming Local/Pulse/Directorio y la arquitectura Supabase actual vs Neon/PostGIS histórica. No mezcles bases ni cambies proveedor sin evidencia.
Mantén lectura pública solo para published, escritura server-side con Auth/RBAC/auditoría y privacidad de ubicación.
Prioriza discovery + catálogo + leads antes de checkout.
```

**Fin del handoff — corte 2026-08-31.**
