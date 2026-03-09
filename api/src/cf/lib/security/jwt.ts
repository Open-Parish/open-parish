import { SignJWT, jwtVerify } from 'jose';
import { HTTPException } from 'hono/http-exception';

const encoder = new TextEncoder();

export async function createJwt(secret: string, user: { id: string; email: string }): Promise<string> {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setExpirationTime('14d')
    .sign(encoder.encode(secret));
}

export async function verifyJwt(secret: string, token: string): Promise<{ sub: string; email: string }> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret), {
      algorithms: ['HS256'],
    });

    if (!payload.sub || typeof payload.sub !== 'string') {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    return {
      sub: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : '',
    };
  } catch {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }
}
