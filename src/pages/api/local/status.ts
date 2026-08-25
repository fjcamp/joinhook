import type { NextApiRequest, NextApiResponse } from 'next';

type CheckState = 'ready' | 'missing' | 'error';

type StatusPayload = {
  ok: boolean;
  checks: {
    supabaseUrl: CheckState;
    publishableKey: CheckState;
    serviceRoleKey: CheckState;
    setupToken: CheckState;
    database: CheckState;
    adminInitialized: boolean | null;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<StatusPayload | { error: string }>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const url = process.env.LOCAL_SUPABASE_URL?.replace(/\/$/, '');
  const publishableKey = process.env.LOCAL_SUPABASE_PUBLISHABLE_KEY;
  const serviceKey = process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY;
  const setupToken = process.env.LOCAL_ADMIN_SETUP_TOKEN;

  const checks: StatusPayload['checks'] = {
    supabaseUrl: url ? 'ready' : 'missing',
    publishableKey: publishableKey ? 'ready' : 'missing',
    serviceRoleKey: serviceKey ? 'ready' : 'missing',
    setupToken: setupToken ? 'ready' : 'missing',
    database: 'missing',
    adminInitialized: null,
  };

  if (url && serviceKey) {
    try {
      const response = await fetch(`${url}/rest/v1/local_user_roles?select=user_id&limit=1`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json' },
      });
      if (response.ok) {
        const rows = await response.json() as Array<{ user_id: string }>;
        checks.database = 'ready';
        checks.adminInitialized = rows.length > 0;
      } else {
        checks.database = 'error';
      }
    } catch {
      checks.database = 'error';
    }
  }

  const coreReady = checks.supabaseUrl === 'ready' && checks.publishableKey === 'ready' && checks.serviceRoleKey === 'ready' && checks.database === 'ready';
  res.setHeader('Cache-Control', 'private, no-store');
  return res.status(coreReady ? 200 : 503).json({ ok: coreReady, checks });
}
