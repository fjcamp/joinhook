# JoinHook Agent Center — integración y despliegue

## Propósito
`/agent-center` es la consola privada del propietario para interactuar con JoinHook Agent Control Plane sin exponer credenciales internas al navegador.

## Flujo de seguridad

```text
Browser /agent-center
  -> owner session (HttpOnly signed cookie)
  -> Next.js server-side proxy /api/agent-center/*
  -> JOINHOOK_AGENT_API_TOKEN (server only)
  -> JoinHook OS Agent Control Plane
```

El navegador nunca recibe `JOINHOOK_AGENT_API_TOKEN`, `OPENAI_API_KEY` ni `JOINHOOK_GITHUB_TOKEN`.

## Variables server-side requeridas en la aplicación Next.js

- `JOINHOOK_OWNER_ACCESS_KEY`: clave privada de acceso del propietario. Usar un valor aleatorio largo; no reutilizar contraseñas personales.
- `JOINHOOK_PANEL_SESSION_SECRET`: secreto aleatorio de al menos 32 caracteres utilizado para firmar la cookie de sesión.
- `JOINHOOK_AGENT_API_URL`: URL alcanzable desde el servidor Next.js hacia JoinHook Agent API. Preferir red privada/reverse proxy interno cuando estén en la misma infraestructura.
- `JOINHOOK_AGENT_API_TOKEN`: debe coincidir con el token configurado exclusivamente del lado servidor en JoinHook OS.

Estas variables no deben usar prefijo `NEXT_PUBLIC_`.

## Variables del backend Agent Control Plane
Consultar `fjcamp/joinhook-os/backend/.env.example`. Entre otras:

- `DATABASE_URL`
- `JOINHOOK_AGENT_API_TOKEN`
- `JOINHOOK_MODEL_PROVIDER`
- `OPENAI_API_KEY` / `OPENAI_MODEL` cuando se utilice OpenAI
- `JOINHOOK_GITHUB_TOKEN`
- `JOINHOOK_GITHUB_REPOSITORIES`
- `JOINHOOK_GITHUB_BRANCH_PREFIX=agent/`

## Protección de repositorios
El Tool Gateway solo permite repositorios explicitamente incluidos en `JOINHOOK_GITHUB_REPOSITORIES`. Los agentes no pueden escribir directamente en `main`, `master`, `production` o `prod`; tampoco pueden modificar `.env`, secretos, credenciales, `.github/workflows` ni `CODEOWNERS` mediante el gateway.

## Operación desde el panel
1. Ingresar a `/agent-center` con la clave privada del propietario.
2. Crear una tarea indicando objetivo, proyecto, repositorio, rama base y presupuesto máximo.
3. El Orchestrator clasifica riesgo y selecciona especialistas.
4. Si la política exige aprobación, la tarea queda en `WAITING_APPROVAL` y aparece en Human Gate.
5. El worker procesa tareas `READY` cuando existe un proveedor de modelo configurado.
6. El panel consulta estado, costo, pasos y resultado final consolidado.
7. El kill switch permite detener la ejecución autónoma.

## Despliegue recomendado
- TLS obligatorio en producción.
- `joinhook.cl`/panel y Agent API pueden estar en hosts separados; el token interno se configura solo en servidor.
- No publicar directamente el puerto del Agent API a Internet si puede mantenerse detrás de reverse proxy/firewall.
- Mantener backups de PostgreSQL, logs/audit y configuración de infraestructura.
- Rotar credenciales ante cualquier sospecha de exposición.

## No declarar operativo hasta verificar
- build del frontend verde;
- backend CI verde;
- migración aplicada en staging;
- `/api/agent/health` saludable;
- owner login y proxy verificados por HTTPS;
- creación de tarea y transición de estados verificadas;
- aprobación/rechazo verificados;
- kill switch verificado;
- run real con presupuesto bajo y repositorio de prueba;
- rollback y backup comprobados.
