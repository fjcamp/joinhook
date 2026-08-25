# JoinHook Local v1 — Definition of Done

Fecha de corte: 2026-08-25.

## Alcance v1

La v1 se considera funcional cuando cumple simultáneamente los siguientes gates:

- [x] Módulo aislado dentro de JoinHook (`/local`).
- [x] Interfaz principal contenida en `100dvh`, sin scroll vertical de página.
- [x] Adaptación de escritorio a móvil sin convertir la experiencia en una columna larga.
- [x] Sistema visual grafito + petróleo + turquesa + cobre con estados semánticos.
- [x] Dominio tipado para ubicación, clima, comercio, catálogo, turismo, editorial y comunidad.
- [x] Gateway desacoplado de la UI.
- [x] Geolocalización con fallback y tratamiento de permiso denegado/no disponible.
- [x] Meteorología en vivo mediante Open-Meteo, sin API key.
- [x] Estados loading, ready, stale, degraded y error.
- [x] Detección online/offline.
- [x] Caché local del último dashboard válido.
- [x] Guardados persistentes en el dispositivo.
- [x] Identificación visible de contenido patrocinado, editorial, turístico y comunitario.
- [x] Manifest PWA y service worker para shell offline.
- [x] Acciones principales y drawers móviles sin scroll vertical de página.
- [ ] CI completo en verde sobre el PR de integración.

## Fuera del cierre v1

Estos elementos pertenecen a iteraciones posteriores y no deben confundirse con defectos de la v1 base: marketplace con pago real, onboarding de comercios autogestionado, moderación multiusuario, panel administrativo completo, recomendaciones personalizadas con IA, chat en tiempo real, campañas comerciales, analítica avanzada y expansión territorial automatizada.

## Gate de publicación

No fusionar a `main` ni desplegar como producción mientras el CI del PR no esté completamente verde. Los datos comerciales presentes en esta rama son demostrativos y deben sustituirse por registros autorizados antes de una publicación comercial pública.
