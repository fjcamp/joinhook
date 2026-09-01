import type { NextApiRequest } from 'next';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientKey(req: NextApiRequest) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim();
    return ip || req.socket.remoteAddress || 'unknown';
}

export function rateLimited(key: string, max = 6, windowMs = 10 * 60 * 1000) {
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return false;
    }
    bucket.count += 1;
    return bucket.count > max;
}

export function cleanText(value: unknown, max: number) {
    if (typeof value !== 'string') return '';
    return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

export function validEmail(value: unknown) {
    return typeof value === 'string' && value.length <= 180 && EMAIL_RE.test(value.trim());
}

export function requestOriginAllowed(req: NextApiRequest) {
    const origin = String(req.headers.origin || '');
    if (!origin || process.env.NODE_ENV !== 'production') return true;
    const allowed = new Set(['https://joinhook.cl', 'https://www.joinhook.cl']);
    const staging = process.env.JOINHOOK_STAGING_ORIGIN;
    if (staging) allowed.add(staging.replace(/\/$/, ''));
    return allowed.has(origin.replace(/\/$/, ''));
}

export async function verifyTurnstile(token: unknown, remoteip?: string) {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return process.env.NODE_ENV !== 'production';
    if (typeof token !== 'string' || token.length < 10 || token.length > 2048) return false;
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret, response: token, remoteip }),
            signal: AbortSignal.timeout(6000)
        });
        if (!response.ok) return false;
        const outcome = await response.json() as { success?: boolean };
        return outcome.success === true;
    } catch {
        return false;
    }
}

export async function subscribeBrevoDoubleOptIn(email: string, firstName = '') {
    const apiKey = process.env.BREVO_API_KEY;
    const listId = Number(process.env.BREVO_LIST_ID || 0);
    const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID || 0);
    const redirectionUrl = process.env.BREVO_DOI_REDIRECT_URL || 'https://joinhook.cl/?newsletter=confirmada';
    if (!apiKey || !listId || !templateId) return { configured: false, ok: false };

    const response = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
            Accept: 'application/json'
        },
        body: JSON.stringify({
            email,
            includeListIds: [listId],
            templateId,
            redirectionUrl,
            attributes: firstName ? { FNAME: firstName.slice(0, 80) } : undefined
        }),
        signal: AbortSignal.timeout(8000)
    });
    return { configured: true, ok: response.ok, status: response.status };
}
