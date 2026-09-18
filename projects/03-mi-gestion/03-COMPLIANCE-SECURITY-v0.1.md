# Mi Gestión Admin — Security, Privacy & Compliance v0.1

**Estado:** DISEÑADO.

## Clasificación

MGA puede manejar información laboral, empresarial, documentos, comunicaciones y datos provenientes de servicios externos. Por ello se aplica privacy-by-design.

## Controles mínimos

- autenticación segura;
- autorización por usuario/instancia;
- gestión explícita de sesiones;
- secretos fuera de Git;
- validación server-side;
- protección de APIs;
- auditoría de mutaciones;
- exportación de datos;
- eliminación de cuenta/datos cuando corresponda;
- revocación de integraciones;
- minimización de permisos;
- provenance;
- separación entre hechos e inferencias de IA.

## Integraciones

Cada conector deberá declarar:
- proveedor;
- scopes/permisos;
- estado;
- fecha de conexión;
- fecha de última sincronización;
- mecanismo de revocación;
- errores de sincronización.

## IA

El Agent Core no recibe acceso global por defecto.

Cada operación debe tener:
- fuente;
- permisos;
- contexto;
- acción propuesta;
- resultado;
- trazabilidad cuando corresponda.

Las acciones externas sensibles requieren confirmación humana.

## N/A inicial

No se implementan todavía:
- publicación en tiendas;
- multiusuario;
- facturación;
- pagos;
- roles empresariales complejos.

Deben reevaluarse antes de distribución pública.

## Referencia transversal

Aplicar el estándar JoinHook de Platform Distribution & Compliance vigente al momento de cada release.
