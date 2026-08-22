import crypto from 'node:crypto';

function safeEqual(left: string, right: string) {
  if (!left || !right || left.length !== right.length) return false;
  const encoder = new TextEncoder();
  return crypto.timingSafeEqual(encoder.encode(left), encoder.encode(right));
}

export function bearerTokenFromHeader(value?: string | string[]) {
  const header = Array.isArray(value) ? value[0] : value;
  if (!header) return '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || '';
}

export function authorizeControlPlaneBearer(header: string | string[] | undefined, expectedToken: string) {
  return safeEqual(bearerTokenFromHeader(header), expectedToken);
}
