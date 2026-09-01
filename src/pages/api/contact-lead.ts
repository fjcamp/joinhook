import type { NextApiRequest, NextApiResponse } from 'next';
import { cleanText, clientKey, rateLimited, requestOriginAllowed, subscribeBrevoDoubleOptIn, validEmail, verifyTurnstile } from '@/utils/joinhook-server';

const TOPICS = new Set(['desarrollo-web', 'software', 'automatizacion', 'producto-digital', 'mejora-proceso', 'otro']);
const STAGES = new Set(['idea', 'definicion', 'desarrollo', 'existente', 'operacion']);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, code: 'method' }); }
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return res.status(415).json({ ok: false, code: 'content_type' });
    if (!requestOriginAllowed(req)) return res.status(403).json({ ok: false, code: 'origin' });
    const key = clientKey(req);
    if (rateLimited(`contact:${key}`, 6)) return res.status(429).json({ ok: false, code: 'rate_limit' });

    const body = req.body || {};
    if (body.website) return res.status(202).json({ ok: true, filtered: true });
    const name = cleanText(body.name, 100);
    const email = cleanText(body.email, 180).toLowerCase();
    const phone = cleanText(body.phone, 40);
    const company = cleanText(body.company, 140);
    const topic = cleanText(body.topic, 50);
    const stage = cleanText(body.stage, 50);
    const message = cleanText(body.message, 1200);
    const source = cleanText(body.source, 80) || 'joinhook-contact-page';
    const newsletterOptIn = body.newsletterOptIn === true;
    const privacyAccepted = body.privacyAccepted === true;

    if (name.length < 2 || !validEmail(email) || message.length < 10 || !TOPICS.has(topic) || !STAGES.has(stage) || !privacyAccepted) return res.status(400).json({ ok: false, code: 'validation' });
    if (!await verifyTurnstile(body.turnstileToken, key)) return res.status(400).json({ ok: false, code: 'turnstile' });

    const lead = { name, email, phone: phone || undefined, company: company || undefined, topic, stage, message, source, occurredAt: new Date().toISOString(), privacyAccepted: true };
    let forwarded = false;
    const webhookUrl = process.env.JOINHOOK_LEAD_WEBHOOK_URL;
    if (webhookUrl) {
        try {
            const response = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'User-Agent': 'JoinHook-Web/3.0' }, body: JSON.stringify({ ...lead, notify: 'ventas@joinhook.cl' }), signal: AbortSignal.timeout(7000) });
            forwarded = response.ok;
            if (!response.ok) return res.status(502).json({ ok: false, code: 'lead_forward' });
        } catch { return res.status(502).json({ ok: false, code: 'lead_forward' }); }
    }

    let newsletter = { requested: false, configured: false, ok: false };
    if (newsletterOptIn) {
        try {
            const doi = await subscribeBrevoDoubleOptIn(email, name.split(/\s+/)[0] || '');
            newsletter = { requested: true, configured: doi.configured, ok: doi.ok };
        } catch { newsletter = { requested: true, configured: true, ok: false }; }
    }

    return res.status(202).json({ ok: true, forwarded, newsletter });
}
