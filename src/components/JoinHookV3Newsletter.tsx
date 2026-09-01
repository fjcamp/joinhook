import Script from 'next/script';
import { FormEvent, useState } from 'react';
import { trackEvent } from './JoinHookV3Runtime';

type Status = 'idle' | 'sending' | 'ok' | 'error';

export function JoinHookV3Newsletter({ compact = false }: { compact?: boolean }) {
    const [status, setStatus] = useState<Status>('idle');
    const [message, setMessage] = useState('');
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (status === 'sending') return;
        const form = event.currentTarget;
        const data = new FormData(form);
        const email = String(data.get('email') || '').trim();
        const name = String(data.get('name') || '').trim();
        const website = String(data.get('website') || '').trim();
        const turnstileToken = String(data.get('cf-turnstile-response') || '');
        if (!email || !email.includes('@')) { setStatus('error'); setMessage('Ingresa un correo válido.'); return; }

        setStatus('sending');
        setMessage('Enviando confirmación…');
        trackEvent('newsletter_start', { placement: compact ? 'footer' : 'content' });
        try {
            const response = await fetch('/api/newsletter-subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, website, turnstileToken, consent: true, source: compact ? 'footer' : 'content' })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result?.code || 'request_failed');
            form.reset();
            (window as unknown as { turnstile?: { reset?: () => void } }).turnstile?.reset?.();
            setStatus('ok');
            setMessage('Revisa tu correo y confirma la suscripción. No quedarás inscrito hasta completar ese paso.');
            trackEvent('newsletter_subscribe', { placement: compact ? 'footer' : 'content', method: 'double_opt_in' });
        } catch {
            setStatus('error');
            setMessage('No pudimos iniciar la suscripción. Inténtalo nuevamente más tarde.');
        }
    }

    return <form className={`jh3-newsletter-form ${compact ? 'is-compact' : ''}`} onSubmit={submit} onFocus={() => trackEvent('newsletter_start', { placement: compact ? 'footer' : 'content' })}>
        {siteKey && <Script id="joinhook-turnstile" src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />}
        {!compact && <div className="jh3-field"><label htmlFor="jh-news-name">Nombre <span className="jh3-optional">(opcional)</span></label><input id="jh-news-name" name="name" maxLength={80} autoComplete="name" placeholder="Tu nombre" /></div>}
        <div className="jh3-newsletter-row"><label className="jh3-sr-only" htmlFor={compact ? 'jh-news-email-footer' : 'jh-news-email'}>Correo</label><input id={compact ? 'jh-news-email-footer' : 'jh-news-email'} name="email" type="email" inputMode="email" autoComplete="email" maxLength={180} required placeholder="tu@correo.com" /><button className="jh3-button jh3-button-primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando…' : 'Suscribirme'}</button></div>
        <div className="jh3-honeypot" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        {siteKey && <div className="cf-turnstile jh3-turnstile" data-sitekey={siteKey} data-appearance="interaction-only" data-theme="light" />}
        {!compact && <small>La suscripción es independiente del formulario de contacto. Recibirás un correo de confirmación y podrás darte de baja en cualquier momento.</small>}
        {message && <div className={`jh3-form-status ${status === 'ok' ? 'is-ok' : status === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">{message}</div>}
    </form>;
}
