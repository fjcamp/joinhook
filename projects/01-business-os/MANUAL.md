# 01 — JoinHook Business OS

## Propósito
Plataforma central de gestión de JoinHook. Es una experiencia unificada para el usuario, pero técnicamente federada por dominios: Revenue/CRM/Marketing/Ventas/SEO-SEM, Finance & Tax, Legal/Contracts/SERNAC/Compliance/RRHH, Agent Control Plane, auditoría/seguridad/backups y módulos de productos.

## Límites
No convertirlo en un monolito sin fronteras. Cada dominio debe tener contratos claros y su propia lógica de negocio.

## Tecnologías candidatas
| Opción | Uso |
|---|---|
| Ruby on Rails | Backend modular, reglas de negocio, APIs y administración. |
| Next.js + TypeScript | Shell web, dashboard sin scroll y PWA. |
| Django + Python | Analítica, procesos de datos y servicios especializados. |
| Laravel + PHP | Alternativa full-stack para módulos web/hosting tradicional. |

**Ruta recomendada inicial:** Next.js + TypeScript en frontend y Rails como alternativa backend de referencia; PostgreSQL como persistencia.

## Módulos
CRM/Ventas; Marketing/SEO-SEM; Finanzas/Tributación/Tesorería; Legal/Compliance/RRHH; Agent Control Plane; Auditoría/Seguridad/Backups; integración con productos.

## Estructura prevista
```text
src/
  app/                 # shell y rutas
  modules/             # dominios del OS
  components/          # UI compartida
  lib/                 # clientes e infraestructura
  security/            # permisos y políticas
docs/                  # documentación técnica
infra/                 # despliegue e IaC
```

## Archivos documentales
`README.md`: resumen. `MANUAL.md`: implementación. `ARCHITECTURE.md`: fronteras. `FILE-MAP.md`: mapa de archivos. `DATA-MODEL.md`: entidades. `API.md`: contratos. `SECURITY.md`: controles. `TESTING.md`: pruebas. `DEPLOYMENT.md`: despliegue. `DECISIONS.md`: decisiones. `CHANGELOG.md`: cambios.

## Integraciones
Supabase/PostgreSQL, Vercel, GitHub, BlueHosting para servicios auxiliares y n8n Community Edition sólo para automatización/orquestación.

## Fases
1. Shell y autenticación/roles. 2. CRM y operaciones. 3. Finanzas/legal. 4. agentes y auditoría. 5. despliegue PWA/.exe compartiendo backend.

## Criterio de terminado
Cada módulo debe tener pruebas, permisos, auditoría mínima, documentación y estrategia de backup/rollback.
