import type { NextApiRequest, NextApiResponse } from 'next';

const ALLOWED_INTENTS = new Set(['support', 'human', 'sales']);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false });
    }

    const { intent, message, source, website } = req.body || {};

    // Honeypot simple para formularios/bots automatizados.
    if (website) return res.status(202).json({ ok: true });

    if (!ALLOWED_INTENTS.has(intent) || typeof message !== 'string' || message.length < 2 || message.length > 500) {
        return res.status(400).json({ ok: false });
    }

    const webhookUrl = process.env.JOINHOOK_LEAD_WEBHOOK_URL;
    if (!webhookUrl) {
        // El chat sigue operativo aunque la automatización aún no esté configurada.
        return res.status(202).json({ ok: true, forwarded: false });
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'JoinHook-Web-Assistant/1.0'
            },
            body: JSON.stringify({
                intent,
                message,
                source: typeof source === 'string' ? source : 'joinhook-web-assistant',
                occurredAt: new Date().toISOString(),
                notify: 'ventas@joinhook.cl'
            }),
            signal: AbortSignal.timeout(6000)
        });

        if (!response.ok) {
            return res.status(502).json({ ok: false, forwarded: false });
        }

        return res.status(202).json({ ok: true, forwarded: true });
    } catch {
        return res.status(502).json({ ok: false, forwarded: false });
    }
}
