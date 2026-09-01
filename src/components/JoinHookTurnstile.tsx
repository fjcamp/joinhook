import { useEffect, useId, useRef } from 'react';

type TurnstileApi = {
    render: (target: string | HTMLElement, options: Record<string, unknown>) => string;
    remove: (widgetId: string) => void;
};

declare global {
    interface Window { turnstile?: TurnstileApi; }
}

let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstile() {
    if (typeof window === 'undefined') return Promise.resolve();
    if (window.turnstile) return Promise.resolve();
    if (turnstileScriptPromise) return turnstileScriptPromise;
    turnstileScriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>('script[data-joinhook-turnstile]');
        if (existing) {
            existing.addEventListener('load', () => resolve(), { once: true });
            existing.addEventListener('error', () => reject(new Error('turnstile_load_failed')), { once: true });
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.dataset.joinhookTurnstile = 'true';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('turnstile_load_failed'));
        document.head.appendChild(script);
    });
    return turnstileScriptPromise;
}

export function JoinHookTurnstile({ onToken }: { onToken: (token: string) => void }) {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';
    const ref = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string>('');
    const reactId = useId().replace(/:/g, '');

    useEffect(() => {
        if (!siteKey || !ref.current) return;
        let cancelled = false;
        loadTurnstile().then(() => {
            if (cancelled || !ref.current || !window.turnstile) return;
            widgetId.current = window.turnstile.render(ref.current, {
                sitekey: siteKey,
                theme: 'auto',
                size: 'flexible',
                action: 'joinhook_form',
                callback: (token: string) => onToken(token),
                'expired-callback': () => onToken(''),
                'error-callback': () => onToken('')
            });
        }).catch(() => onToken(''));
        return () => {
            cancelled = true;
            if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
        };
    }, [siteKey, onToken]);

    if (!siteKey) return <input type="hidden" name="turnstile-status" value="not-configured" readOnly />;
    return <div id={`jh-turnstile-${reactId}`} className="jh-turnstile" ref={ref} aria-label="Verificación anti-bot" />;
}
