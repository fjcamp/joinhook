import { FormEvent, useMemo, useState } from 'react';

type ChatMessage = {
    id: number;
    role: 'assistant' | 'user';
    text: string;
};

const QUICK_REPLIES = [
    'Quiero una herramienta',
    'Precio de Control Gastronómico Express',
    'Necesito soporte',
    'Hablar con Francisco'
];

function classifyIntent(value: string) {
    const text = value.toLowerCase();
    if (/soporte|problema|incidente|ayuda|cliente/.test(text)) return 'support';
    if (/francisco|humano|contacto|correo|hablar/.test(text)) return 'human';
    if (/precio|valor|costo|comprar|contratar|venta|cotiza/.test(text)) return 'sales';
    if (/control|gastron[oó]mico|inventario|merma|proveedor/.test(text)) return 'cge';
    if (/snowwise/.test(text)) return 'snowwise';
    if (/joinops/.test(text)) return 'joinops';
    if (/mi gesti[oó]n|mi gestion/.test(text)) return 'mi-gestion';
    if (/chat|ia|automat|whatsapp|bot/.test(text)) return 'automation';
    if (/t[eé]cnico|c[oó]digo|repositorio|secreto|credencial|api|arquitectura/.test(text)) return 'sensitive';
    if (/joinhook|qu[eé] hace|qu[eé] es/.test(text)) return 'about';
    return 'general';
}

function responseFor(intent: string) {
    switch (intent) {
        case 'support':
            return 'Para soporte a clientes, el canal recomendado es soporte@joinhook.cl. Si necesitas escalar el caso a una conversación directa, también puedes escribir a contacto@joinhook.cl.';
        case 'human':
            return 'Si quieres hablar directamente con Francisco, escribe a contacto@joinhook.cl. Para una consulta comercial puedes usar ventas@joinhook.cl.';
        case 'sales':
            return 'La herramienta visible para compra es Control Gastronómico Express. La beta está enfocada en inventario, compras, mermas, stock mínimo, proveedores y respaldo PWA, con precio de lanzamiento de $4.990 CLP. Si necesitas otra solución, puedo derivarte a ventas@joinhook.cl.';
        case 'cge':
            return 'Control Gastronómico Express está pensado para pequeños negocios gastronómicos que necesitan ordenar inventario, compras, mermas, proveedores y stock crítico sin partir por un ERP grande.';
        case 'snowwise':
            return 'SnowWise es un prototipo activo enfocado en montaña, seguridad, clima, mapas y contexto útil para actividades de nieve.';
        case 'joinops':
            return 'JoinOps es una línea en desarrollo orientada a gestión operativa, inventario, personas y trazabilidad para negocios con operación diaria compleja.';
        case 'mi-gestion':
            return 'Mi Gestión es un proyecto experimental orientado a organizar tareas, documentos, indicadores y seguimiento administrativo de forma práctica.';
        case 'automation':
            return 'JoinHook también explora asistentes web y automatizaciones para atención, soporte y ventas. Puedo explicar capacidades y beneficios, pero no entrego credenciales, secretos ni detalles internos sensibles.';
        case 'sensitive':
            return 'Puedo explicar el enfoque funcional y el valor de la solución, pero no comparto credenciales, secretos, arquitectura privada ni detalles técnicos que puedan comprometer la seguridad. Para una conversación formal escribe a contacto@joinhook.cl.';
        case 'about':
            return 'JoinHook es un espacio independiente para diseñar, probar y construir productos digitales, herramientas de gestión, PWA, automatizaciones y experiencias web con foco práctico.';
        default:
            return 'Puedo ayudarte a entender qué hace JoinHook, mostrarte la herramienta disponible, orientarte sobre soporte o automatización y derivarte al canal comercial correcto.';
    }
}

async function notifyLead(intent: string, message: string) {
    if (!['support', 'human', 'sales'].includes(intent)) return;
    try {
        await fetch('/api/contact-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intent, message, source: 'joinhook-web-assistant' }),
            keepalive: true
        });
    } catch {
        // La conversación no debe romperse si la automatización de notificación no está disponible.
    }
}

export function JoinHookAssistant() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            role: 'assistant',
            text: 'Hola. Soy el Asistente JoinHook. Puedo orientarte sobre los proyectos, la herramienta disponible y el primer contacto comercial o de soporte.'
        },
        {
            id: 2,
            role: 'assistant',
            text: 'Si necesitas una compra, una cotización o hablar con Francisco, te ayudo a llegar al canal correcto sin exponer información sensible del proyecto.'
        }
    ]);

    const nextId = useMemo(() => messages.length + 1, [messages.length]);

    const send = (value: string) => {
        const clean = value.trim();
        if (!clean) return;
        const intent = classifyIntent(clean);
        const reply = responseFor(intent);
        setMessages((current) => [
            ...current,
            { id: nextId, role: 'user', text: clean },
            { id: nextId + 1, role: 'assistant', text: reply }
        ]);
        void notifyLead(intent, clean);
    };

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        const value = input;
        setInput('');
        send(value);
    };

    return (
        <div className="jh-assistant-root">
            {open && (
                <section className="jh-assistant-panel" aria-label="Asistente virtual de JoinHook">
                    <header className="jh-assistant-header">
                        <div>
                            <strong>Asistente JoinHook</strong>
                            <small>Primer filtro comercial y de soporte</small>
                        </div>
                        <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar chat">×</button>
                    </header>

                    <div className="jh-assistant-messages" aria-live="polite">
                        {messages.map((message) => (
                            <div key={message.id} className={`jh-assistant-bubble ${message.role}`}>
                                {message.text}
                            </div>
                        ))}
                    </div>

                    <div className="jh-assistant-quick" aria-label="Opciones rápidas">
                        {QUICK_REPLIES.map((label) => (
                            <button type="button" key={label} onClick={() => send(label)}>{label}</button>
                        ))}
                    </div>

                    <form className="jh-assistant-form" onSubmit={onSubmit}>
                        <input
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            maxLength={280}
                            placeholder="Cuéntame qué necesitas…"
                            aria-label="Mensaje para el asistente"
                        />
                        <button type="submit">Enviar</button>
                    </form>

                    <div className="jh-assistant-links">
                        <a href="mailto:contacto@joinhook.cl">Contacto</a>
                        <a href="mailto:soporte@joinhook.cl">Soporte</a>
                        <a href="mailto:ventas@joinhook.cl">Ventas</a>
                    </div>
                </section>
            )}

            <button
                type="button"
                className="jh-assistant-toggle"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-label={open ? 'Cerrar asistente de JoinHook' : 'Abrir asistente de JoinHook'}
            >
                <span className="jh-assistant-icon" aria-hidden="true">
                    <svg viewBox="0 0 32 32">
                        <path d="M26.5 15.6c0 6.1-4.9 11.1-10.9 11.1-1.9 0-3.7-.5-5.3-1.4L5 26.8l1.6-5c-1.2-1.7-2-3.8-2-6.2C4.6 9.5 9.5 4.5 15.6 4.5s10.9 5 10.9 11.1Z" fill="currentColor" opacity=".22" />
                        <path d="M10.7 12.3c1.4 3.2 3.7 5.5 6.9 6.9l1.6-1.6c.2-.2.5-.3.8-.2.9.3 1.9.5 3 .5.4 0 .7.3.7.7v2.5c0 .4-.3.7-.7.7-7.3 0-13.2-5.9-13.2-13.2 0-.4.3-.7.7-.7H13c.4 0 .7.3.7.7 0 1 .2 2 .5 3 .1.3 0 .6-.2.8l-1.6 1.6-1.7-1.7Z" fill="currentColor" />
                    </svg>
                </span>
                <span><strong>Asistente</strong><small>Chat IA guiado</small></span>
            </button>
        </div>
    );
}
