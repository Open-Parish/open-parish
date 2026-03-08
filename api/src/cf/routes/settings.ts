import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../../index';
import { hashPassword, requireAuth, verifyPassword } from '../lib/auth';
import { ensureSettings, upsertSettings } from '../lib/db';
import type { SettingsRecord } from '../lib/types';

const router = new Hono<Env>({ strict: false });

async function uploadToR2(env: Env['Bindings'], file: File): Promise<string> {
  const extension = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')).toLowerCase() : '';
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}${extension}`;

  await env.UPLOADS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });

  if (env.R2_PUBLIC_URL) {
    return `${env.R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
  }

  return `/upload/file/${key}`;
}

router.use('/settings*', requireAuth);

router.get('/settings', async (c) => {
  const settings = await ensureSettings(c.env.DB);
  return c.json(settings);
});

router.post('/settings', async (c) => {
  const body = await c.req.parseBody();
  const existing = await ensureSettings(c.env.DB);

  const leftImageFile = body.pdfImageLeft ?? body.logo;
  const rightImageFile = body.pdfImageRight;
  const signatureFile = body.currentPriestSignature;

  let pdfImageLeft = existing.pdfImageLeft;
  let pdfImageRight = existing.pdfImageRight;
  let currentPriestSignature = existing.currentPriestSignature;

  if (leftImageFile instanceof File && leftImageFile.size > 0) {
    pdfImageLeft = await uploadToR2(c.env, leftImageFile);
  }

  if (rightImageFile instanceof File && rightImageFile.size > 0) {
    pdfImageRight = await uploadToR2(c.env, rightImageFile);
  } else if (!pdfImageRight) {
    pdfImageRight = pdfImageLeft;
  }

  if (signatureFile instanceof File && signatureFile.size > 0) {
    currentPriestSignature = await uploadToR2(c.env, signatureFile);
  }

  const nextSettings: SettingsRecord = {
    headerLine1: String(body.headerLine1 ?? existing.headerLine1),
    headerLine2: String(body.headerLine2 ?? existing.headerLine2),
    headerLine3: String(body.headerLine3 ?? existing.headerLine3),
    headerLine4: String(body.headerLine4 ?? existing.headerLine4),
    headerLine5: String(body.headerLine5 ?? existing.headerLine5),
    headerLine6: String(body.headerLine6 ?? existing.headerLine6),
    currentPriest: String(body.currentPriest ?? existing.currentPriest),
    pdfImageLeft,
    pdfImageRight,
    currentPriestSignature,
  };

  await upsertSettings(c.env.DB, nextSettings);
  return c.json(nextSettings);
});

router.post('/settings/change-password', async (c) => {
  const payload = await c.req.json<{ currentPassword?: string; newPassword?: string }>();
  const currentPassword = String(payload.currentPassword ?? '');
  const newPassword = String(payload.newPassword ?? '');

  if (!currentPassword || !newPassword) {
    throw new HTTPException(422, { message: 'Both currentPassword and newPassword are required' });
  }

  const userId = c.get('userId');

  const user = await c.env.DB.prepare('SELECT id, password_hash FROM users WHERE id = ?').bind(userId).first<{
    id: string;
    password_hash: string;
  }>();

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  const valid = await verifyPassword(currentPassword, user.password_hash);
  if (!valid) {
    throw new HTTPException(422, { message: 'Current Password is incorrect.' });
  }

  const nextHash = await hashPassword(newPassword);
  await c.env.DB.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
    .bind(nextHash, new Date().toISOString(), user.id)
    .run();

  return c.json({ message: true });
});

export const settingsRoutes = router;
