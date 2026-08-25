# JoinHook Local — Operational Readiness

## Objetivo
Cerrar la puesta en operación sin exponer secretos ni depender de edición manual en Supabase.

## Flujo
1. Configurar en el hosting las variables server-side requeridas para Supabase Local.
2. Abrir `/local-setup` y revisar el diagnóstico de infraestructura.
3. Crear el primer administrador con el token temporal de instalación.
4. Retirar o rotar el token temporal después del bootstrap.
5. Ingresar a `/local-admin` y crear operadores con roles.
6. Usar `/local-import` para cargar lotes territoriales en estado borrador.
7. Revisar y publicar contenido desde `/local-admin-content`.
8. Validar `/local` en escritorio y móvil antes del piloto.

## Rutas operativas
- `/local`: experiencia pública.
- `/local-admin`: acceso administrativo.
- `/local-admin-content`: CRUD de contenido y catálogo.
- `/local-setup`: diagnóstico y primer administrador.
- `/local-import`: carga JSON autenticada por lote.
- `GET /api/local/status`: estado no sensible de configuración y conectividad.
- `POST /api/local/import`: importación protegida por RBAC.

## Criterios de seguridad
- Los endpoints de setup, importación y administración fallan cerrados cuando falta configuración.
- El diagnóstico solo publica estados; nunca valores de credenciales.
- El primer administrador solo puede inicializarse una vez.
- La importación exige rol `admin` o `editor`, limita tamaño de lote y crea borradores por defecto.
- La publicación de contenido sigue siendo explícita y separada de la importación.
- La experiencia pública mantiene fallback local si el backend territorial no está disponible.
