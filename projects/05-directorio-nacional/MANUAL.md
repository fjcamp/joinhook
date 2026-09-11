# 05 — Directorio Nacional

## Propósito
Plataforma nacional para descubrir turismo, comercio, servicios, eventos, cultura, medios locales y experiencias territoriales de Chile.

## Tecnologías candidatas
- **Ruby on Rails:** catálogo, cuentas, moderación y API.
- **Next.js + TypeScript:** experiencia de búsqueda, fichas y PWA.
- **Django + Python:** geodatos, ranking y procesamiento.
- **Laravel + PHP:** alternativa de despliegue web económico.

## Estructura
```text
catalog/                 # entidades publicadas
locations/               # regiones, comunas y geografía
search/                  # búsqueda y filtros
publishers/              # negocios/organizaciones
moderation/              # validación
seo/                     # páginas indexables
web/                     # interfaz
```

## Principios
SEO desde diseño; información verificable; ubicación; fichas claras; arquitectura visual sin scroll cuando sea viable; soporte de contenido territorial y cultural con respeto.

## MVP
Catálogo → búsqueda → fichas → geolocalización → publicación/moderación → SEO → analítica.
