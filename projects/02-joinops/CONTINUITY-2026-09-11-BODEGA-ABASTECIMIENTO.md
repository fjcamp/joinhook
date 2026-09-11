# JoinOps — Continuidad 2026-09-11 — Bodega, Abastecimiento y Gestión de Productos

## Propósito
Documento de respaldo para retomar en futuras sesiones las decisiones funcionales y arquitectónicas definidas para el módulo de Bodega/Abastecimiento de JoinOps y sus integraciones.

## 1. Alcance del módulo
Bodega/Abastecimiento no será un inventario aislado. Será un nodo operacional y de trazabilidad conectado con Proveedores, Compras, Recepción, Inventario, Recetas, Producción, Solicitudes por áreas, POS/Ventas, Finanzas, Administración, Auditoría y demás unidades correspondientes.

## 2. Gestión de proveedores
Cada proveedor tendrá una ficha maestra con:
- datos generales y contactos;
- productos suministrados;
- SKUs/códigos del proveedor;
- códigos de barras conocidos;
- condiciones comerciales;
- presupuestos y cotizaciones;
- historial de compras;
- historial de precios y variaciones;
- comunicaciones y gestiones realizadas;
- devoluciones e incidencias;
- cumplimiento/evaluación;
- documentación asociada;
- fecha de última revisión y próximas revisiones.

Bodega/Abastecimiento mantiene contacto y revisión permanente con proveedores. Administración podrá consultar las fichas y cambios relevantes para mantenerse al tanto de la gestión, respetando roles y permisos.

## 3. Producto Maestro / identidad JoinOps
Cada producto tendrá un JoinOps Product ID propio e independiente de los identificadores comerciales del proveedor.

Un mismo producto JoinOps puede relacionarse con:
- múltiples proveedores;
- múltiples SKU del proveedor;
- cambios históricos de SKU;
- múltiples códigos de barras;
- diferentes presentaciones comerciales cuando corresponda.

El código del proveedor nunca será la identidad principal del producto dentro de JoinOps.

## 4. Categorías y atributos
Usar categorías jerárquicas y atributos dinámicos:
- atributos generales comunes;
- atributos específicos de categoría;
- reglas operacionales por categoría.

Las categorías deben servir para operar, no solo para ordenar visualmente. Ejemplo: una categoría puede determinar si requiere lote, vencimiento, control de temperatura, FEFO, vida útil mínima, etc.

## 5. Unidades y conversiones
El producto debe manejar unidades de compra, almacenamiento y receta, con conversiones configurables:
- kg/g;
- L/ml;
- unidades;
- cajas;
- sacos;
- unidades por caja;
- equivalencias de presentación.

## 6. Facturas y boletas
El encargado de Bodega podrá ingresar documentos manualmente o mediante captura/escaneo.

La captura puede reconocer y proponer:
- proveedor;
- RUT;
- número de documento;
- fecha;
- productos;
- SKU/código proveedor;
- descripción;
- cantidad;
- unidad;
- gramaje/volumen;
- precio unitario;
- descuentos/impuestos/total cuando corresponda.

Cuando se ingrese una imagen de factura o boleta, el sistema debe presentar una previsualización estructurada con cada elemento detectado y su proveedor correspondiente para revisión y confirmación humana antes de afectar datos críticos.

Los documentos originales pueden conservarse cuando constituyan respaldo documental. La fotografía temporal usada solo para extracción de datos de producto no debe almacenarse permanentemente.

## 7. Captura inteligente de productos mediante cámara
Bodega tendrá una función de cámara propia para detectar y transcribir información del producto. No es un archivo fotográfico.

Flujo:
Cámara → OCR/detección → extracción → normalización → identificación del producto → previsualización → confirmación → registro → distribución a módulos.

Puede detectar:
- nombre y descripción;
- marca;
- presentación;
- gramaje/volumen;
- código de barras;
- SKU;
- lote;
- fecha de vencimiento;
- información nutricional;
- ingredientes;
- alérgenos y otros datos declarados.

La captura temporal no se conserva como fotografía permanente. La IA propone datos; un usuario autorizado confirma antes de modificar inventario u otros registros críticos.

## 8. Imagen de referencia
Existe una función diferente para adjuntar una fotografía permanente como referencia visual del producto.

Esta imagen sí se conserva asociada al producto/presentación y sirve para:
- reconocer visualmente productos;
- preparar pedidos;
- realizar cotizaciones;
- seleccionar productos en Bodega;
- apoyar recepción y gestión.

No debe confundirse con la fotografía temporal usada para OCR.

## 9. Información nutricional
La información nutricional forma parte de la ficha del producto alimentario y debe poder alimentar posteriormente el módulo de Recetas.

Considerar, cuando estén disponibles:
- tamaño de porción;
- energía;
- proteínas;
- grasas totales/saturadas;
- carbohidratos;
- azúcares;
- fibra;
- sodio;
- ingredientes;
- alérgenos;
- otros datos declarados.

## 10. Lotes y vencimientos
Producto maestro y lote son entidades separadas.

Cada lote puede registrar:
- proveedor;
- documento de origen;
- fecha de recepción;
- lote del proveedor;
- fecha de elaboración cuando exista;
- fecha de vencimiento;
- cantidad recibida;
- cantidad disponible;
- ubicación;
- estado/bloqueo;
- historial de movimientos.

La fecha de vencimiento es crítica para alimentos y debe generar alertas configurables.

## 11. FEFO/FIFO
Para productos con vencimiento se utilizará FEFO (First Expired, First Out) como regla principal: sale primero el lote que vence primero.

FIFO queda como regla complementaria para productos sin vencimiento o según política operacional.

El sistema debe mostrar prioridades como:
- usar ahora;
- próximo a vencer;
- normal;
- vencido/bloqueado.

Cuando un usuario autorizado rompe la prioridad automática debe registrarse quién, cuándo, qué lote eligió y el motivo.

## 12. Vida útil mínima
Debe existir una política configurable de vida útil mínima aceptable al recibir determinados productos.

Ejemplo: si la política exige al menos 7 días de vida útil y el producto llega con 3 días restantes, JoinOps genera una excepción de recepción que puede ser rechazada o autorizada por un usuario con permisos, dejando trazabilidad.

## 13. Compras
Flujo objetivo:
Necesidad → Solicitud → Cotización/Proveedor → Orden de compra → Recepción → Control → Lote → Inventario → Documento/impacto financiero.

La recepción debe registrar qué llegó, cuánto, cuándo, de quién, lote, vencimiento, costo y quién recibió.

## 14. Devoluciones
Flujo:
Recepción → Incidencia → Reason Code → Producto/Lote → Cantidad → Proveedor → Autorización → Devolución → Ajuste de inventario → Impacto financiero.

## 15. Mermas
Registrar como eventos trazables:
- producto;
- lote;
- cantidad/unidad;
- motivo/Reason Code;
- área;
- responsable;
- fecha/hora;
- costo;
- autorización;
- destino;
- impacto.

La merma debe poder expresarse en unidades físicas y valor monetario.

## 16. Solicitudes internas por áreas
Áreas como Cocina, Bar, Pastelería, Producción, Aseo, Administración u otras configurables pueden solicitar productos a Bodega.

Trazabilidad:
Área solicitante → solicitud → autorización → preparación → despacho → recepción → consumo.

Registrar quién solicitó, autorizó, preparó, entregó y recibió; producto, cantidad y lote.

## 17. Integración con recetas y producción
Los productos de Bodega deben ser utilizables directamente como ingredientes de recetas y subrecetas.

Trazabilidad bidireccional:
Producto/Lote → receta → producción → venta.

Y también:
Venta/producción → ingredientes → lotes consumidos → recepción → proveedor → documento.

La información nutricional y costos del producto deben poder alimentar el cálculo de recetas y porciones.

## 18. Historial de precios
Nunca sobrescribir silenciosamente un precio histórico.

Registrar:
- precio anterior;
- precio nuevo;
- variación absoluta;
- variación porcentual;
- fecha;
- proveedor;
- documento;
- usuario;
- motivo cuando corresponda.

Debe poder detectarse aumento o baja y generar alertas configurables.

## 19. Nodos de trazabilidad
Toda operación relevante debe generar un evento/nodo de trazabilidad conectado con otros eventos.

Ejemplo:
Proveedor → Compra → Recepción → Lote → Bodega → Solicitud → Despacho → Receta → Producción → Venta → Pago → Contabilidad.

También:
Lote → Merma / Devolución / Ajuste / Incidencia.

La trazabilidad debe permitir reconstruir qué ocurrió, cuándo, quién, qué producto/lote, qué documento y qué impacto.

## 20. Distribución de información
Los datos no deben enviarse indiscriminadamente a todos los módulos.

- Bodega: stock, lotes, vencimientos, ubicaciones, movimientos.
- Compras/Abastecimiento: necesidades, proveedores, precios, cotizaciones, órdenes.
- Cocina/Producción: disponibilidad, solicitudes, entregas, lotes, ingredientes.
- Finanzas/Tesorería: documentos y movimientos con impacto monetario.
- Contabilidad: información/documentos que corresponda procesar contablemente.
- Administración: compras, costos, inventario valorizado, mermas, devoluciones, proveedores, desviaciones.
- Gerencia: indicadores agregados y tendencias.
- Auditoría: reconstrucción de eventos y cambios.

## 21. Product Intelligence
El módulo podrá detectar y comunicar:
- aumentos o bajas significativas de precio;
- productos próximos a vencer;
- exceso o baja rotación;
- cambios de SKU/código;
- equivalencias de productos;
- diferencias de costo por presentación/unidad;
- productos usados en muchas recetas;
- productos sin movimiento;
- recepciones con vida útil inferior a política;
- otras anomalías configurables.

## 22. Arquitectura funcional recomendada
Componentes:
1. Product Master.
2. Categorization Engine.
3. Attribute Engine.
4. Supplier Product Mapping.
5. Unit & Conversion Engine.
6. Batch/Lot Engine.
7. Shelf-Life Engine.
8. FEFO/FIFO Engine.
9. Price History.
10. Document Capture.
11. Product Capture.
12. Product Reference Images.
13. Inventory Movement Ledger.
14. Recipe Integration.
15. Procurement.
16. Supplier Management.
17. Product Intelligence.

## 23. Principio de diseño
No copiar la complejidad de SAP, Oracle, Microsoft Dynamics u otros ERP empresariales. Adoptar los principios probados —producto maestro, jerarquía, atributos, identidad propia, unidades, lotes, vida útil, FEFO, proveedor, historial y reglas— y ocultar la complejidad detrás de una interfaz simple para el encargado.

## 24. Regla crítica para implementación
El sistema debe mantener una única fuente maestra de producto compartida por Bodega, Compras, Recetas, Producción, POS/Ventas, Finanzas y Administración. No crear catálogos independientes por módulo.

## 25. Regla de control humano
OCR/IA y reconocimiento automático proponen datos. No deben modificar silenciosamente inventario, costos, lotes, vencimientos, contabilidad u otros datos críticos sin una etapa de revisión/confirmación conforme a permisos.

## Estado
Estas definiciones deben considerarse requisitos base para el desarrollo del código de JoinOps cuando se inicie la implementación. Este documento sirve como continuidad para futuras sesiones y debe mantenerse alineado con el MANUAL y DECISION LOG de JoinOps.
