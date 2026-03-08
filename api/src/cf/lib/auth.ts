import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { sign, verify } from 'hono/jwt';
import type { Env } from '../../index';

const encoder = new TextEncoder();

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string): Uint8Array {
  const raw = atob(value);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    bytes[i] = raw.charCodeAt(i);
  }
  return bytes;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 120_000;
  const saltBuffer = new ArrayBuffer(salt.length);
  new Uint8Array(saltBuffer).set(salt);

  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, [
    'deriveBits',
  ]);

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hash = new Uint8Array(bits);
  return `pbkdf2$${iterations}$${toBase64(salt)}$${toBase64(hash)}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [scheme, iterationsText, saltB64, hashB64] = storedHash.split('$');
  if (scheme !== 'pbkdf2' || !iterationsText || !saltB64 || !hashB64) {
    return false;
  }

  const iterations = Number(iterationsText);
  const salt = fromBase64(saltB64);
  const expected = fromBase64(hashB64);
  const saltBuffer = new ArrayBuffer(salt.length);
  new Uint8Array(saltBuffer).set(salt);

  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), { name: 'PBKDF2' }, false, [
    'deriveBits',
  ]);

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const actual = new Uint8Array(bits);
  if (actual.length !== expected.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < actual.length; i += 1) {
    mismatch |= actual[i] ^ expected[i];
  }

  return mismatch === 0;
}

export async function createJwt(secret: string, user: { id: string; email: string }): Promise<string> {
  return sign(
    {
      sub: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14,
    },
    secret
  );
}

export const requireAuth = createMiddleware<Env>(async (c, next) => {
  const authorization = c.req.header('Authorization');
  const authTokenQuery = c.req.query('auth_token');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : authTokenQuery;
  if (!token) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  const payload = await verify(token, c.env.JWT_SECRET, 'HS256');

  if (!payload?.sub || typeof payload.sub !== 'string') {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  c.set('userId', payload.sub);
  c.set('userEmail', typeof payload.email === 'string' ? payload.email : '');

  await next();
});
