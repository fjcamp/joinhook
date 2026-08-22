import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { GASTRO_EXPRESS_PRODUCT_CODE } from '@/lib/commerce/catalog';
import { consumeDownloadToken, recordDownloadEvent } from '@/lib/commerce/store';

function privateProductPath(productCode: string) {
  if (productCode === GASTRO_EXPRESS_PRODUCT_CODE) return process.env.JOINHOOK_GASTRO_EXPRESS_PRIVATE_FILE?.trim() || '';
  return '';
}

function clientIp(req: NextApiRequest) {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return value?.trim() || req.socket.remoteAddress || '';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  const token = typeof req.query.token === 'string' ? req.query.token : '';
  if (token.length < 32 || token.length > 256) return res.status(404).end();

  try {
    const grant = await consumeDownloadToken(token);
    if (!grant) return res.status(410).json({ error: 'download_expired_or_exhausted' });

    const filePath = privateProductPath(grant.product_code);
    if (!filePath || !path.isAbsolute(filePath) || !fs.existsSync(filePath)) {
      console.error('[commerce/download] private file missing', grant.product_code);
      return res.status(503).json({ error: 'product_temporarily_unavailable' });
    }

    const ipSalt = process.env.JOINHOOK_DOWNLOAD_IP_HASH_SALT || 'joinhook';
    const ipHash = crypto.createHash('sha256').update(`${ipSalt}:${clientIp(req)}`).digest('hex');
    await recordDownloadEvent({
      tokenId: grant.token_id,
      orderId: grant.order_id,
      userAgent: String(req.headers['user-agent'] || '').slice(0, 500),
      ipHash,
    });

    const stat = fs.statSync(filePath);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath).replace(/[^a-zA-Z0-9._-]/g, '_')}"`);
    res.setHeader('Content-Length', String(stat.size));
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error('[commerce/download]', error);
    return res.status(500).json({ error: 'download_failed' });
  }
}
