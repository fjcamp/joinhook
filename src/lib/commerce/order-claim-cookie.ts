const CLAIM_COOKIE_PREFIX = 'jh_purchase_';
const CLAIM_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function orderClaimCookieName(orderCode: string) {
  const safe = orderCode.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${CLAIM_COOKIE_PREFIX}${safe}`;
}

export function serializeOrderClaimCookie(orderCode: string, claimToken: string) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${orderClaimCookieName(orderCode)}=${encodeURIComponent(claimToken)}; Path=/api/commerce; HttpOnly; SameSite=Lax; Max-Age=${CLAIM_MAX_AGE_SECONDS}${secure}`;
}

function parseCookies(header?: string) {
  const cookies = new Map<string, string>();
  for (const part of (header || '').split(';')) {
    const index = part.indexOf('=');
    if (index <= 0) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (!key) continue;
    try {
      cookies.set(key, decodeURIComponent(value));
    } catch {
      // Ignore malformed cookies instead of failing purchase verification.
    }
  }
  return cookies;
}

export function readOrderClaimCookie(cookieHeader: string | undefined, orderCode: string) {
  return parseCookies(cookieHeader).get(orderClaimCookieName(orderCode)) || '';
}
