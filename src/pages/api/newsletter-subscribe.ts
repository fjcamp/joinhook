import type { NextApiRequest, NextApiResponse } from 'next';
import { cleanText, clientKey, rateLimited, requestOriginAllowed, subscribeBrevoDoubleOptIn, validEmail, verifyTurnstile } from '@/utils/joinhook-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, code: 'method' }); }
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return res.status(415).json({ ok: false, code: 'content_type' });
    if (!requestOriginAllowed(req)) return res.status(403).json({ ok: false, code: 'origin' });
    const key = clientKey(req);
    if (rateLimited(`newsletter:${key}`, 4, 15 * 60 * 1000)) return res.status(429).json({ ok: false, code: 'rate_limit' });

    const body = req.body || {};
    if (body.website) return res.status(202).json({ ok: true, filtered: true });
    const email = cleanText(body.email, 180).toLowerCase();
    const name = cleanText(body.name, 80);
    if (!validEmail(email) || body.consent !== true) return res.status(400).json({ ok: false, code: 'validation' });
    if (!await verifyTurnstile(body.turnstileToken, key)) return res.status(400).json({ ok: false, code: 'turnstile' });

    try {
        const result = await subscribeBrevoDoubleOptIn(email, name.split(/\s+/)[0] || '');
        if (!result.configured) return res.status(503).json({ ok: false, code: 'newsletter_not_configured' });
        if (!result.ok) return res.status(502).json({ ok: false, code: 'provider' });
        return res.status(201).json({ ok: true, doubleOptIn: true });
    } catch {
        return res.status(502).json({ ok: false, code: 'provider' });
    }
}
