# Arquitectura — JoinHook web

## Frontend
Angular presenta páginas, navegación, contenido y formularios. No contiene secretos ni se conecta directamente a PostgreSQL. La futura comunicación con NestJS usará un adaptador HTTP del lado del cliente.

## Backend hexagonal
Cada módulo debe separar:
- `domain/`: entidades, value objects y reglas del negocio.
- `application/`: casos de uso y puertos.
- `adapters/inbound/`: controladores HTTP y traducción de solicitudes.
- `adapters/outbound/`: adaptadores externos (persistencia, correo, almacenamiento).
- `infrastructure/`: configuración y composición.

Las reglas de dominio y casos de uso no dependerán de NestJS, Express, PostgreSQL ni infraestructura.

## Persistencia
PostgreSQL es la opción objetivo. Esta fundación no conecta a ninguna base ni incorpora ORM. Antes de persistir datos deben aprobarse modelo, permisos, retención, migraciones, backups, proveedor y conectividad de cada ambiente.

## API y seguridad
- Prefijo inicial: `/api/v1`.
- CORS debe usar una lista explícita de orígenes.
- Secretos solo mediante configuración por ambiente.
- Health endpoint no debe afirmar estado de dependencias no verificadas.
- Formulario de clientes breve, separado de consentimiento opcional de marketing.
- La información declarada por el usuario se clasifica como no verificada hasta su validación.

## Diseño y contenido
Base: Canva “JoinHook — Simulación del sitio web 2026” (24 páginas) y “Página de inicio web de JoinHook”. El contenido prioriza propietarios de terrenos y negocios turísticos, método de seis pasos, servicios, conocimiento, proyectos y colaboraciones. No publicar logros, clientes, alianzas ni capacidades no demostrados.

La fotografía y el hero visual final se incorporarán cuando los recursos aprobados se exporten o se pongan a disposición del repositorio. Los tokens visuales iniciales son provisionales y no constituyen una aprobación definitiva de marca.
