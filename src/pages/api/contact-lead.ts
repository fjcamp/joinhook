import type { NextApiRequest, NextApiResponse } from 'next';
import { isEmail, isRateLimited, requestIp, sanitizeText, validOrigin, verifyTurnstile } from '@/lib/joinhook-server';

const SERVICES = new Set(['web-pwa', 'software', 'automation', 'ux-ui', 'prototype', 'other']);
const STAGES = new Set(['idea', 'definition', 'development', 'existing', 'improvement']);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false });
    }
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return res.status(415).json({ ok: false });
    if (!validOrigin(req)) return res.status(403).json({ ok: false });

    const ip = requestIp(req);
    if (isRateLimited(`contact:${ip}`, 6, 10 * 60 * 1000)) return res.status(429).json({ ok: false });

    const body = req.body || {};
    if (body.website) return res.status(202).json({ ok: true });

    const name = sanitizeText(body.name, 100);
    const email = sanitizeText(body.email, 180).toLowerCase();
    const phone = sanitizeText(body.phone, 40);
    const company = sanitizeText(body.company, 140);
    const service = sanitizeText(body.service, 40);
    const stage = sanitizeText(body.stage, 40);
    const need = sanitizeText(body.need, 1800);
    const source = sanitizeText(body.source, 80) || 'joinhook-web';
    const privacyAcknowledged = body.privacyAcknowledged === true;

    if (name.length < 2 || !isEmail(email) || need.length < 10 || !SERVICES.has(service) || !STAGES.has(stage) || !privacyAcknowledged) {
        return res.status(400).json({ ok: false });
    }

    const turnstileOk = await verifyTurnstile(body.turnstileToken, ip);
    if (!turnstileOk) return res.status(403).json({ ok: false, code: 'bot_verification_failed' });

    const webhookUrl = process.env.JOINHOOK_LEAD_WEBHOOK_URL || '';
    if (!webhookUrl) {
        if (process.env.NODE_ENV === 'production' && process.env.JOINHOOK_REQUIRE_LEAD_WEBHOOK === 'true') {
            return res.status(503).json({ ok: false, code: 'lead_destination_not_configured' });
        }
        return res.status(202).json({ ok: true, forwarded: false });
    }

    const lead = {
        type: 'commercial_lead',
        occurredAt: new Date().toISOString(),
        source,
        contact: { name, email, phone: phone || null, company: company || null },
        request: { service, stage, need },
        privacy: { acknowledged: true },
        attribution: typeof body.attribution === 'object' && body.attribution ? body.attribution : {},
        notify: 'ventas@joinhook.cl'
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'JoinHook-Web/3.0' },
            body: JSON.stringify(lead),
            signal: AbortSignal.timeout(7000)
        });
        if (!response.ok) return res.status(502).json({ ok: false, forwarded: false });
        return res.status(202).json({ ok: true, forwarded: true });
    } catch {
        return res.status(502).json({ ok: false, forwarded: false });
    }
}
