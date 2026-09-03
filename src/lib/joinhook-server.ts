import type { NextApiRequest } from 'next';

const buckets = new Map<string, { count: number; resetAt: number }>();

export function requestIp(req: NextApiRequest) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim();
    return ip || req.socket.remoteAddress || 'unknown';
}

export function isRateLimited(key: string, maxRequests = 6, windowMs = 10 * 60 * 1000) {
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return false;
    }
    bucket.count += 1;
    return bucket.count > maxRequests;
}

export function validOrigin(req: NextApiRequest) {
    const origin = String(req.headers.origin || '');
    if (!origin || process.env.NODE_ENV !== 'production') return true;
    return origin === 'https://joinhook.cl' || origin === 'https://www.joinhook.cl';
}

export function sanitizeText(value: unknown, max = 1200) {
    if (typeof value !== 'string') return '';
    return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
}

export function isEmail(value: unknown) {
    return typeof value === 'string' && value.length <= 180 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function verifyTurnstile(token: unknown, remoteIp?: string) {
    const secret = process.env.TURNSTILE_SECRET_KEY || '';
    const required = process.env.JOINHOOK_REQUIRE_TURNSTILE === 'true';
    if (!secret) return !required;
    if (typeof token !== 'string' || !token) return false;

    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp && remoteIp !== 'unknown') body.set('remoteip', remoteIp);
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
            signal: AbortSignal.timeout(6000)
        });
        if (!response.ok) return false;
        const result = await response.json() as { success?: boolean; action?: string };
        if (!result.success) return false;
        return !result.action || result.action === 'joinhook_form';
    } catch {
        return false;
    }
}
