import type { NextApiRequest, NextApiResponse } from 'next';
import { authorizeControlPlaneBearer } from '@/lib/control-plane/auth';
import { listCommerceDomainEvents } from '@/lib/commerce/event-log';

function firstString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const token = process.env.JOINHOOK_CP_COMMERCE_TOKEN?.trim() || '';
  if (!token) return res.status(503).json({ error: 'control_plane_not_configured' });
  if (!authorizeControlPlaneBearer(req.headers.authorization, token)) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const after = firstString(req.query.after)?.trim() || null;
  if (after && Number.isNaN(Date.parse(after))) {
    return res.status(400).json({ error: 'invalid_after' });
  }
  const requestedLimit = Number(firstString(req.query.limit) || 50);
  const limit = Number.isFinite(requestedLimit) ? Math.max(1, Math.min(Math.floor(requestedLimit), 100)) : 50;

  try {
    const events = await listCommerceDomainEvents({ after, limit });
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      contractVersion: 1,
      productId: 'joinhook-commerce',
      events,
      nextAfter: events.at(-1)?.occurredAt ?? after,
    });
  } catch (error) {
    console.error('[control-plane/events]', error);
    return res.status(500).json({ error: 'event_feed_failed' });
  }
}
