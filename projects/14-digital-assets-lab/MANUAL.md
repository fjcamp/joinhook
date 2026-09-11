# 14 — Digital Assets Lab

## Propósito
Laboratorio separado para investigar y desarrollar experiencias con activos digitales. Debe permanecer aislado de los sistemas operacionales y financieros principales.

## Tecnologías candidatas
- Ruby on Rails — APIs y administración.
- Next.js + TypeScript — interfaces web.
- Django + Python — análisis y automatización.
- Laravel + PHP — alternativa web.

## Estructura
```text
experiments/; wallets/; risk/; integrations/; audit/; docs/
```

## Aislamiento
Base de datos, credenciales, wallets y límites de riesgo independientes. Nunca compartir secretos con otros proyectos ni asumir que una prueba experimental está lista para producción.
