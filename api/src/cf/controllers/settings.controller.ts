import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { Env } from '../../index';
import { ensureSettings, upsertSettings } from '../lib/db';
import { verifyPassword, hashPassword } from '../lib/security/password';
import type { SettingsRecord } from '../lib/types';
import { asString } from '../utils/normalize';
import { uploadToR2 } from '../utils/upload';
import { getValidatedFormData, getValidatedJson } from '../middlewares/validate';
import { changePasswordSchema, settingsFormSchema } from '../validators/settings.schema';

export async function getSettingsController(c: Context<Env>) {
  const settings = await ensureSettings(c.env.DB);
  return c.json(settings);
}

export async function updateSettingsController(c: Context<Env>) {
  const body = getValidatedFormData<typeof settingsFormSchema>(c);
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
    headerLine1: asString(body.headerLine1, existing.headerLine1),
    headerLine2: asString(body.headerLine2, existing.headerLine2),
    headerLine3: asString(body.headerLine3, existing.headerLine3),
    headerLine4: asString(body.headerLine4, existing.headerLine4),
    headerLine5: asString(body.headerLine5, existing.headerLine5),
    headerLine6: asString(body.headerLine6, existing.headerLine6),
    currentPriest: asString(body.currentPriest, existing.currentPriest),
    pdfImageLeft,
    pdfImageRight,
    currentPriestSignature,
  };

  await upsertSettings(c.env.DB, nextSettings);
  return c.json(nextSettings);
}

export async function changePasswordController(c: Context<Env>) {
  const payload = getValidatedJson<typeof changePasswordSchema>(c);
  const currentPassword = payload.currentPassword;
  const newPassword = payload.newPassword;

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
}
