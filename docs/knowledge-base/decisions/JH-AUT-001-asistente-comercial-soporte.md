# JH-AUT-001 — Asistente web de primer contacto, soporte y ventas

**Fecha:** 2026-08-22  
**Estado:** Implementación inicial en código; automatización externa pendiente de configurar.  
**Etiquetas:** `chatbot`, `n8n`, `ventas`, `soporte`, `lead`, `privacidad`, `webhook`, `email`, `joinhook`

## Objetivo

Incorporar en `joinhook.cl` un asistente visible como demostración de capacidad de automatización y, al mismo tiempo, utilizarlo como primer filtro real para visitantes, prospectos y clientes.

## Alcance funcional

El asistente puede:

- explicar públicamente qué es JoinHook y qué productos/proyectos aparecen en la web;
- orientar sobre Control Gastronómico Express y su propuesta de valor;
- dirigir consultas comerciales a `ventas@joinhook.cl`;
- dirigir soporte a `soporte@joinhook.cl`;
- derivar contacto humano a `contacto@joinhook.cl`;
- reconocer consultas técnicas sensibles y responder solamente a nivel funcional, sin revelar credenciales, secretos, arquitectura privada ni información que pueda comprometer el proyecto.

## Arquitectura elegida

1. Componente web `JoinHookAssistant` para interfaz y clasificación inicial de intención.
2. Endpoint interno `/api/contact-lead` como proxy de notificaciones.
3. El navegador nunca conoce el webhook privado de automatización.
4. El endpoint lee `JOINHOOK_LEAD_WEBHOOK_URL` desde variables de entorno del servidor.
5. Cuando la intención corresponde a soporte, contacto humano o venta, el endpoint puede reenviar un evento al webhook.
6. La automatización externa recomendada es n8n: Webhook → validación/enriquecimiento → correo a `ventas@joinhook.cl` (y posteriormente CRM/registro si corresponde).

## Motivo del proxy interno

No publicar directamente una URL de webhook de n8n en JavaScript del navegador. Mantenerla como variable de entorno del servidor reduce exposición y permite sustituir n8n por otro orquestador sin modificar la interfaz pública.

## Datos mínimos del evento

- intención (`support`, `human`, `sales`);
- mensaje del visitante;
- origen (`joinhook-web-assistant`);
- fecha/hora generada por servidor;
- destino lógico de notificación.

No se deben enviar credenciales, secretos de proyecto ni información sensible innecesaria.

## Estado degradado seguro

Si `JOINHOOK_LEAD_WEBHOOK_URL` todavía no está configurada, el chat sigue funcionando para orientación y muestra los correos públicos. El endpoint responde aceptando el evento sin afirmar que fue reenviado.

## Pendiente para activar notificaciones automáticas

- crear workflow n8n;
- obtener URL HTTPS del webhook;
- configurar `JOINHOOK_LEAD_WEBHOOK_URL` en cPanel/Passenger como variable de entorno;
- configurar envío autenticado de correo desde n8n;
- probar que un lead comercial genera aviso a `ventas@joinhook.cl`;
- añadir rate limiting/antispam más robusto si el volumen lo requiere;
- evaluar consentimiento y política de retención antes de persistir conversaciones completas.

## Referencias de investigación

Se revisaron tutoriales recientes sobre agentes web/WhatsApp con n8n. El patrón recurrente es separar interfaz, memoria/conocimiento, orquestación y acciones (correo, CRM, agenda). Para JoinHook se adopta una primera versión más restringida: orientación pública + derivación + evento de lead, manteniendo control humano y limitación explícita de información técnica.
