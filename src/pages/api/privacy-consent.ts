import type { NextApiRequest, NextApiResponse } from 'next';
import { isRateLimited, requestIp, sanitizeText, validOrigin } from '@/lib/joinhook-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false });
    }
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return res.status(415).json({ ok: false });
    if (!validOrigin(req)) return res.status(403).json({ ok: false });
    const ip = requestIp(req);
    if (isRateLimited(`consent:${ip}`, 20, 60 * 60 * 1000)) return res.status(429).json({ ok: false });

    const body = req.body || {};
    const consentId = sanitizeText(body.consentId, 80);
    const updatedAt = sanitizeText(body.updatedAt, 40);
    if (!/^[a-zA-Z0-9-]{12,80}$/.test(consentId) || !updatedAt) return res.status(400).json({ ok: false });

    const event = {
        type: 'privacy_consent',
        consentId,
        updatedAt,
        categories: {
            necessary: true,
            analytics: body.analytics === true,
            marketing: body.marketing === true,
            preferences: body.preferences === true
        },
        policyVersion: '2026-09-01'
    };

    const webhook = process.env.JOINHOOK_PRIVACY_WEBHOOK_URL || '';
    if (!webhook) return res.status(202).json({ ok: true, persisted: false });
    try {
        const response = await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'JoinHook-Web/3.0' },
            body: JSON.stringify(event),
            signal: AbortSignal.timeout(6000)
        });
        if (!response.ok) return res.status(502).json({ ok: false });
        return res.status(202).json({ ok: true, persisted: true });
    } catch {
        return res.status(502).json({ ok: false });
    }
}
