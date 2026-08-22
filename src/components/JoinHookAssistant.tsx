import { FormEvent, useMemo, useState } from 'react';

type ChatMessage = {
    id: number;
    role: 'assistant' | 'user';
    text: string;
};

const QUICK_REPLIES = [
    'Qué herramienta me conviene',
    'Precio de Control Gastronómico Express',
    'Necesito soporte',
    'Hablar con Francisco'
];

function classifyIntent(value: string) {
    const text = value.toLowerCase();

    // Guardrail contextual: solo se activa cuando el usuario intenta pedir o extraer
    // información interna, credenciales, instrucciones del sistema o detalles sensibles.
    if (
        /prompt|system prompt|instrucciones internas|ignora (las|tus) instrucciones|revela|mu[eé]strame (tu|el) prompt|credencial|contrase[nñ]a|token|api key|secreto|repositorio privado|c[oó]digo fuente|arquitectura interna|base de datos interna/.test(text)
    ) return 'sensitive';

    if (/soporte|problema|incidente|ayuda|cliente/.test(text)) return 'support';
    if (/francisco|humano|contacto|correo|hablar/.test(text)) return 'human';
    if (/precio|valor|costo|comprar|contratar|venta|cotiza/.test(text)) return 'sales';
    if (/control|gastron[oó]mico|inventario|merma|proveedor/.test(text)) return 'cge';
    if (/snowwise/.test(text)) return 'snowwise';
    if (/joinops/.test(text)) return 'joinops';
    if (/mi gesti[oó]n|mi gestion/.test(text)) return 'mi-gestion';
    if (/chat|ia|automat|whatsapp|bot/.test(text)) return 'automation';
    if (/beneficio|ventaja|para qu[eé] sirve|qu[eé] me aporta|usabilidad|c[oó]mo se usa/.test(text)) return 'benefits';
    if (/joinhook|qu[eé] hace|qu[eé] es/.test(text)) return 'about';
    return 'general';
}

function responseFor(intent: string) {
    switch (intent) {
        case 'support':
            return 'Claro. Puedo ayudarte con dudas de uso, orientación inicial y pasos básicos de las herramientas. Si el caso necesita revisión humana, el canal de soporte es soporte@joinhook.cl y también puedes escribir a contacto@joinhook.cl.';
        case 'human':
            return 'Por supuesto. Si quieres conversar directamente con Francisco, escribe a contacto@joinhook.cl. Para consultas de compra, cotización o servicios también puedes usar ventas@joinhook.cl.';
        case 'sales':
            return 'Actualmente puedes conocer Control Gastronómico Express, una herramienta enfocada en inventario, compras, mermas, stock mínimo, proveedores y respaldo PWA. El precio de lanzamiento publicado es $4.990 CLP. Si me cuentas qué necesitas, puedo ayudarte a evaluar si esta herramienta te sirve o si conviene una solución diferente.';
        case 'cge':
            return 'Control Gastronómico Express ayuda a pequeños negocios gastronómicos a ordenar inventario, compras, mermas, proveedores y stock crítico en una interfaz práctica. Su beneficio principal es tener mayor control diario sin partir con la complejidad de un ERP grande.';
        case 'snowwise':
            return 'SnowWise es un proyecto enfocado en montaña, seguridad, clima, mapas y contexto útil para actividades de nieve. Busca reunir información relevante en una experiencia más clara para planificar y tomar mejores decisiones antes y durante una salida.';
        case 'joinops':
            return 'JoinOps es una línea en desarrollo orientada a ordenar la operación diaria de negocios con inventario, personas, tareas y trazabilidad. El objetivo es reducir desorden operativo y entregar una visión más clara de lo que está ocurriendo en cada área.';
        case 'mi-gestion':
            return 'Mi Gestión es un proyecto orientado a organizar tareas, documentos, indicadores y seguimiento administrativo. Busca concentrar información cotidiana para facilitar la planificación y la toma de decisiones.';
        case 'automation':
            return 'JoinHook también desarrolla asistentes y automatizaciones para atención, soporte y ventas. La idea es reducir tareas repetitivas, responder más rápido y derivar a una persona cuando la conversación realmente lo necesita.';
        case 'benefits':
            return 'Las herramientas de JoinHook buscan simplificar procesos, reducir trabajo repetitivo, ordenar información y ayudar a tomar decisiones con mayor contexto. Si me indicas tu tipo de negocio o necesidad, puedo orientarte hacia la alternativa más adecuada.';
        case 'sensitive':
            return 'Puedo ayudarte con funcionamiento, beneficios, usabilidad y capacidades públicas de JoinHook, pero no puedo entregar credenciales, instrucciones internas, secretos, código privado ni información que comprometa la seguridad del proyecto. Si necesitas una conversación técnica autorizada, escribe a contacto@joinhook.cl.';
        case 'about':
            return 'JoinHook es un espacio independiente donde se diseñan y construyen productos digitales, herramientas de gestión, PWA, automatizaciones y experiencias web. El foco está en resolver problemas reales con soluciones claras, útiles y escalables.';
        default:
            return 'Cuéntame qué necesitas resolver y te orientaré. Puedo ayudarte a conocer las herramientas de JoinHook, entender sus beneficios, resolver dudas de uso o guiarte hacia soporte, ventas o contacto directo.';
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
            text: '¡Hola! Soy el Asistente JoinHook. Estoy aquí para ayudarte a conocer nuestras herramientas, entender cómo pueden servirte y resolver tus primeras dudas.'
        },
        {
            id: 2,
            role: 'assistant',
            text: 'Cuéntame qué necesitas mejorar, organizar o resolver y te guiaré hacia la alternativa más adecuada.'
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
                            <small>Productos · orientación · soporte</small>
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
