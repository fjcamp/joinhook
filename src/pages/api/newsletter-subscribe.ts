import type { NextApiRequest, NextApiResponse } from 'next';
import { isEmail, isRateLimited, requestIp, sanitizeText, validOrigin, verifyTurnstile } from '@/lib/joinhook-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false });
    }
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return res.status(415).json({ ok: false });
    if (!validOrigin(req)) return res.status(403).json({ ok: false });

    const ip = requestIp(req);
    if (isRateLimited(`newsletter:${ip}`, 8, 30 * 60 * 1000)) return res.status(429).json({ ok: false });
    const body = req.body || {};
    if (body.website) return res.status(202).json({ ok: true });

    const email = sanitizeText(body.email, 180).toLowerCase();
    const name = sanitizeText(body.name, 100);
    const source = sanitizeText(body.source, 80) || 'joinhook-web';
    if (!isEmail(email)) return res.status(400).json({ ok: false });

    const turnstileRequiredForNewsletter = process.env.JOINHOOK_REQUIRE_NEWSLETTER_TURNSTILE === 'true';
    if (turnstileRequiredForNewsletter) {
        const ok = await verifyTurnstile(body.turnstileToken, ip);
        if (!ok) return res.status(403).json({ ok: false, code: 'bot_verification_failed' });
    }

    const apiKey = process.env.BREVO_API_KEY || '';
    const listId = Number(process.env.BREVO_LIST_ID || 0);
    const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID || 0);
    const redirectionUrl = process.env.BREVO_DOI_REDIRECT_URL || 'https://joinhook.cl/newsletter-confirmada/';

    if (!apiKey || !listId || !templateId) {
        if (process.env.NODE_ENV === 'production' && process.env.JOINHOOK_REQUIRE_BREVO === 'true') {
            return res.status(503).json({ ok: false, code: 'newsletter_not_configured' });
        }
        return res.status(202).json({ ok: true, configured: false });
    }

    const attributes: Record<string, string> = { SOURCE: source };
    if (name) attributes.FIRSTNAME = name.split(/\s+/)[0].slice(0, 50);

    try {
        const response = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'api-key': apiKey,
                'User-Agent': 'JoinHook-Web/3.0'
            },
            body: JSON.stringify({
                email,
                includeListIds: [listId],
                redirectionUrl,
                templateId,
                attributes
            }),
            signal: AbortSignal.timeout(7000)
        });
        if (response.ok || response.status === 201 || response.status === 204) return res.status(202).json({ ok: true, configured: true });
        const detail = await response.text().catch(() => '');
        console.error('Brevo DOI error', response.status, detail.slice(0, 300));
        return res.status(502).json({ ok: false });
    } catch (error) {
        console.error('Brevo DOI request failed', error);
        return res.status(502).json({ ok: false });
    }
}
