# JoinHook Local — Infraestructura

## Estado actual

La plataforma se encuentra en **Alpha estructural / pre-MVP funcional**. La interfaz v0.6 deja de ser un prototipo HTML aislado y pasa a una arquitectura React/Next.js integrada en JoinHook.cl.

## Principios vigentes

- Una sola pantalla operativa (`100dvh`).
- Sin scroll vertical en el workspace principal.
- Responsive por reducción y sustitución de paneles, no por apilar una página infinita.
- UI desacoplada de las fuentes de datos.
- Datos externos consumidos mediante gateways/adapters.
- Separación explícita entre contenido orgánico, editorial, comunitario y patrocinado.
- Verificación como atributo de dominio, no como decoración visual.
- Preparada para PWA, geolocalización, clima, Supabase y APIs externas.

## Capas

1. `src/pages/local.tsx`: punto de entrada de la experiencia.
2. `src/features/local/LocalShell.tsx`: composición de viewport y estados de interacción.
3. `src/features/local/LocalShell.module.css`: design tokens, layout y responsive.
4. `src/features/local/types.ts`: contratos de dominio.
5. `src/features/local/services.ts`: interfaz de datos y adapter demo reemplazable.

## Próximos adapters

- `WeatherGateway`: proveedor meteorológico + fallback + timestamp de actualización.
- `GeoGateway`: GPS con consentimiento + localidad aproximada cuando GPS no esté disponible.
- `CommerceRepository`: comercios, productos, horarios, ofertas y patrocinio.
- `TourismRepository`: operadores, experiencias, idiomas, permisos y verificación.
- `EditorialRepository`: noticias/eventos con fuente, fecha y derechos.
- `CommunityRepository`: espacios comunitarios con control de consentimiento y moderación.

## Línea de tiempo

- Fase 1 — Concepto y arquitectura de producto: completada.
- Fase 2 — UX/UI Alpha: completada en su estructura principal; refinamiento continuo.
- Fase 2.5 — Infraestructura frontend modular: **en curso**.
- Fase 3 — MVP conectado a datos reales: siguiente gate.
- Fase 4 — Backoffice y flujos de publicación: pendiente.
- Fase 5 — PWA, QA, observabilidad y rendimiento: pendiente.
- Fase 6 — Piloto territorial: pendiente.

## Gate para iniciar Fase 3

Se considera listo cuando el shell compile en producción, mantenga el viewport sin scroll vertical en desktop/tablet/mobile y los gateways demo puedan sustituirse por adaptadores reales sin modificar los componentes de presentación.
