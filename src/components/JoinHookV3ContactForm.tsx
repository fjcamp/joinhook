import { FormEvent, useState } from 'react';

type State = 'idle' | 'sending' | 'ok' | 'error';

export function JoinHookV3ContactForm() {
    const [state, setState] = useState<State>('idle');
    const [status, setStatus] = useState('');

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (state === 'sending') return;
        const form = new FormData(event.currentTarget);
        const name = String(form.get('name') || '').trim();
        const email = String(form.get('email') || '').trim();
        const company = String(form.get('company') || '').trim();
        const need = String(form.get('need') || '').trim();
        const website = String(form.get('website') || '').trim();

        if (name.length < 2 || email.length < 5 || need.length < 10) {
            setState('error');
            setStatus('Completa tu nombre, correo y una breve descripción de lo que necesitas resolver.');
            return;
        }

        setState('sending');
        setStatus('Enviando…');
        try {
            const response = await fetch('/api/contact-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    intent: 'sales',
                    source: 'joinhook-contact-page',
                    website,
                    message: `Nombre: ${name}\nCorreo: ${email}\nEmpresa u organización: ${company || 'No informada'}\nNecesidad: ${need}`
                })
            });
            if (!response.ok) throw new Error('request_failed');
            event.currentTarget.reset();
            setState('ok');
            setStatus('Mensaje recibido. Revisaremos el contexto y te responderemos por correo.');
        } catch {
            setState('error');
            setStatus('No pudimos enviar el mensaje en este momento. También puedes escribir a info@joinhook.cl.');
        }
    }

    return (
        <form className="jh3-form" onSubmit={submit} noValidate>
            <div className="jh3-field">
                <label htmlFor="jh-name">Nombre</label>
                <input id="jh-name" name="name" autoComplete="name" maxLength={100} required placeholder="Tu nombre" />
            </div>
            <div className="jh3-field">
                <label htmlFor="jh-email">Correo</label>
                <input id="jh-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={180} required placeholder="tu@correo.com" />
            </div>
            <div className="jh3-field">
                <label htmlFor="jh-company">Empresa u organización <span className="jh3-optional">(opcional)</span></label>
                <input id="jh-company" name="company" autoComplete="organization" maxLength={140} placeholder="Nombre de la empresa o equipo" />
            </div>
            <div className="jh3-field">
                <label htmlFor="jh-need">¿Qué te gustaría resolver?</label>
                <textarea id="jh-need" name="need" maxLength={900} required placeholder="Cuéntanos brevemente el proceso, desafío o idea." />
            </div>
            <div className="jh3-honeypot" aria-hidden="true">
                <label htmlFor="jh-website">Sitio web</label>
                <input id="jh-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <button className="jh3-button jh3-button-primary" type="submit" disabled={state === 'sending'}>
                {state === 'sending' ? 'Enviando…' : 'Enviar mensaje'} <span aria-hidden="true">→</span>
            </button>
            <div className={`jh3-form-status ${state === 'ok' ? 'is-ok' : state === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">{status}</div>
            <small className="jh3-form-note">Usaremos estos datos únicamente para responder tu solicitud. Revisa nuestra política de privacidad.</small>
        </form>
    );
}
