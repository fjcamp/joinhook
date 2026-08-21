# Control Gastronómico Express — prueba beta de 10 minutos

## Objetivo
Validar si una persona que administra un pequeño negocio gastronómico puede entender y ejecutar el circuito principal sin capacitación previa.

## Preparación
- Abrir `/app/control-gastronomico-express` en un navegador limpio o después de reiniciar la demo.
- Realizar una prueba en escritorio y otra en teléfono.
- No explicar dónde están los botones salvo que el participante quede bloqueado.

## Recorrido

### 1. Primer inicio — 1 minuto
1. Ingresar el nombre del negocio.
2. Elegir **Usar datos de ejemplo**.
3. Explicar con sus propias palabras qué muestra el resumen.

Éxito: comprende que los datos son locales y distingue inventario, stock crítico, compras y mermas.

### 2. Crear producto — 1 minuto
1. Crear `Leche entera`.
2. Categoría: `Lácteos`.
3. Unidad: `l`.
4. Stock inicial: `8`.
5. Stock mínimo: `5`.
6. Costo unitario: `$1.200`.

Éxito: el producto aparece en inventario y el valor total se recalcula.

### 3. Registrar compra — 1 minuto
1. Registrar compra de `4 l` de leche a `$1.250` por unidad.
2. Revisar nuevo stock.

Resultado esperado: stock de leche = `12 l`; queda movimiento de compra y costo actualizado.

### 4. Ajuste físico — 1 minuto
1. Desde Inventario elegir **Ajustar** en Leche entera.
2. Cambiar el conteo a `11,5 l`.
3. Motivo: `Conteo físico de apertura`.

Resultado esperado: queda un movimiento de ajuste de `-0,5 l` con motivo registrado.

### 5. Registrar merma — 1 minuto
1. Registrar `1,5 l` de merma.
2. Causa: `Preparación`.
3. Escribir una observación breve.

Resultado esperado: stock = `10 l`; la merma aparece en historial y su costo estimado se refleja en el dashboard.

### 6. Forzar stock crítico — 1 minuto
1. Ajustar `Azúcar` a `2 kg`.
2. Volver al Resumen.

Resultado esperado: Azúcar aparece en stock crítico y en Compra sugerida.

### 7. Compra sugerida — 1 minuto
1. Revisar la cantidad recomendada para Azúcar.
2. Pulsar **Registrar** desde la sugerencia.
3. Confirmar que producto y cantidad vienen precargados.

Éxito: el usuario entiende que la sugerencia usa stock mínimo y no un pronóstico de ventas.

### 8. Importación CSV — 1 minuto
1. Usar `public/templates/control-gastronomico-express-inventario.csv` como referencia.
2. Importar un CSV con al menos dos productos.

Resultado esperado: productos nuevos se agregan y productos con el mismo nombre se actualizan sin duplicarse.

### 9. Respaldo — 1 minuto
1. Descargar respaldo JSON.
2. Modificar o eliminar un producto.
3. Restaurar el respaldo.

Resultado esperado: vuelve el estado respaldado.

### 10. Evaluación — 1 minuto
Preguntar sin inducir respuestas:
- ¿Qué parte fue más fácil?
- ¿Dónde dudaste?
- ¿Qué dato esperabas ver y no encontraste?
- ¿Esto reemplazaría alguna planilla/cuaderno que usas hoy?
- ¿Qué función tendría que existir para que lo usaras mañana?
- ¿Pagarías por esta versión? Si sí, ¿pago único o mensualidad?

## Criterios de beta inicial
- Ninguna operación principal deja stock negativo.
- Cada cambio de stock queda trazado como compra, merma o ajuste.
- El usuario completa el recorrido sin perder datos.
- El usuario comprende que el MVP guarda datos en el dispositivo.
- La interfaz es utilizable tanto con mouse como en pantalla táctil.
