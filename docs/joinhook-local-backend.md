# JoinHook Local — backend territorial

## Estado

JoinHook Local utiliza el proyecto Supabase `JoinHook Commerce` como infraestructura PostgreSQL compartida del ecosistema comercial. El dominio Local está aislado mediante tablas `local_*`; no reutiliza ni modifica las tablas `commerce_*`.

## Tablas

- `local_businesses`: comercios, experiencias y operadores territoriales.
- `local_catalog_items`: productos/servicios asociados a un comercio.
- `local_signals`: ofertas, editorial, turismo, comunidad y eventos.
- `local_moderation_log`: trazabilidad de mutaciones administrativas.
- `local_user_roles`: autorización RBAC para operadores de JoinHook Local.

Todas las tablas tienen RLS activado. Solo se permite lectura anónima/autenticada de contenido con `status = published`. No existe política pública de escritura. Roles y auditoría se resuelven exclusivamente desde el servidor con service role.

## Variables de entorno

- `LOCAL_SUPABASE_URL`
- `LOCAL_SUPABASE_PUBLISHABLE_KEY`
- `LOCAL_SUPABASE_SERVICE_ROLE_KEY` — solo servidor
- `LOCAL_ADMIN_SETUP_TOKEN` — secreto temporal para inicializar el primer administrador

No exponer la service-role key ni el setup token con prefijo `NEXT_PUBLIC_`.

## Rutas

- `/local`: experiencia pública.
- `/local-admin`: consola administrativa autenticada.
- `GET /api/local/dashboard`: agrega y sanitiza contenido publicado.
- `POST /api/local/auth`: inicio de sesión mediante Supabase Auth.
- `POST /api/local/admin`: mutaciones autorizadas por usuario y rol.
- `POST /api/local/setup-admin`: bootstrap del primer administrador; deja de operar automáticamente cuando ya existe un rol.

## Roles

- `admin`: control completo del dominio Local.
- `editor`: creación y edición de comercios, catálogo y señales.
- `moderator`: modificación de señales para tareas de moderación.
- `viewer`: acceso administrativo de solo lectura; no puede ejecutar mutaciones.

Cada llamada administrativa valida el JWT contra Supabase Auth y luego consulta `local_user_roles` en servidor. Las mutaciones generan un registro en `local_moderation_log` con usuario, entidad y acción.

## Inicialización segura

El proyecto comienza sin usuarios Auth. Para crear el primer administrador se configura `LOCAL_ADMIN_SETUP_TOKEN` en el entorno y se invoca una vez `/api/local/setup-admin` con correo, contraseña robusta y ese secreto. El endpoint rechaza nuevas inicializaciones una vez que existe cualquier rol. Después conviene rotar o retirar `LOCAL_ADMIN_SETUP_TOKEN` del entorno.

## Degradación

Si Supabase no está configurado o no responde, `/local` conserva el dataset local de contingencia y la capa de clima/geolocalización sigue funcionando. La administración, en cambio, falla cerrada: sin Auth, rol y variables server-side válidas no permite escrituras.
