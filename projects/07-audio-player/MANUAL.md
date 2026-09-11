# 07 — JoinHook Audio Player

## Propósito
Reproductor multimedia de escritorio para Windows, con identidad visual propia y posibilidad de evolucionar hacia producto distribuible.

## Tecnologías candidatas
- **Ruby on Rails:** catálogo, sincronización y backend opcional.
- **Next.js + TypeScript:** interfaz web/PWA y shell híbrido.
- **Django + Python:** procesamiento multimedia/metadata y servicios.
- **Electron + TypeScript:** aplicación Windows de escritorio.

## Estructura
```text
src/player/               # motor/control
src/ui/                   # interfaz
src/library/              # biblioteca
src/playlists/            # listas
src/settings/             # preferencias
assets/                   # iconos y recursos
backend/                  # opcional
```

## Diseño
Referencia visual: azul petróleo/teal oscuro, crema, naranja de acción, superficies navy/negro y acentos turquesa, adaptados al producto propio.

## MVP
Reproducción → biblioteca → playlists → controles → persistencia local → empaquetado Windows → pruebas.
