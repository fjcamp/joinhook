# 06 — SnowWise

## Propósito
Experiencia digital para nieve y montaña: clima, historial, preparación, seguridad, centros de esquí y funciones como lista personal de elementos para llevar.

## Tecnologías candidatas
- **Ruby on Rails:** backend, usuarios, pasaporte y contenido.
- **Next.js + TypeScript:** PWA y experiencia web.
- **Django + Python:** datos meteorológicos, históricos y analítica.
- **Laravel + PHP:** alternativa backend/web económica.

## Estructura
```text
app/                     # aplicación
weather/                 # proveedores y normalización
mountains/               # centros/zonas
passport/                # Pasaporte SnowWise
packing/                 # lista personal para llevar
alerts/                  # avisos
pwa/                     # instalación/offline
```

## Integraciones
APIs meteorológicas con fallback; geolocalización; almacenamiento cloud sólo cuando corresponda. Las claves deben vivir fuera del repositorio.

## MVP
Clima actual → historial/fallback → lugares → packing list → Pasaporte → PWA → pruebas Android.

## Estado documental
El repositorio `fjcamp/snowwise` contiene código del proyecto; este manual define el estándar de documentación que debe acompañarlo.
