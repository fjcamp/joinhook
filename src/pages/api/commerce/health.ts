import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Public liveness only. Dependency/configuration detail belongs in the private
 * JoinHook Control Plane and must not be exposed as reconnaissance data.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    service: 'joinhook-commerce',
    status: 'available',
  });
}
