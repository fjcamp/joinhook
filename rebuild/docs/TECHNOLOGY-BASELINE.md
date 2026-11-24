# Base tecnológica inicial — 24-11-2026

| Componente | Base inicial | Pendiente |
|---|---:|---|
| Node.js | 24.15.x | Confirmar runtime disponible en el hosting al llegar al despliegue |
| Angular / CLI | 22.3.0 | Instalar y validar en CI |
| NestJS Core | 12.6.0 | Instalar y validar en CI |
| Nest CLI / Schematics | 12.0.15 | Instalar y validar en CI |
| TypeScript | 6.0.3 | Instalar y validar en CI |
| RxJS | ^7.8.2 | Verificar lockfile |
| PostgreSQL | Versión por confirmar | Probar conectividad en staging antes de uso |
| ORM | Sin decisión | No incorporar sin aprobación técnica |

## Compatibilidad
Angular 22 declara soporte para Node `^22.22.3 || ^24.15.0 || ^26.0.0`, TypeScript `>=6.0.0 <6.1.0` y RxJS `^6.5.3 || ^7.4.0`. Nest 12 requiere runtime moderno; sus herramientas de generación requieren Node 22.22.3+ o 24.15+ o 26+.

## Fuentes oficiales
- Angular releases: https://angular.dev/reference/releases
- Angular compatibility: https://angular.dev/reference/versions
- Angular CLI 22.3.0: https://www.npmjs.com/package/@angular/cli
- Angular Core 22.3.0: https://www.npmjs.com/package/@angular/core
- Nest compatibility: https://docs.nestjs.com/faq/versions
- NestJS 12 migration: https://docs.nestjs.com/migration-guide
- Nest Core 12.6.0: https://www.npmjs.com/package/@nestjs/core
- Nest CLI 12.0.15: https://www.npmjs.com/package/@nestjs/cli

Estas versiones son una línea base propuesta de construcción cloud-first, no una prueba de instalación, compilación ni disponibilidad en BlueHosting. Se revisarán de nuevo al abrir la fase build.
