import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { GASTRO_EXPRESS_PRODUCT_CODE } from '@/lib/commerce/catalog';
import { consumeDownloadToken, previewDownloadToken, recordDownloadEvent } from '@/lib/commerce/store';

function privateProductPath(productCode: string) {
  if (productCode === GASTRO_EXPRESS_PRODUCT_CODE) return process.env.JOINHOOK_GASTRO_EXPRESS_PRIVATE_FILE?.trim() || '';
  return '';
}

function clientIp(req: NextApiRequest) {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0];
  return value?.trim() || req.socket.remoteAddress || '';
}

function privacyPreservingIpHash(req: NextApiRequest) {
  const salt = process.env.JOINHOOK_DOWNLOAD_IP_HASH_SALT?.trim();
  const ip = clientIp(req);
  if (!salt || !ip) return null;
  return crypto.createHmac('sha256', salt).update(ip).digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }
  const token = typeof req.query.token === 'string' ? req.query.token : '';
  if (token.length < 32 || token.length > 256) return res.status(404).end();

  let fd: number | null = null;
  try {
    // Preview first so an operational problem (missing/private artifact) does not
    // consume one of the customer's paid download uses.
    const preview = await previewDownloadToken(token);
    if (!preview) return res.status(410).json({ error: 'download_expired_or_exhausted' });

    const filePath = privateProductPath(preview.product_code);
    if (!filePath || !path.isAbsolute(filePath)) {
      console.error('[commerce/download] invalid private file configuration', preview.product_code);
      return res.status(503).json({ error: 'product_temporarily_unavailable' });
    }

    try {
      fd = fs.openSync(filePath, 'r');
    } catch {
      console.error('[commerce/download] private file missing or unreadable', preview.product_code);
      return res.status(503).json({ error: 'product_temporarily_unavailable' });
    }

    const stat = fs.fstatSync(fd);
    if (!stat.isFile()) {
      fs.closeSync(fd);
      fd = null;
      return res.status(503).json({ error: 'product_temporarily_unavailable' });
    }

    // Consume atomically only after the artifact has been opened successfully.
    const grant = await consumeDownloadToken(token);
    if (!grant) {
      fs.closeSync(fd);
      fd = null;
      return res.status(410).json({ error: 'download_expired_or_exhausted' });
    }

    const ipHash = privacyPreservingIpHash(req);
    void recordDownloadEvent({
      tokenId: grant.token_id,
      orderId: grant.order_id,
      userAgent: String(req.headers['user-agent'] || '').slice(0, 500),
      ipHash,
    }).catch((error) => console.error('[commerce/download] audit event failed', error));

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath).replace(/[^a-zA-Z0-9._-]/g, '_')}"`);
    res.setHeader('Content-Length', String(stat.size));
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Download-Remaining', String(Math.max(0, grant.remaining_uses)));

    const stream = fs.createReadStream(filePath, { fd, autoClose: true });
    fd = null; // ownership transferred to the stream
    stream.on('error', (error) => {
      console.error('[commerce/download] stream failed', error);
      if (!res.headersSent) res.status(500).end();
      else res.destroy(error as Error);
    });
    stream.pipe(res);
  } catch (error) {
    if (fd !== null) {
      try {
        fs.closeSync(fd);
      } catch {
        // no-op: original error is more useful
      }
    }
    console.error('[commerce/download]', error);
    if (!res.headersSent) return res.status(500).json({ error: 'download_failed' });
    res.destroy(error as Error);
  }
}
