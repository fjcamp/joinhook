# JoinHook — Checkpoint Web Audit — 2026-09-14

## Estado

Checkpoint de continuidad previo al inicio de una nueva etapa de desarrollo de la web institucional de JoinHook.cl.

## Referencia oficial

- Repositorio: `fjcamp/joinhook`
- Rama de referencia: `main`
- HEAD oficial auditado: `fe9df1666e5e5e196cdd334557f5892f49c40db`
- El checkpoint anterior de JoinHook/Penpot permanece en el commit anterior de `main`.

## Decisión estratégica

Se decide **no bloquear el levantamiento de la web por Figma/Penpot**.

La web se desarrollará directamente sobre la base existente de Next.js/React/TypeScript, utilizando como contrato visual las decisiones ya definidas para JoinHook. Figma/Penpot quedarán como herramientas de refinamiento visual posterior y no como dependencia para iniciar el desarrollo.

## Auditoría de ramas

La rama `feat/commerce-core-mercadopago` fue auditada y no debe utilizarse como base directa para la nueva web institucional.

Estado comparado contra `main`:

- `feat/commerce-core-mercadopago`: `b0e65dfd30700dfbb53a7fc8e57385398f50bbba`
- `main`: `fe9df1666e5e5e196cdd334557f5892f49c40db`
- divergencia: rama Commerce 158 commits por delante y 27 por detrás de `main`
- estado: `diverged`

La rama Commerce conserva trabajo de Mercado Pago/Commerce, APIs, webhooks, control plane, documentación y workflows. No se debe hacer un merge masivo de esos 158 commits hacia `main` para construir la web institucional.

## Base web existente en `main`

`main` ya contiene una aplicación funcional basada en:

- Next.js 16.3
- React 19
- TypeScript
- Tailwind CSS 4
- PWA/Service Worker para Control Gastronómico Express
- GitHub como fuente de verdad
- flujo de staging antes de producción

La Home ya existe en `src/pages/index.tsx` y contiene header, navegación, hero, capacidades, proyectos, producto/herramientas, CTAs, SEO y datos estructurados.

## Diagnóstico de la Home actual

La Home existente es reutilizable técnicamente, pero su narrativa corresponde a una versión anterior de JoinHook. Actualmente comunica principalmente JoinHook como espacio para investigar, diseñar y construir productos digitales.

Debe evolucionar hacia el posicionamiento oficial actual:

JoinHook acompaña, diagnostica, ordena, diseña, conecta e impulsa negocios y proyectos vinculados principalmente con turismo, hospitalidad, gastronomía, ecoturismo, emprendimientos y territorio.

La tecnología se presenta como medio y herramienta proporcional a la necesidad, no como identidad principal de JoinHook.

## Sistema visual a implementar directamente en código

- Lora para titulares.
- Inter para cuerpo/UI.
- Paleta natural: verde bosque, terracota, crema, piedra y carbón.
- Lenguaje humano, natural, profesional, territorial y sobrio.
- Evitar estética SaaS, neon, glassmorphism, dashboards como identidad principal y apariencia excesivamente tecnológica.

## Método JoinHook

La comunicación debe incorporar el método:

**Escuchamos → Observamos → Ordenamos → Diseñamos → Conectamos → Impulsamos**

## Arquitectura web objetivo

- Inicio
- Qué hacemos
- Cómo trabajamos
- Proyectos
  - JoinOps
  - SnowWise
  - otros proyectos
- Sobre mí
- Colaborar
- Notas
- Contacto
- Legal

Control Gastronómico Express puede permanecer como herramienta/producto dentro de la arquitectura, sin convertirse en el centro de la identidad institucional.

## Próximo paso obligatorio

Antes de modificar el workspace local:

1. auditar `C:\Proyectos\joinhook`;
2. comprobar `git status`;
3. comprobar rama actual;
4. comprobar HEAD local;
5. `git fetch origin`;
6. comparar HEAD local con `origin/main`;
7. revisar `git diff` y `git diff --cached`;
8. proteger los cambios locales existentes, especialmente `next-env.d.ts` y `tsconfig.json` si continúan modificados;
9. confirmar que no existen cambios locales que puedan perderse.

No ejecutar `reset`, `clean`, `checkout` destructivo, `stash`, `force-push` ni sobrescritura de cambios locales sin autorización explícita.

## Rama de desarrollo propuesta

Una vez validado el workspace local, crear una rama nueva desde `main`, propuesta:

`feat/joinhook-web-v1`

No crearla desde `feat/commerce-core-mercadopago`.

## Orden de desarrollo

1. identidad visual en código;
2. navegación/header;
3. Home institucional;
4. páginas internas prioritarias;
5. responsive móvil/desktop;
6. SEO y metadata;
7. contacto y CTAs;
8. accesibilidad;
9. QA/build;
10. staging;
11. validación;
12. producción.

## Principio de velocidad

La prioridad es disponer de una web JoinHook.cl funcional, profesional y publicable cuanto antes. No esperar a completar Figma/Penpot ni diseñar cada píxel antes de implementar.

## Separación de proyectos

Este checkpoint corresponde exclusivamente a **JoinHook**. No debe confundirse con checkpoints de `fjcamp/joinops`.

## Seguridad y despliegue

- No introducir secretos en GitHub.
- Mantener BlueHosting sin depender de terminal/SSH.
- No alterar producción sin backup, staging, validación y rollback posible.
- Vercel/otras plataformas pueden evaluarse como infraestructura futura, pero no implican migración automática.

## Estado al cierre del checkpoint

No se ha modificado código de la web durante esta auditoría.
No se ha hecho merge de Commerce.
No se ha modificado Figma/Penpot.
La siguiente sesión debe comenzar por la auditoría del workspace local y, una vez protegido, preparar `feat/joinhook-web-v1` desde `main`.
