# 03 — Mi Gestión

## Propósito
Aplicación de administración para pequeños negocios. Su objetivo es transformar la gestión diaria en tareas, responsables, indicadores y procesos trazables.

## Tecnologías candidatas
- **Ruby on Rails:** dominio administrativo y API.
- **Next.js + TypeScript:** PWA y panel de gestión.
- **Django + Python:** analítica y automatización.
- **Laravel + PHP:** alternativa web full-stack.

## Funciones
Tareas; categorías; sucursales; personal; proveedores; indicadores; gráficos; importación/exportación Markdown/CSV; operación offline; temas visuales; respaldo/restauración.

## Estructura prevista
```text
src/modules/tasks/          # tareas
src/modules/staff/          # personal
src/modules/branches/       # sucursales
src/modules/suppliers/      # proveedores
src/modules/reports/        # indicadores
src/lib/storage/             # persistencia local/sincronización
src/components/              # UI
```

## Implementación
Priorizar local-first cuando el caso de uso lo requiera. La sincronización cloud debe ser una capacidad adicional, no una dependencia obligatoria del primer MVP.

## Criterio de terminado
Crear, editar, completar y auditar tareas; administrar entidades básicas; visualizar KPI; exportar/restaurar datos; pruebas automatizadas y documentación de cada archivo.
