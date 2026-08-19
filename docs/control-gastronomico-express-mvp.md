# Control Gastronómico Express — MVP 0.1

## Objetivo
Resolver de forma simple y sin mensualidad inicial el control básico de inventario, compras, mermas y proveedores para pequeños negocios gastronómicos.

## Enfoque técnico inicial
- Local-first: los datos quedan en el navegador del usuario.
- Sin login ni backend durante la validación inicial.
- Respaldo manual en JSON y exportación de inventario en CSV.
- Diseño responsive con lenguaje visual claro, táctil y no corporativo.
- Evolución posterior a sincronización en nube solo después de validar uso real.

## Funciones incluidas
- Dashboard: valor de inventario, stock crítico, compras acumuladas y costo estimado de merma.
- Inventario: crear, editar, eliminar, buscar y marcar niveles mínimos.
- Compras: registrar entrada, costo y proveedor; incrementa stock.
- Mermas: registrar salida y causa; descuenta stock.
- Proveedores: alta y asociación con productos/compras.
- Historial de movimientos.
- Respaldo, restauración y exportación CSV.

## No incluido aún
- Usuarios y permisos.
- Sincronización multi-dispositivo.
- Caja/POS y SII.
- Recetas y producción.
- Integraciones externas.
- Reportería contable.

## Gate para beta pública
- Build verde.
- Prueba móvil y escritorio.
- Protección ante pérdida accidental de datos.
- Flujo de onboarding corto.
- Política de privacidad y términos cuando exista persistencia en nube.
