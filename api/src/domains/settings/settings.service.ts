import { HTTPException } from "hono/http-exception";
import type { Env } from "../../index.types";
import { ensureSettings, upsertSettings } from "../../shared/lib/db";
import {
  hashPassword,
  verifyPassword,
} from "../../shared/lib/security/password";
import type { SettingsRecord } from "../../shared/lib/types.types";
import { asString } from "../../shared/utils/normalize";
import { uploadToR2 } from "../../shared/utils/upload";

export async function getSettings(db: D1Database) {
  return ensureSettings(db);
}

export async function updateSettings(
  env: Env["Bindings"],
  body: Record<string, unknown>,
) {
  const existing = await ensureSettings(env.DB);

  const leftImageFile = body.pdfImageLeft ?? body.logo;
  const rightImageFile = body.pdfImageRight;
  const signatureFile = body.currentPriestSignature;

  let pdfImageLeft = existing.pdfImageLeft;
  let pdfImageRight = existing.pdfImageRight;
  let currentPriestSignature = existing.currentPriestSignature;

  if (leftImageFile instanceof File && leftImageFile.size > 0) {
    pdfImageLeft = await uploadToR2(env, leftImageFile);
  }

  if (rightImageFile instanceof File && rightImageFile.size > 0) {
    pdfImageRight = await uploadToR2(env, rightImageFile);
  } else if (!pdfImageRight) {
    pdfImageRight = pdfImageLeft;
  }

  if (signatureFile instanceof File && signatureFile.size > 0) {
    currentPriestSignature = await uploadToR2(env, signatureFile);
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

  await upsertSettings(env.DB, nextSettings);
  return nextSettings;
}

export async function changeUserPassword(
  db: D1Database,
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await db
    .prepare("SELECT id, password_hash FROM users WHERE id = ?")
    .bind(userId)
    .first<{ id: string; password_hash: string }>();

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  const valid = await verifyPassword(currentPassword, user.password_hash);
  if (!valid) {
    throw new HTTPException(422, { message: "Current Password is incorrect." });
  }

  const nextHash = await hashPassword(newPassword);
  await db
    .prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?")
    .bind(nextHash, new Date().toISOString(), user.id)
    .run();
}
