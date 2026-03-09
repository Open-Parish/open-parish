import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../../index';
import { createJwt } from '../lib/security/jwt';
import { hashPassword, verifyPassword } from '../lib/security/password';
import { asTrimmedLowercase } from '../utils/normalize';
import { getValidatedJson } from '../middlewares/validate';
import { authSchema } from '../validators/auth.schema';

export async function registerController(c: Context<Env>) {
  const payload = getValidatedJson<typeof authSchema>(c);
  const email = asTrimmedLowercase(payload.email);
  const password = payload.password;

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  try {
    await c.env.DB.prepare(
      'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(id, email, passwordHash, now, now)
      .run();
  } catch {
    throw new HTTPException(422, { message: 'User already exists' });
  }

  const token = await createJwt(c.env.JWT_SECRET, { id, email });
  return c.json({ token, user: { _id: id, email } });
}

export async function loginController(c: Context<Env>) {
  const payload = getValidatedJson<typeof authSchema>(c);
  const email = asTrimmedLowercase(payload.email);
  const password = payload.password;

  const user = await c.env.DB.prepare('SELECT id, email, password_hash FROM users WHERE email = ?').bind(email).first<{
    id: string;
    email: string;
    password_hash: string;
  }>();

  if (!user) {
    throw new HTTPException(422, { message: 'Invalid credentials' });
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    throw new HTTPException(422, { message: 'Invalid credentials' });
  }

  const token = await createJwt(c.env.JWT_SECRET, { id: user.id, email: user.email });
  return c.json({ token, user: { _id: user.id, email: user.email } });
}

export async function profileController(c: Context<Env>) {
  return c.json({
    message: 'You made it to the secure route',
    user: { _id: c.get('userId'), email: c.get('userEmail') },
  });
}
