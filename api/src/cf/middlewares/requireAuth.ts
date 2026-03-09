import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../../index';
import { verifyJwt } from '../lib/security/jwt';

export const requireAuth = createMiddleware<Env>(async (c, next) => {
  const authorization = c.req.header('Authorization');
  const authTokenQuery = c.req.query('auth_token');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : authTokenQuery;

  if (!token) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  const payload = await verifyJwt(c.env.JWT_SECRET, token);

  c.set('userId', payload.sub);
  c.set('userEmail', payload.email);

  await next();
});
