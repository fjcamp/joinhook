import crypto from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

const COOKIE_NAME = 'joinhook_agent_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

type SessionPayload = {
  sub: 'owner';
  exp: number;
  iat: number;
};

function secret(): string {
  const value = process.env.JOINHOOK_PANEL_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error('JOINHOOK_PANEL_SESSION_SECRET must contain at least 32 characters');
  }
  return value;
}

function sign(value: string): string {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

function safeEqual(left: string, right: string): boolean {
  const leftBytes = Uint8Array.from(Buffer.from(left));
  const rightBytes = Uint8Array.from(Buffer.from(right));
  return leftBytes.byteLength === rightBytes.byteLength && crypto.timingSafeEqual(leftBytes, rightBytes);
}

export function validateOwnerAccessKey(value: unknown): boolean {
  const expected = process.env.JOINHOOK_OWNER_ACCESS_KEY;
  if (!expected || expected.length < 16 || typeof value !== 'string') return false;
  return safeEqual(value, expected);
}

export function createOwnerSessionCookie(): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = { sub: 'owner', iat: now, exp: now + SESSION_TTL_SECONDS };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const token = `${encoded}.${sign(encoded)}`;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function clearOwnerSessionCookie(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

function readCookie(req: NextApiRequest, name: string): string | undefined {
  const cookies = req.headers.cookie ?? '';
  for (const item of cookies.split(';')) {
    const [key, ...rest] = item.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return undefined;
}

export function isOwnerSessionValid(req: NextApiRequest): boolean {
  try {
    const token = readCookie(req, COOKIE_NAME);
    if (!token) return false;
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature || !safeEqual(sign(encoded), signature)) return false;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    const now = Math.floor(Date.now() / 1000);
    return payload.sub === 'owner' && Number.isFinite(payload.exp) && payload.exp > now;
  } catch {
    return false;
  }
}

export function requireOwnerSession(req: NextApiRequest, res: NextApiResponse): boolean {
  if (isOwnerSessionValid(req)) return true;
  res.status(401).json({ error: 'owner_session_required' });
  return false;
}
