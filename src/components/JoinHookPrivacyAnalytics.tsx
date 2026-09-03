import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { defaultConsent, readConsent, saveConsent, type ConsentState } from '@/lib/joinhook-web';

const CONSENT_ID_KEY = 'joinhook.consent-id.v1';

function getConsentId() {
    if (typeof window === 'undefined') return '';
    let id = window.localStorage.getItem(CONSENT_ID_KEY) || '';
    if (id) return id;
    id = typeof window.crypto?.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `jh-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
    window.localStorage.setItem(CONSENT_ID_KEY, id);
    return id;
}

async function auditConsent(consent: ConsentState) {
    try {
        const consentId = getConsentId();
        if (!consentId || !consent.updatedAt) return;
        await fetch('/api/privacy-consent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({
                consentId,
                updatedAt: consent.updatedAt,
                analytics: consent.analytics,
                marketing: consent.marketing,
                preferences: consent.preferences
            })
        });
    } catch {
        // Consent remains valid locally even when optional audit persistence is unavailable.
    }
}

function updateGoogleConsent(consent: ConsentState) {
    if (typeof window === 'undefined') return;
    const gtag = (window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }).gtag;
    if (!gtag) return;
    gtag('consent', 'update', {
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        ad_storage: consent.marketing ? 'granted' : 'denied',
        ad_user_data: consent.marketing ? 'granted' : 'denied',
        ad_personalization: consent.marketing ? 'granted' : 'denied',
        functionality_storage: consent.preferences ? 'granted' : 'denied',
        personalization_storage: consent.preferences ? 'granted' : 'denied',
        security_storage: 'granted'
    });
}

function loadGa4(id: string) {
    if (!id || typeof window === 'undefined' || document.querySelector(`script[data-joinhook-ga4="${id}"]`)) return;
    const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function (...args: unknown[]) { w.dataLayer?.push(args); };
    w.gtag('js', new Date());
    w.gtag('config', id, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        send_page_view: true
    });
    const script = document.createElement('script');
    script.async = true;
    script.dataset.joinhookGa4 = id;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
}

function loadCloudflare(token: string) {
    if (!token || typeof window === 'undefined' || document.querySelector('script[data-joinhook-cf-analytics]')) return;
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.joinhookCfAnalytics = 'true';
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
    document.head.appendChild(script);
}

export function JoinHookPrivacyAnalytics() {
    const [consent, setConsent] = useState<ConsentState>(defaultConsent);
    const [ready, setReady] = useState(false);
    const [open, setOpen] = useState(false);
    const [customize, setCustomize] = useState(false);
    const ga4Id = process.env.NEXT_PUBLIC_GA4_ID || '';
    const cfToken = process.env.NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN || '';
    const hasDecision = useMemo(() => Boolean(consent.updatedAt), [consent.updatedAt]);

    useEffect(() => {
        const initial = readConsent();
        setConsent(initial);
        setReady(true);
        const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
        w.dataLayer = w.dataLayer || [];
        w.gtag = w.gtag || function (...args: unknown[]) { w.dataLayer?.push(args); };
        w.gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            functionality_storage: 'denied',
            personalization_storage: 'denied',
            security_storage: 'granted',
            wait_for_update: 500
        });
        updateGoogleConsent(initial);
        if (initial.analytics) {
            loadGa4(ga4Id);
            loadCloudflare(cfToken);
        }
    }, [ga4Id, cfToken]);

    useEffect(() => {
        const listener = (event: Event) => {
            const next = (event as CustomEvent<ConsentState>).detail;
            setConsent(next);
            updateGoogleConsent(next);
            void auditConsent(next);
            if (next.analytics) {
                loadGa4(ga4Id);
                loadCloudflare(cfToken);
            }
        };
        window.addEventListener('joinhook:consent-changed', listener);
        return () => window.removeEventListener('joinhook:consent-changed', listener);
    }, [ga4Id, cfToken]);

    function persist(next: { analytics: boolean; marketing: boolean; preferences: boolean }) {
        saveConsent(next);
        setOpen(false);
        setCustomize(false);
    }

    if (!ready) return null;

    return (
        <>
            {!hasDecision && !open && (
                <aside className="jh-consent" role="dialog" aria-label="Preferencias de privacidad">
                    <div>
                        <strong>Tu privacidad importa</strong>
                        <p>Usamos almacenamiento necesario para que el sitio funcione. La analítica y otras tecnologías opcionales solo se activan con tu elección.</p>
                        <Link href="/cookies">Ver política de cookies</Link>
                    </div>
                    <div className="jh-consent-actions">
                        <button type="button" onClick={() => persist({ analytics: false, marketing: false, preferences: false })}>Rechazar opcionales</button>
                        <button type="button" onClick={() => { setOpen(true); setCustomize(true); }}>Configurar</button>
                        <button className="is-primary" type="button" onClick={() => persist({ analytics: true, marketing: true, preferences: true })}>Aceptar todas</button>
                    </div>
                </aside>
            )}

            {(open || customize) && (
                <div className="jh-consent-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setOpen(false); }}>
                    <section className="jh-consent-modal" role="dialog" aria-modal="true" aria-label="Configurar privacidad">
                        <div className="jh-consent-modal-head"><div><strong>Preferencias de privacidad</strong><p>Puedes cambiar esta decisión cuando quieras.</p></div><button type="button" aria-label="Cerrar" onClick={() => setOpen(false)}>×</button></div>
                        <label className="jh-consent-row is-disabled"><span><b>Necesarias</b><small>Seguridad, navegación y funciones esenciales.</small></span><input type="checkbox" checked disabled /></label>
                        <label className="jh-consent-row"><span><b>Analítica</b><small>Ayuda a comprender uso, rendimiento y conversiones sin enviar contenido de formularios.</small></span><input type="checkbox" checked={consent.analytics} onChange={(event) => setConsent({ ...consent, analytics: event.target.checked })} /></label>
                        <label className="jh-consent-row"><span><b>Marketing</b><small>Reservado para medición publicitaria si se habilita en el futuro.</small></span><input type="checkbox" checked={consent.marketing} onChange={(event) => setConsent({ ...consent, marketing: event.target.checked })} /></label>
                        <label className="jh-consent-row"><span><b>Preferencias</b><small>Recuerda opciones no esenciales para personalizar la experiencia.</small></span><input type="checkbox" checked={consent.preferences} onChange={(event) => setConsent({ ...consent, preferences: event.target.checked })} /></label>
                        <div className="jh-consent-modal-actions"><button type="button" onClick={() => persist({ analytics: false, marketing: false, preferences: false })}>Rechazar opcionales</button><button className="is-primary" type="button" onClick={() => persist({ analytics: consent.analytics, marketing: consent.marketing, preferences: consent.preferences })}>Guardar preferencias</button></div>
                    </section>
                </div>
            )}

            <button className="jh-privacy-fab" type="button" onClick={() => setOpen(true)} aria-label="Abrir preferencias de privacidad">Privacidad</button>
        </>
    );
}
