import type { D1Database } from "@cloudflare/workers-types";
import { asNumber } from "../../shared/utils/normalize";
import {
  type CountRow,
  type InstallStatus,
  type SystemSettingRow,
} from "./install.service.types";

async function ensureSystemSettingsTable(db: D1Database) {
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

async function getInstalledFlag(db: D1Database): Promise<boolean> {
  const row = await db
    .prepare(
      "SELECT value FROM system_settings WHERE key = 'installed' LIMIT 1",
    )
    .first<SystemSettingRow>();
  return (
    String(row?.value ?? "")
      .trim()
      .toLowerCase() === "true"
  );
}

export async function getInstallStatus(db: D1Database): Promise<InstallStatus> {
  await ensureSystemSettingsTable(db);
  const [usersCountRow, settingsCountRow] = await Promise.all([
    db.prepare("SELECT COUNT(*) AS total FROM users").first<CountRow>(),
    db.prepare("SELECT COUNT(*) AS total FROM settings").first<CountRow>(),
  ]);

  const usersCount = asNumber(usersCountRow?.total, 0);
  const settingsCount = asNumber(settingsCountRow?.total, 0);
  const isInstalled = await getInstalledFlag(db);

  const isCleanInstall = usersCount === 0 && settingsCount === 0;

  return {
    isCleanInstall,
    requiresWizard: isCleanInstall,
    isInstalled,
    usersCount,
    settingsCount,
  };
}

export async function markSystemInstalled(db: D1Database) {
  await ensureSystemSettingsTable(db);
  const now = new Date().toISOString();
  await db
    .prepare(
      `INSERT INTO system_settings (key, value, created_at, updated_at)
       VALUES ('installed', 'true', ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         value = 'true',
         updated_at = excluded.updated_at`,
    )
    .bind(now, now)
    .run();
}
