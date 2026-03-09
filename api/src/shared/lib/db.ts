import type { SettingsRecord } from "./types.types";
import { DEFAULT_SETTINGS } from "./constants";
import { asTrimmedString } from "../utils/normalize";

const LEGACY_ASSET_PATHS = new Set(["/logo.png", "/signature.png"]);

function normalizeAssetPath(value: string | null | undefined): string {
  const trimmed = asTrimmedString(value);
  if (!trimmed || LEGACY_ASSET_PATHS.has(trimmed)) {
    return "";
  }
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("/upload/file/")) {
    return trimmed;
  }
  if (!trimmed.startsWith("/")) {
    return `/upload/file/${trimmed}`;
  }
  return trimmed;
}

export async function ensureSettings(db: D1Database): Promise<SettingsRecord> {
  const existing = await db
    .prepare(
      `SELECT
        header_line_1,
        header_line_2,
        header_line_3,
        header_line_4,
        header_line_5,
        header_line_6,
        current_priest,
        current_priest_signature,
        logo,
        pdf_image_left,
        pdf_image_right
      FROM settings WHERE id = 1`,
    )
    .first<{
      header_line_1: string;
      header_line_2: string;
      header_line_3: string;
      header_line_4: string;
      header_line_5: string;
      header_line_6: string;
      current_priest: string;
      current_priest_signature: string;
      logo: string;
      pdf_image_left: string;
      pdf_image_right: string;
    }>();

  if (!existing) {
    await db
      .prepare(
        `INSERT INTO settings (
          id,
          header_line_1,
          header_line_2,
          header_line_3,
          header_line_4,
          header_line_5,
          header_line_6,
          current_priest,
          current_priest_signature,
          logo,
          pdf_image_left,
          pdf_image_right,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      )
      .bind(
        1,
        DEFAULT_SETTINGS.headerLine1,
        DEFAULT_SETTINGS.headerLine2,
        DEFAULT_SETTINGS.headerLine3,
        DEFAULT_SETTINGS.headerLine4,
        DEFAULT_SETTINGS.headerLine5,
        DEFAULT_SETTINGS.headerLine6,
        DEFAULT_SETTINGS.currentPriest,
        DEFAULT_SETTINGS.currentPriestSignature,
        DEFAULT_SETTINGS.pdfImageLeft,
        DEFAULT_SETTINGS.pdfImageLeft,
        DEFAULT_SETTINGS.pdfImageRight,
      )
      .run();

    return DEFAULT_SETTINGS;
  }

  const normalizedLegacyLogo = normalizeAssetPath(existing.logo);
  const normalizedLeft =
    normalizeAssetPath(existing.pdf_image_left) || normalizedLegacyLogo;
  const normalizedRight =
    normalizeAssetPath(existing.pdf_image_right) || normalizedLeft;
  const normalizedSignature = normalizeAssetPath(
    existing.current_priest_signature,
  );

  if (
    normalizedLegacyLogo !== existing.logo ||
    normalizedLeft !== existing.pdf_image_left ||
    normalizedRight !== existing.pdf_image_right ||
    normalizedSignature !== existing.current_priest_signature
  ) {
    await db
      .prepare(
        `UPDATE settings
         SET logo = ?, pdf_image_left = ?, pdf_image_right = ?, current_priest_signature = ?, updated_at = datetime('now')
         WHERE id = 1`,
      )
      .bind(
        normalizedLeft,
        normalizedLeft,
        normalizedRight,
        normalizedSignature,
      )
      .run();
  }

  return {
    headerLine1: existing.header_line_1,
    headerLine2: existing.header_line_2,
    headerLine3: existing.header_line_3,
    headerLine4: existing.header_line_4,
    headerLine5: existing.header_line_5,
    headerLine6: existing.header_line_6,
    currentPriest: existing.current_priest,
    currentPriestSignature: normalizedSignature,
    pdfImageLeft: normalizedLeft,
    pdfImageRight: normalizedRight,
  };
}

export async function upsertSettings(
  db: D1Database,
  next: SettingsRecord,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO settings (
        id,
        header_line_1,
        header_line_2,
        header_line_3,
        header_line_4,
        header_line_5,
        header_line_6,
        current_priest,
        current_priest_signature,
        logo,
        pdf_image_left,
        pdf_image_right,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        header_line_1 = excluded.header_line_1,
        header_line_2 = excluded.header_line_2,
        header_line_3 = excluded.header_line_3,
        header_line_4 = excluded.header_line_4,
        header_line_5 = excluded.header_line_5,
        header_line_6 = excluded.header_line_6,
        current_priest = excluded.current_priest,
        current_priest_signature = excluded.current_priest_signature,
        logo = excluded.logo,
        pdf_image_left = excluded.pdf_image_left,
        pdf_image_right = excluded.pdf_image_right,
        updated_at = datetime('now')`,
    )
    .bind(
      1,
      next.headerLine1,
      next.headerLine2,
      next.headerLine3,
      next.headerLine4,
      next.headerLine5,
      next.headerLine6,
      next.currentPriest,
      next.currentPriestSignature,
      next.pdfImageLeft,
      next.pdfImageLeft,
      next.pdfImageRight,
    )
    .run();
}
