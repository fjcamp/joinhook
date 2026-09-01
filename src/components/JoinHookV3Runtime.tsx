import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export type ConsentState = {
    necessary: true;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
    version: '2026-09-01';
    updatedAt: string;
};

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

const STORAGE_KEY = 'joinhook.privacy-consent.v1';
const CONSENT_VERSION = '2026-09-01' as const;

function freshConsent(values?: Partial<ConsentState>): ConsentState {
    return {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
        version: CONSENT_VERSION,
        updatedAt: new Date().toISOString(),
        ...values
    };
}

function readConsent(): ConsentState | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as ConsentState;
        if (parsed.version !== CONSENT_VERSION) return null;
        return { ...freshConsent(), ...parsed, necessary: true };
    } catch {
        return null;
    }
}

function ensureGtag() {
    if (typeof window === 'undefined') return;
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
}

export function trackEvent(name: string, params: Record<string, string | number | boolean | undefined> = {}) {
    if (typeof window === 'undefined') return;
    const consent = readConsent();
    if (!consent?.analytics) return;
    ensureGtag();
    const safe: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(params)) if (value !== undefined) safe[key] = value;
    window.gtag?.('event', name, safe);
}

async function logConsent(consent: ConsentState) {
    try {
        await fetch('/api/privacy-consent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({
                consentId: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                version: consent.version,
                analytics: consent.analytics,
                marketing: consent.marketing,
                preferences: consent.preferences,
                updatedAt: consent.updatedAt
            })
        });
    } catch {
        // El registro remoto es auxiliar: la preferencia local sigue siendo la fuente de control del navegador.
    }
}

function PrivacyManager({ consent, onChange }: { consent: ConsentState | null; onChange: (value: ConsentState) => void }) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(() => consent || freshConsent());

    useEffect(() => {
        const handler = () => {
            setDraft(readConsent() || freshConsent());
            setOpen(true);
        };
        window.addEventListener('joinhook:open-privacy', handler);
        return () => window.removeEventListener('joinhook:open-privacy', handler);
    }, []);

    useEffect(() => { if (consent) setDraft(consent); }, [consent]);

    const save = (value: ConsentState) => {
        const next = { ...value, necessary: true as const, version: CONSENT_VERSION, updatedAt: new Date().toISOString() };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        onChange(next);
        void logConsent(next);
        setOpen(false);
    };

    return (
        <>
            {!consent && !open && (
                <aside className="jh3-consent" role="dialog" aria-label="Preferencias de privacidad" aria-live="polite">
                    <div><strong>Tu privacidad importa</strong><p>Usamos almacenamiento necesario para que el sitio funcione. La analítica y otras categorías opcionales solo se activan con tu elección.</p></div>
                    <div className="jh3-consent-actions">
                        <button className="jh3-button jh3-button-primary" onClick={() => save(freshConsent({ analytics: true, marketing: true, preferences: true }))}>Aceptar todas</button>
                        <button className="jh3-button jh3-button-secondary" onClick={() => save(freshConsent())}>Rechazar opcionales</button>
                        <button className="jh3-text-button" onClick={() => setOpen(true)}>Configurar</button>
                    </div>
                </aside>
            )}
            {open && (
                <div className="jh3-consent-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
                    <section className="jh3-consent-modal" role="dialog" aria-modal="true" aria-labelledby="jh3-consent-title">
                        <button className="jh3-consent-close" aria-label="Cerrar" onClick={() => setOpen(false)}>×</button>
                        <span className="jh3-eyebrow">Privacidad</span><h2 id="jh3-consent-title">Configura tus preferencias</h2>
                        <p>Puedes cambiar esta selección cuando quieras desde el pie de página. Las categorías opcionales permanecen desactivadas hasta que las autorices.</p>
                        <div className="jh3-consent-options">
                            <label><span><strong>Necesarias</strong><small>Seguridad, navegación y funciones esenciales.</small></span><input type="checkbox" checked disabled /></label>
                            <label><span><strong>Analítica</strong><small>Medición de uso, rendimiento y conversiones sin enviar contenido de formularios.</small></span><input type="checkbox" checked={draft.analytics} onChange={(e) => setDraft({ ...draft, analytics: e.target.checked })} /></label>
                            <label><span><strong>Marketing</strong><small>Preparada para futuras campañas; actualmente no activa publicidad por sí sola.</small></span><input type="checkbox" checked={draft.marketing} onChange={(e) => setDraft({ ...draft, marketing: e.target.checked })} /></label>
                            <label><span><strong>Preferencias</strong><small>Permite recordar opciones no esenciales de experiencia.</small></span><input type="checkbox" checked={draft.preferences} onChange={(e) => setDraft({ ...draft, preferences: e.target.checked })} /></label>
                        </div>
                        <div className="jh3-consent-actions"><button className="jh3-button jh3-button-primary" onClick={() => save(draft)}>Guardar preferencias</button><button className="jh3-button jh3-button-secondary" onClick={() => save(freshConsent())}>Solo necesarias</button></div>
                    </section>
                </div>
            )}
        </>
    );
}

function AnalyticsRuntime({ consent }: { consent: ConsentState | null }) {
    const router = useRouter();
    const measurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '';
    const cloudflareToken = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN || '';
    const enabled = Boolean(consent?.analytics);

    useEffect(() => {
        ensureGtag();
        window.gtag?.('consent', 'default', {
            analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', functionality_storage: 'granted', security_storage: 'granted'
        });
    }, []);

    useEffect(() => {
        ensureGtag();
        window.gtag?.('consent', 'update', {
            analytics_storage: enabled ? 'granted' : 'denied',
            ad_storage: consent?.marketing ? 'granted' : 'denied',
            ad_user_data: consent?.marketing ? 'granted' : 'denied',
            ad_personalization: consent?.marketing ? 'granted' : 'denied',
            personalization_storage: consent?.preferences ? 'granted' : 'denied'
        });
    }, [enabled, consent?.marketing, consent?.preferences]);

    useEffect(() => {
        if (!enabled) return;
        trackEvent('page_view', { page_path: router.asPath, page_title: document.title });
        const seen = new Set<string>();
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) if (entry.isIntersecting) {
                const section = entry.target as HTMLElement;
                const heading = section.querySelector('h1,h2,h3')?.textContent?.trim().slice(0, 80) || section.id || 'section';
                const key = `${router.asPath}:${heading}`;
                if (!seen.has(key)) { seen.add(key); trackEvent('section_view', { page_path: router.asPath, section: heading }); }
            }
        }, { threshold: 0.5 });
        document.querySelectorAll('main section').forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [enabled, router.asPath]);

    useEffect(() => {
        if (!enabled) return;
        const reached = new Set<number>();
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (max <= 0) return;
            const pct = Math.round((window.scrollY / max) * 100);
            [25, 50, 75, 90].forEach((mark) => { if (pct >= mark && !reached.has(mark)) { reached.add(mark); trackEvent('scroll_depth', { percent: mark, page_path: router.asPath }); } });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [enabled, router.asPath]);

    useEffect(() => {
        if (!enabled) return;
        const onClick = (event: MouseEvent) => {
            const element = (event.target as HTMLElement | null)?.closest('a,button') as HTMLAnchorElement | HTMLButtonElement | null;
            if (!element) return;
            const label = (element.textContent || element.getAttribute('aria-label') || '').trim().slice(0, 80);
            if (element instanceof HTMLAnchorElement && element.href) {
                const url = new URL(element.href, window.location.href);
                if (url.origin !== window.location.origin) trackEvent('outbound_click', { link_url: url.href, link_text: label, page_path: router.asPath });
            }
            if (element.classList.contains('jh3-button')) trackEvent('cta_click', { cta_text: label, page_path: router.asPath });
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, [enabled, router.asPath]);

    if (!enabled) return null;
    return <>
        {measurementId && <Script id="jh3-ga-src" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" onLoad={() => { ensureGtag(); window.gtag?.('js', new Date()); window.gtag?.('config', measurementId, { send_page_view: false, anonymize_ip: true }); }} />}
        {cloudflareToken && <Script id="jh3-cf-wa" src="https://static.cloudflareinsights.com/beacon.min.js" strategy="afterInteractive" data-cf-beacon={JSON.stringify({ token: cloudflareToken })} />}
    </>;
}

function WhatsAppButton() {
    const number = (process.env.NEXT_PUBLIC_JOINHOOK_WHATSAPP || '').replace(/\D/g, '');
    const href = useMemo(() => number ? `https://wa.me/${number}?text=${encodeURIComponent('Hola JoinHook, quisiera conversar sobre una idea, proyecto o proceso.')}` : '', [number]);
    if (!href) return null;
    return <a className="jh3-whatsapp" href={href} target="_blank" rel="noreferrer" aria-label="Hablar con JoinHook por WhatsApp" onClick={() => trackEvent('click_whatsapp', { page_path: window.location.pathname })}><span aria-hidden="true">◔</span><em>Hablar con JoinHook</em></a>;
}

export function JoinHookRuntime() {
    const [consent, setConsent] = useState<ConsentState | null>(null);
    useEffect(() => setConsent(readConsent()), []);
    return <>
        <AnalyticsRuntime consent={consent} />
        <PrivacyManager consent={consent} onChange={setConsent} />
        <WhatsAppButton />
    </>;
}
