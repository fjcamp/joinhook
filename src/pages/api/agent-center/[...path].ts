import type { NextApiRequest, NextApiResponse } from 'next';
import { requireOwnerSession } from '@/utils/agentCenterAuth';

const ALLOWED_ROOTS = new Set([
  'health',
  'registry',
  'tools',
  'knowledge',
  'tasks',
  'runs',
  'approvals',
  'kill-switch',
  'costs',
  'audit',
  'dashboard',
]);

function configuration() {
  const baseUrl = process.env.JOINHOOK_AGENT_API_URL?.replace(/\/$/, '');
  const token = process.env.JOINHOOK_AGENT_API_TOKEN;
  if (!baseUrl || !/^https?:\/\//i.test(baseUrl)) {
    throw new Error('JOINHOOK_AGENT_API_URL is not configured');
  }
  if (!token || token.length < 16) {
    throw new Error('JOINHOOK_AGENT_API_TOKEN is not configured');
  }
  return { baseUrl, token };
}

function buildTarget(req: NextApiRequest, baseUrl: string): string {
  const segments = Array.isArray(req.query.path) ? req.query.path : [String(req.query.path ?? '')];
  if (!segments.length || !ALLOWED_ROOTS.has(segments[0])) {
    throw new Error('Agent Center endpoint is not allowlisted');
  }

  for (const segment of segments) {
    if (!segment || segment === '.' || segment === '..' || segment.includes('/') || segment.includes('\\')) {
      throw new Error('Invalid Agent Center path');
    }
  }

  const target = new URL(`${baseUrl}/api/agent/${segments.map(encodeURIComponent).join('/')}`);
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path') continue;
    if (Array.isArray(value)) value.forEach((item) => target.searchParams.append(key, item));
    else if (typeof value === 'string') target.searchParams.set(key, value);
  }
  return target.toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!requireOwnerSession(req, res)) return;

  try {
    const { baseUrl, token } = configuration();
    const target = buildTarget(req, baseUrl);
    const hasBody = !['GET', 'HEAD'].includes(req.method ?? 'GET');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const upstream = await fetch(target, {
        method: req.method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-JoinHook-Actor': 'owner-panel',
        },
        body: hasBody ? JSON.stringify(req.body ?? {}) : undefined,
        signal: controller.signal,
      });

      const text = await upstream.text();
      res.status(upstream.status);
      res.setHeader('Cache-Control', 'no-store');
      const contentType = upstream.headers.get('content-type');
      if (contentType) res.setHeader('Content-Type', contentType);

      if (!text) return res.end();
      if (contentType?.includes('application/json')) {
        try {
          return res.json(JSON.parse(text));
        } catch {
          return res.status(502).json({ error: 'invalid_agent_api_json' });
        }
      }
      return res.send(text);
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error('Agent Center proxy error:', error);
    const isProduction = process.env.NODE_ENV === 'production';
    return res.status(503).json({
      error: 'agent_center_unavailable',
      message: isProduction ? 'Agent Control Plane is not available.' : String(error),
    });
  }
}
