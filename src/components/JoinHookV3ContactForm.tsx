import Link from 'next/link';
import { FormEvent, useCallback, useRef, useState } from 'react';
import { JoinHookTurnstile } from '@/components/JoinHookTurnstile';
import { currentAttribution, trackJoinHookEvent } from '@/lib/joinhook-web';

type State = 'idle' | 'sending' | 'ok' | 'error';

export function JoinHookV3ContactForm() {
    const [state, setState] = useState<State>('idle');
    const [status, setStatus] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const started = useRef(false);
    const onTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

    function markStarted() {
        if (started.current) return;
        started.current = true;
        trackJoinHookEvent('form_start', { form_name: 'contacto_comercial' });
    }

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (state === 'sending') return;
        const formEl = event.currentTarget;
        const form = new FormData(formEl);
        const payload = {
            name: String(form.get('name') || '').trim(),
            email: String(form.get('email') || '').trim(),
            phone: String(form.get('phone') || '').trim(),
            company: String(form.get('company') || '').trim(),
            service: String(form.get('service') || '').trim(),
            stage: String(form.get('stage') || '').trim(),
            need: String(form.get('need') || '').trim(),
            website: String(form.get('website') || '').trim(),
            newsletter: form.get('newsletter') === 'yes',
            privacyAcknowledged: form.get('privacy') === 'yes',
            turnstileToken,
            attribution: currentAttribution()
        };

        if (payload.name.length < 2 || !/^\S+@\S+\.\S+$/.test(payload.email) || payload.need.length < 10 || !payload.service || !payload.stage || !payload.privacyAcknowledged) {
            setState('error');
            setStatus('Revisa los campos obligatorios y confirma que has leído la información de privacidad.');
            trackJoinHookEvent('form_error', { form_name: 'contacto_comercial', error_type: 'validation' });
            return;
        }

        setState('sending');
        setStatus('Enviando…');
        try {
            const response = await fetch('/api/contact-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...payload, source: 'joinhook-contact-page' })
            });
            if (!response.ok) throw new Error('request_failed');

            if (payload.newsletter) {
                await fetch('/api/newsletter-subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: payload.email, name: payload.name, website: payload.website, turnstileToken, source: 'contact-form-opt-in' })
                }).catch(() => undefined);
            }

            formEl.reset();
            setTurnstileToken('');
            setState('ok');
            setStatus(payload.newsletter
                ? 'Mensaje recibido. Además, revisa tu correo para confirmar la suscripción a novedades.'
                : 'Mensaje recibido. Revisaremos el contexto y te responderemos por correo.');
            trackJoinHookEvent('form_submit', { form_name: 'contacto_comercial', service: payload.service, stage: payload.stage });
            trackJoinHookEvent('generate_lead', { lead_source: 'contact_form', service: payload.service });
        } catch {
            setState('error');
            setStatus('No pudimos enviar el mensaje en este momento. También puedes escribir a info@joinhook.cl.');
            trackJoinHookEvent('form_error', { form_name: 'contacto_comercial', error_type: 'network_or_server' });
        }
    }

    return (
        <form className="jh3-form" onSubmit={submit} onFocus={markStarted} noValidate>
            <div className="jh3-form-grid-2">
                <div className="jh3-field"><label htmlFor="jh-name">Nombre *</label><input id="jh-name" name="name" autoComplete="name" maxLength={100} required placeholder="Tu nombre" /></div>
                <div className="jh3-field"><label htmlFor="jh-email">Correo *</label><input id="jh-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={180} required placeholder="tu@correo.com" /></div>
                <div className="jh3-field"><label htmlFor="jh-phone">Teléfono / WhatsApp <span className="jh3-optional">(opcional)</span></label><input id="jh-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="+56 9 …" /></div>
                <div className="jh3-field"><label htmlFor="jh-company">Empresa / proyecto <span className="jh3-optional">(opcional)</span></label><input id="jh-company" name="company" autoComplete="organization" maxLength={140} placeholder="Empresa, organización o proyecto" /></div>
                <div className="jh3-field"><label htmlFor="jh-service">¿En qué podemos ayudarte? *</label><select id="jh-service" name="service" required defaultValue=""><option value="" disabled>Selecciona una opción</option><option value="web-pwa">Desarrollo web / PWA</option><option value="software">Software o sistema a medida</option><option value="automation">Automatización / integración</option><option value="ux-ui">UX/UI y diseño de producto</option><option value="prototype">Prototipo / MVP</option><option value="other">Otro</option></select></div>
                <div className="jh3-field"><label htmlFor="jh-stage">Etapa del proyecto *</label><select id="jh-stage" name="stage" required defaultValue=""><option value="" disabled>Selecciona una etapa</option><option value="idea">Idea inicial</option><option value="definition">En definición</option><option value="development">En desarrollo</option><option value="existing">Sistema existente</option><option value="improvement">Necesita mejora / optimización</option></select></div>
            </div>
            <div className="jh3-field"><label htmlFor="jh-need">¿Qué te gustaría resolver? *</label><textarea id="jh-need" name="need" maxLength={1800} required placeholder="Cuéntanos el problema, proceso, necesidad o idea. No incluyas contraseñas ni información sensible." /></div>
            <div className="jh3-honeypot" aria-hidden="true"><label htmlFor="jh-website">Sitio web</label><input id="jh-website" name="website" tabIndex={-1} autoComplete="off" /></div>
            <label className="jh3-check-row"><input type="checkbox" name="privacy" value="yes" required /><span>He leído la <Link href="/privacidad">Política de Privacidad</Link> y entiendo que JoinHook usará estos datos para responder mi solicitud. *</span></label>
            <label className="jh3-check-row"><input type="checkbox" name="newsletter" value="yes" /><span>Quiero recibir novedades, productos y contenidos de JoinHook. Esta opción es independiente y puedo darme de baja en cualquier momento.</span></label>
            <JoinHookTurnstile onToken={onTurnstileToken} />
            <button className="jh3-button jh3-button-primary" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Enviando…' : 'Enviar mensaje'} <span aria-hidden="true">→</span></button>
            <div className={`jh3-form-status ${state === 'ok' ? 'is-ok' : state === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">{status}</div>
            <small className="jh3-form-note">No enviamos nombres, correos, teléfonos ni el contenido de tu mensaje a las herramientas de analítica.</small>
        </form>
    );
}
