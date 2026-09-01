import Script from 'next/script';
import { FormEvent, useState } from 'react';
import { trackEvent } from './JoinHookV3Runtime';

type State = 'idle' | 'sending' | 'ok' | 'error';

export function JoinHookV3ContactForm() {
    const [state, setState] = useState<State>('idle');
    const [status, setStatus] = useState('');
    const [started, setStarted] = useState(false);
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (state === 'sending') return;
        const element = event.currentTarget;
        const form = new FormData(element);
        const payload = {
            name: String(form.get('name') || '').trim(),
            email: String(form.get('email') || '').trim(),
            phone: String(form.get('phone') || '').trim(),
            company: String(form.get('company') || '').trim(),
            topic: String(form.get('topic') || '').trim(),
            stage: String(form.get('stage') || '').trim(),
            message: String(form.get('message') || '').trim(),
            website: String(form.get('website') || '').trim(),
            newsletterOptIn: form.get('newsletterOptIn') === 'yes',
            privacyAccepted: form.get('privacyAccepted') === 'yes',
            turnstileToken: String(form.get('cf-turnstile-response') || ''),
            source: 'joinhook-contact-page'
        };

        if (payload.name.length < 2 || payload.email.length < 5 || payload.message.length < 10 || !payload.topic || !payload.stage || !payload.privacyAccepted) {
            setState('error');
            setStatus('Completa los campos obligatorios y confirma que has leído la información de privacidad.');
            trackEvent('form_error', { form_name: 'contact', reason: 'validation' });
            return;
        }

        setState('sending');
        setStatus('Enviando…');
        try {
            const response = await fetch('/api/contact-lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result?.code || 'request_failed');
            element.reset();
            (window as unknown as { turnstile?: { reset?: () => void } }).turnstile?.reset?.();
            setState('ok');
            setStatus(payload.newsletterOptIn ? 'Mensaje recibido. Además te enviaremos un correo para confirmar la suscripción a novedades.' : 'Mensaje recibido. Revisaremos el contexto y te responderemos por correo.');
            trackEvent('form_submit', { form_name: 'contact', topic: payload.topic, stage: payload.stage });
            trackEvent('generate_lead', { method: 'contact_form' });
        } catch {
            setState('error');
            setStatus('No pudimos enviar el mensaje en este momento. También puedes escribir a info@joinhook.cl.');
            trackEvent('form_error', { form_name: 'contact', reason: 'request' });
        }
    }

    const start = () => { if (!started) { setStarted(true); trackEvent('form_start', { form_name: 'contact' }); } };

    return (
        <form className="jh3-form" onSubmit={submit} onFocus={start} noValidate>
            {siteKey && <Script id="joinhook-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />}
            <div className="jh3-field"><label htmlFor="jh-name">Nombre *</label><input id="jh-name" name="name" autoComplete="name" maxLength={100} required placeholder="Tu nombre" /></div>
            <div className="jh3-field"><label htmlFor="jh-email">Correo *</label><input id="jh-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={180} required placeholder="tu@correo.com" /></div>
            <div className="jh3-field"><label htmlFor="jh-phone">Teléfono / WhatsApp <span className="jh3-optional">(opcional)</span></label><input id="jh-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} placeholder="+56 …" /></div>
            <div className="jh3-field"><label htmlFor="jh-company">Empresa o proyecto <span className="jh3-optional">(opcional)</span></label><input id="jh-company" name="company" autoComplete="organization" maxLength={140} placeholder="Nombre de la empresa, equipo o proyecto" /></div>
            <div className="jh3-form-grid-2">
                <div className="jh3-field"><label htmlFor="jh-topic">¿En qué podemos ayudarte? *</label><select id="jh-topic" name="topic" required defaultValue=""><option value="" disabled>Selecciona una opción</option><option value="desarrollo-web">Desarrollo web / PWA</option><option value="software">Software o sistema</option><option value="automatizacion">Automatización / integración</option><option value="producto-digital">Producto digital / prototipo</option><option value="mejora-proceso">Mejora de proceso</option><option value="otro">Otro</option></select></div>
                <div className="jh3-field"><label htmlFor="jh-stage">Etapa del proyecto *</label><select id="jh-stage" name="stage" required defaultValue=""><option value="" disabled>Selecciona una etapa</option><option value="idea">Idea inicial</option><option value="definicion">En definición</option><option value="desarrollo">En desarrollo</option><option value="existente">Ya existe y necesita mejora</option><option value="operacion">Problema operativo actual</option></select></div>
            </div>
            <div className="jh3-field"><label htmlFor="jh-message">¿Qué te gustaría resolver? *</label><textarea id="jh-message" name="message" maxLength={1200} required placeholder="Cuéntanos el contexto, qué ocurre hoy y qué resultado te gustaría conseguir." /></div>
            <div className="jh3-checks">
                <label><input type="checkbox" name="newsletterOptIn" value="yes" /> <span>Quiero recibir novedades, productos y contenidos de JoinHook. Esta opción es independiente de mi consulta y requiere confirmación por correo.</span></label>
                <label><input type="checkbox" name="privacyAccepted" value="yes" required /> <span>He leído la <a href="/privacidad" target="_blank" rel="noreferrer">Política de Privacidad</a> y autorizo el uso de estos datos únicamente para gestionar mi solicitud. *</span></label>
            </div>
            <div className="jh3-honeypot" aria-hidden="true"><label htmlFor="jh-website">Sitio web</label><input id="jh-website" name="website" tabIndex={-1} autoComplete="off" /></div>
            {siteKey && <div className="cf-turnstile jh3-turnstile" data-sitekey={siteKey} data-appearance="interaction-only" data-theme="light" />}
            <button className="jh3-button jh3-button-primary" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Enviando…' : 'Enviar mensaje'} <span aria-hidden="true">→</span></button>
            <div className={`jh3-form-status ${state === 'ok' ? 'is-ok' : state === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">{status}</div>
            <small className="jh3-form-note">No enviamos nombre, correo, teléfono ni contenido del mensaje a las herramientas de analítica.</small>
        </form>
    );
}
