import type { NextApiRequest, NextApiResponse } from 'next';

const ALLOWED_INTENTS = new Set(['support', 'human', 'sales']);
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 6;
const buckets = new Map<string, { count: number; resetAt: number }>();

function clientKey(req: NextApiRequest) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]?.trim();
    return ip || req.socket.remoteAddress || 'unknown';
}

function rateLimited(key: string) {
    const now = Date.now();
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
        return false;
    }
    bucket.count += 1;
    return bucket.count > MAX_REQUESTS;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false });
    }
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
        return res.status(415).json({ ok: false });
    }
    const origin = String(req.headers.origin || '');
    if (origin && origin !== 'https://joinhook.cl' && origin !== 'https://www.joinhook.cl' && process.env.NODE_ENV === 'production') {
        return res.status(403).json({ ok: false });
    }
    if (rateLimited(clientKey(req))) return res.status(429).json({ ok: false });

    const { intent, message, source, website } = req.body || {};
    if (website) return res.status(202).json({ ok: true });
    if (!ALLOWED_INTENTS.has(intent) || typeof message !== 'string' || message.trim().length < 10 || message.length > 1200) {
        return res.status(400).json({ ok: false });
    }

    const cleanMessage = message.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
    const webhookUrl = process.env.JOINHOOK_LEAD_WEBHOOK_URL;
    if (!webhookUrl) return res.status(202).json({ ok: true, forwarded: false });

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'JoinHook-Web/2.0' },
            body: JSON.stringify({ intent, message: cleanMessage, source: typeof source === 'string' ? source.slice(0, 80) : 'joinhook-web', occurredAt: new Date().toISOString(), notify: 'ventas@joinhook.cl' }),
            signal: AbortSignal.timeout(6000)
        });
        if (!response.ok) return res.status(502).json({ ok: false, forwarded: false });
        return res.status(202).json({ ok: true, forwarded: true });
    } catch {
        return res.status(502).json({ ok: false, forwarded: false });
    }
}
