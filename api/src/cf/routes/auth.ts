import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../../index';
import { createJwt, hashPassword, requireAuth, verifyPassword } from '../lib/auth';

export const authRoutes = new Hono<Env>({ strict: false });

authRoutes.post('/register', async (c) => {
  const payload = await c.req.json<{ email?: string; password?: string }>();
  const email = String(payload.email ?? '').trim().toLowerCase();
  const password = String(payload.password ?? '');

  if (!email || !password) {
    throw new HTTPException(422, { message: 'Email and password are required' });
  }

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
});

authRoutes.post('/login', async (c) => {
  const payload = await c.req.json<{ email?: string; password?: string }>();
  const email = String(payload.email ?? '').trim().toLowerCase();
  const password = String(payload.password ?? '');

  if (!email || !password) {
    throw new HTTPException(422, { message: 'Email and password are required' });
  }

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
});

authRoutes.get('/users/profile', requireAuth, async (c) => {
  return c.json({
    message: 'You made it to the secure route',
    user: { _id: c.get('userId'), email: c.get('userEmail') },
  });
});
