import crypto from 'node:crypto';

function safeEqualHex(left: string, right: string) {
  try {
    const a = Buffer.from(left, 'hex');
    const b = Buffer.from(right, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function validateMercadoPagoWebhookSignature(input: {
  xSignature?: string | string[];
  xRequestId?: string | string[];
  dataId?: string | string[];
  secret: string;
}) {
  const signature = Array.isArray(input.xSignature) ? input.xSignature[0] : input.xSignature;
  const requestId = Array.isArray(input.xRequestId) ? input.xRequestId[0] : input.xRequestId;
  const dataId = Array.isArray(input.dataId) ? input.dataId[0] : input.dataId;
  if (!signature || !requestId || !dataId || !input.secret) return false;

  const parts = Object.fromEntries(
    signature.split(',').map((part) => {
      const [key, value] = part.trim().split('=');
      return [key, value];
    }),
  );
  const ts = parts.ts;
  const received = parts.v1;
  if (!ts || !received) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto.createHmac('sha256', input.secret).update(manifest).digest('hex');
  return safeEqualHex(expected, received);
}
