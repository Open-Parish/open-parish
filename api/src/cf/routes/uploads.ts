import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../../index';
import { requireAuth } from '../lib/auth';

const router = new Hono<Env>({ strict: false });

router.get('/upload/file/*', async (c) => {
  const prefix = '/upload/file/';
  const path = new URL(c.req.url).pathname;
  const key = decodeURIComponent(path.startsWith(prefix) ? path.slice(prefix.length) : '');
  if (!key) {
    throw new HTTPException(404, { message: 'File not found' });
  }

  const object = await c.env.UPLOADS.get(key);
  if (!object) {
    throw new HTTPException(404, { message: 'File not found' });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  return new Response(object.body, { headers });
});

router.use('/upload', requireAuth);

router.post('/upload', async (c) => {
  const body = await c.req.parseBody();
  const file = body.file;

  if (!(file instanceof File) || file.size === 0) {
    throw new HTTPException(422, { message: 'File is required' });
  }

  const extension = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')).toLowerCase() : '';
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}${extension}`;

  await c.env.UPLOADS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });

  const url = c.env.R2_PUBLIC_URL ? `${c.env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}` : `/upload/file/${key}`;

  return c.json({
    key,
    url,
    size: file.size,
    type: file.type,
    originalName: file.name,
  });
});

export const uploadRoutes = router;
