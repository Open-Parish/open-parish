import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../../index';
import { getValidatedFormData } from '../middlewares/validate';
import { uploadToR2 } from '../utils/upload';
import { uploadFileSchema } from '../validators/uploads.schema';

export async function getUploadFileController(c: Context<Env>) {
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
}

export async function uploadFileController(c: Context<Env>) {
  const payload = getValidatedFormData<typeof uploadFileSchema>(c);
  const file = payload.file;
  const url = await uploadToR2(c.env, file);

  return c.json({
    key: url.replace(/^\/upload\/file\//, ''),
    url,
    size: file.size,
    type: file.type,
    originalName: file.name,
  });
}
