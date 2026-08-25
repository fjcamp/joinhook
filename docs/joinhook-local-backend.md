# JoinHook Local — backend territorial

## Estado

JoinHook Local utiliza el proyecto Supabase `JoinHook Commerce` como infraestructura PostgreSQL compartida del ecosistema comercial. El dominio Local está aislado mediante tablas `local_*`; no reutiliza ni modifica las tablas `commerce_*`.

## Tablas

- `local_businesses`: comercios, experiencias y operadores territoriales.
- `local_catalog_items`: productos/servicios asociados a un comercio.
- `local_signals`: ofertas, editorial, turismo, comunidad y eventos.
- `local_moderation_log`: registro reservado para acciones de moderación.

Todas las tablas tienen RLS activado. Solo se permite lectura anónima/autenticada de contenido con `status = published`. No existe política pública de escritura. `local_moderation_log` no tiene política de lectura pública deliberadamente.

## Variables de entorno

Lectura pública del backend:

- `LOCAL_SUPABASE_URL`
- `LOCAL_SUPABASE_PUBLISHABLE_KEY`

Administración server-side:

- `LOCAL_SUPABASE_SERVICE_ROLE_KEY`
- `LOCAL_ADMIN_TOKEN`

Nunca usar `NEXT_PUBLIC_` para la service-role key ni para el token administrativo.

## Rutas

- `/local`: experiencia pública.
- `/local-admin`: consola administrativa bootstrap.
- `GET /api/local/dashboard`: agrega y sanitiza datos publicados.
- `POST /api/local/admin`: crea/actualiza entidades mediante credenciales server-side.

## Modelo de seguridad

La consola actual usa un token bootstrap que se mantiene solo en memoria del formulario. Es una etapa transitoria para operación controlada. El objetivo siguiente es Supabase Auth + tabla de roles/permisos + políticas RLS por rol. La service-role key permanece exclusivamente en el servidor.

## Degradación

Si Supabase no está configurado o no responde, `/local` conserva el dataset local de contingencia y la capa de clima/geolocalización sigue funcionando. Esta decisión evita una pantalla vacía durante despliegues o incidentes del backend.
