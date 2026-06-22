// =====================================================
// PCMS - Mock JWT helper (HS256)
// Dùng cho BFF mock layer — sign/verify token ngay trong Next.js process.
// KHÔNG dùng cho production; chỉ để FE chạy độc lập khi chưa có backend.
// =====================================================

import crypto from 'crypto';

const SECRET =
  'pcms-jwt-secret-key-must-be-at-least-32-bytes-long-for-hs256-signing-2026';
const ALG = 'HS256';

export interface MockJwtPayload {
  sub: string; // userId
  email: string;
  role: string;
  branchId?: string;
  exp: number;
  iat: number;
}

function b64url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function b64urlDecode(s: string): Buffer {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Buffer.from(s, 'base64');
}

export function signMockJwt(
  payload: Omit<MockJwtPayload, 'iat' | 'exp'>,
  ttlSeconds = 3600
): string {
  const now = Math.floor(Date.now() / 1000);
  const full: MockJwtPayload = { ...payload, iat: now, exp: now + ttlSeconds };
  const header = b64url(Buffer.from(JSON.stringify({ alg: ALG, typ: 'JWT' })));
  const body = b64url(Buffer.from(JSON.stringify(full)));
  const sig = b64url(
    crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest()
  );
  return `${header}.${body}.${sig}`;
}

export function verifyMockJwt(token: string): MockJwtPayload | null {
  try {
    const [header, body, sig] = token.split('.');
    if (!header || !body || !sig) return null;
    const expectedSig = b64url(
      crypto.createHmac('sha256', SECRET).update(`${header}.${body}`).digest()
    );
    if (sig !== expectedSig) return null;
    const payload = JSON.parse(b64urlDecode(body).toString()) as MockJwtPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
