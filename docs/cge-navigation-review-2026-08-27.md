# Control Gastronómico Express — revisión de navegación y UX

Fecha: 2026-08-27

## Estado observado

Control Gastronómico Express mantiene correctamente el alcance de MVP local-first: dashboard, inventario, compras, mermas, proveedores, historial de movimientos, importación/exportación CSV y respaldo/restauración JSON. El estado se persiste en el navegador del dispositivo. No incluye todavía login, sincronización multi-dispositivo, POS/SII, recetas/producción, integraciones externas ni reportería contable.

La navegación previa tenía seis destinos del mismo nivel: Resumen, Inventario, Compras, Mermas, Proveedores y Respaldo. El flujo funciona, pero en pantallas pequeñas el patrón de sidebar no prioriza suficientemente las tareas repetitivas y no diferencia operación diaria de funciones de menor frecuencia.

## Benchmark público revisado

### Restaurant365

- Dashboard como punto de entrada.
- Navegación móvil persistente para flujos principales.
- Menú `More` para funciones secundarias.
- Acciones de creación concentradas y consistentes.
- Inventario, órdenes, transferencias y waste log accesibles desde el dashboard operativo.

### MarketMan

- Dashboard central para inventario, compras, proveedores, costos y reportes.
- Prioriza alertas de inventario, compras y reducción de desperdicios.
- Mantiene el flujo back-of-house concentrado en una sola plataforma.

### Toteat Chile

- Organiza la operación alrededor de inventario, costos, proveedores, alertas y reportes.
- Destaca interfaz simple, orientada a roles y de aprendizaje rápido.
- Diferencia operación diaria de módulos administrativos/avanzados.

### MarginEdge

- Home dashboard común para usuarios.
- Superficie ventas, presupuestos, compras y alertas de precios directamente al iniciar.
- La navegación visible depende del nivel/rol del usuario.

## Principios adoptados para CGE

1. `Resumen` continúa como landing operacional.
2. Inventario, Compras y Mermas permanecen como flujos prioritarios.
3. Proveedores se trata como abastecimiento, no como operación inmediata.
4. Respaldo se mantiene accesible pero visualmente secundario: es una función de datos/continuidad, no una tarea diaria.
5. Escritorio conserva rail persistente; tablet compacta el rail; móvil adopta barra inferior persistente.
6. Acciones frecuentes deben ser visibles desde el dashboard y desde cada vista contextual.
7. No se agregan módulos de ERP que excedan el alcance del MVP.

## Mejoras aplicadas en esta rama

- Nueva capa `src/css/cge-navigation-v1.css`.
- Jerarquía visual de navegación de operación diaria.
- Rail compacto para tablet.
- Barra inferior persistente en móvil para reducir pasos.
- Topbar sticky con contexto visible al desplazarse.
- Estados activos y foco de teclado más claros.
- Mejor feedback táctil/hover para acciones rápidas.
- Ajuste de PWA status para convivir con la barra inferior.
- Respeto de `prefers-reduced-motion`.

## Gaps funcionales detectados para la siguiente iteración

### Prioridad alta

- Vista completa de `Actividad / Movimientos`, no solo los seis últimos eventos del dashboard.
- Filtros por fecha y categoría en compras, mermas y movimientos.
- Indicador de última copia de seguridad y recordatorio de respaldo cuando haya cambios recientes.
- Flujo de cierre/chequeo diario simple: stock crítico, compras pendientes, mermas del día y respaldo.

### Prioridad media

- Órdenes de compra separadas de recepción de mercadería.
- Plantillas de compra por proveedor.
- Variación de costo por producto/proveedor.
- Conteo físico guiado de inventario.
- Métricas por período en lugar de acumulados absolutos.

### Fuera del MVP actual

- Recetas y costo teórico vs real.
- POS y descuento automático por ventas.
- Multi-sucursal.
- Usuarios/roles y nube.
- Facturación/SII.
- OCR de facturas.

## Criterio de producto

CGE debe seguir siendo más pequeño y rápido que un ERP completo. El objetivo no es copiar Restaurant365, MarketMan o Toteat, sino adoptar sus patrones de navegación probados y conservar un alcance útil para pequeños negocios que todavía no necesitan una implementación compleja.
