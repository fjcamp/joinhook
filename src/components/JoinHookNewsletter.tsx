import Link from 'next/link';
import { FormEvent, useCallback, useRef, useState } from 'react';
import { JoinHookTurnstile } from '@/components/JoinHookTurnstile';
import { trackJoinHookEvent } from '@/lib/joinhook-web';

export function JoinHookNewsletter({ compact = false }: { compact?: boolean }) {
    const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [turnstileToken, setTurnstileToken] = useState('');
    const started = useRef(false);
    const onTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (state === 'sending') return;
        const form = event.currentTarget;
        const data = new FormData(form);
        const email = String(data.get('email') || '').trim();
        const website = String(data.get('website') || '').trim();
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setState('error');
            setMessage('Ingresa un correo válido.');
            return;
        }
        setState('sending');
        setMessage('Enviando confirmación…');
        try {
            const response = await fetch('/api/newsletter-subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, website, turnstileToken, source: compact ? 'footer' : 'newsletter-section' })
            });
            if (!response.ok) throw new Error('subscribe_failed');
            form.reset();
            setTurnstileToken('');
            setState('ok');
            setMessage('Revisa tu correo y confirma la suscripción.');
            trackJoinHookEvent('newsletter_subscribe', { placement: compact ? 'footer' : 'content', method: 'double_opt_in_requested' });
        } catch {
            setState('error');
            setMessage('No pudimos iniciar la suscripción. Inténtalo nuevamente más tarde.');
        }
    }

    return (
        <section className={compact ? 'jh-newsletter is-compact' : 'jh-newsletter'} aria-label="Newsletter JoinHook">
            <div className="jh-newsletter-copy">
                <span className="jh3-eyebrow">Newsletter</span>
                <h2>Ideas, productos y avances de JoinHook</h2>
                <p>Recibe novedades sobre productos, tecnología aplicada y contenidos seleccionados. Sin correo innecesario.</p>
            </div>
            <form onSubmit={submit} onFocus={() => { if (!started.current) { started.current = true; trackJoinHookEvent('newsletter_start', { placement: compact ? 'footer' : 'content' }); } }}>
                <div className="jh-newsletter-input"><label className="sr-only" htmlFor={compact ? 'jh-newsletter-email-footer' : 'jh-newsletter-email'}>Correo electrónico</label><input id={compact ? 'jh-newsletter-email-footer' : 'jh-newsletter-email'} type="email" name="email" autoComplete="email" maxLength={180} required placeholder="tu@correo.com" /><button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Enviando…' : 'Suscribirme'}</button></div>
                <div className="jh3-honeypot" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
                {!compact && <JoinHookTurnstile onToken={onTurnstileToken} />}
                <small>Puedes cancelar tu suscripción en cualquier momento. <Link href="/privacidad">Privacidad</Link>.</small>
                <div className={`jh-newsletter-status ${state === 'error' ? 'is-error' : state === 'ok' ? 'is-ok' : ''}`} role="status" aria-live="polite">{message}</div>
            </form>
        </section>
    );
}

export function JoinHookFooterNewsletter() {
    return <div className="jh-newsletter-footer-wrap">
        <JoinHookNewsletter compact />
        <nav className="jh-legal-links" aria-label="Información legal"><Link href="/privacidad">Privacidad</Link><Link href="/cookies">Cookies</Link><Link href="/terminos">Términos</Link></nav>
    </div>;
}
