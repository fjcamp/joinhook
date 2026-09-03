export type ConsentState = {
    necessary: true;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
    updatedAt: string;
};

export const CONSENT_STORAGE_KEY = 'joinhook.consent.v1';

export const defaultConsent: ConsentState = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
    updatedAt: ''
};

export function readConsent(): ConsentState {
    if (typeof window === 'undefined') return defaultConsent;
    try {
        const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!raw) return defaultConsent;
        const parsed = JSON.parse(raw);
        return {
            necessary: true,
            analytics: Boolean(parsed.analytics),
            marketing: Boolean(parsed.marketing),
            preferences: Boolean(parsed.preferences),
            updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : ''
        };
    } catch {
        return defaultConsent;
    }
}

export function saveConsent(next: Omit<ConsentState, 'necessary' | 'updatedAt'>) {
    if (typeof window === 'undefined') return;
    const value: ConsentState = {
        necessary: true,
        analytics: next.analytics,
        marketing: next.marketing,
        preferences: next.preferences,
        updatedAt: new Date().toISOString()
    };
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('joinhook:consent-changed', { detail: value }));
}

function cleanParams(params: Record<string, unknown>) {
    return Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''));
}

export function currentAttribution() {
    if (typeof window === 'undefined') return {};
    const url = new URL(window.location.href);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    const result: Record<string, string> = {
        page_path: `${url.pathname}${url.search}`,
        page_title: document.title
    };
    keys.forEach((key) => {
        const value = url.searchParams.get(key);
        if (value) result[key] = value.slice(0, 120);
    });
    return result;
}

export function trackJoinHookEvent(name: string, params: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return;
    const consent = readConsent();
    if (!consent.analytics) return;
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (gtag) gtag('event', name, cleanParams({ ...currentAttribution(), ...params }));
}

export async function sha256(value: string) {
    if (typeof window === 'undefined' || !window.crypto?.subtle) return '';
    const bytes = new TextEncoder().encode(value.trim().toLowerCase());
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
