# 02 — JoinOps

## Propósito
Sistema modular de gestión operacional para organizaciones y negocios. Debe permitir representar organizaciones con distintas áreas y servicios, por ejemplo restaurantes con cafetería, heladería, pastelería y otros servicios interconectados.

## Tecnologías candidatas
- **Ruby on Rails:** backend modular, multiempresa, workflows y APIs.
- **Next.js + TypeScript:** panel operacional, PWA y dashboard sin scroll.
- **Django + Python:** analítica, planificación y automatización avanzada.
- **Laravel + PHP:** alternativa full-stack de rápida implantación.

## Módulos iniciales
Organización; sucursales; áreas/servicios; usuarios/roles; tareas; turnos; inventario; compras; proveedores; ventas; indicadores; incidencias; reportes; auditoría.

## Estructura prevista
```text
app/
  core/                 # organización, usuarios y permisos
  operations/           # tareas y procesos
  services/             # cafetería, heladería, pastelería, etc.
  inventory/            # stock y movimientos
  purchasing/           # compras y proveedores
  analytics/            # KPI y reportes
web/                    # interfaz
api/                    # contratos
workers/                # trabajos asíncronos
```

## Archivo y documentación
Cada módulo debe mantener su código junto a pruebas. `FILE-MAP.md` debe registrar ruta, responsabilidad, entradas/salidas y dependencias de cada archivo.

## Principio clave
Los servicios comparten organización, usuarios y datos maestros, pero no deben mezclar reglas de negocio sin contratos explícitos.

## Fases
Modelo organizacional → operaciones → inventario/compras → indicadores → integraciones → PWA/offline → pruebas piloto.
