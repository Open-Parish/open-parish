import type { D1Database } from "@cloudflare/workers-types";
import type { SystemSettingRow } from "./systemSettings.types";

export async function ensureSystemSettingsTable(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
    )
    .run();
}

export async function getSystemSetting(
  db: D1Database,
  key: string,
): Promise<string> {
  await ensureSystemSettingsTable(db);
  const row = await db
    .prepare("SELECT value FROM system_settings WHERE key = ? LIMIT 1")
    .bind(key)
    .first<SystemSettingRow>();
  return String(row?.value ?? "");
}

export async function setSystemSetting(
  db: D1Database,
  key: string,
  value: string,
) {
  await ensureSystemSettingsTable(db);
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO system_settings (key, value, created_at, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         value = excluded.value,
         updated_at = excluded.updated_at`,
    )
    .bind(key, value, now, now)
    .run();
}

export async function getSystemBooleanSetting(
  db: D1Database,
  key: string,
): Promise<boolean> {
  return (await getSystemSetting(db, key)).trim().toLowerCase() === "true";
}

export async function setSystemBooleanSetting(
  db: D1Database,
  key: string,
  value: boolean,
) {
  await setSystemSetting(db, key, value ? "true" : "false");
}
