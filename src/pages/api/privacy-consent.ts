import type { NextApiRequest, NextApiResponse } from 'next';
import { cleanText, clientKey, rateLimited, requestOriginAllowed } from '@/utils/joinhook-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
    if (!requestOriginAllowed(req)) return res.status(403).json({ ok: false });
    if (rateLimited(`consent:${clientKey(req)}`, 20, 10 * 60 * 1000)) return res.status(429).json({ ok: false });
    const body = req.body || {};
    const consentId = cleanText(body.consentId, 100);
    const version = cleanText(body.version, 20);
    if (!consentId || version !== '2026-09-01') return res.status(400).json({ ok: false });
    const event = {
        consentId,
        version,
        analytics: body.analytics === true,
        marketing: body.marketing === true,
        preferences: body.preferences === true,
        necessary: true,
        updatedAt: cleanText(body.updatedAt, 40) || new Date().toISOString(),
        recordedAt: new Date().toISOString()
    };
    const webhook = process.env.JOINHOOK_CONSENT_WEBHOOK_URL;
    if (webhook) {
        try { await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json', 'User-Agent': 'JoinHook-Web/3.0' }, body: JSON.stringify(event), signal: AbortSignal.timeout(5000) }); } catch { /* el control local de consentimiento no depende del webhook */ }
    }
    return res.status(202).json({ ok: true });
}
