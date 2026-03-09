import type { D1Database } from "@cloudflare/workers-types";
import { asNumber } from "../../shared/utils/normalize";
import type { CountRow } from "./install.service.types";

export async function getInstallStatus(db: D1Database) {
  const [usersCountRow, settingsCountRow] = await Promise.all([
    db.prepare("SELECT COUNT(*) AS total FROM users").first<CountRow>(),
    db.prepare("SELECT COUNT(*) AS total FROM settings").first<CountRow>(),
  ]);

  const usersCount = asNumber(usersCountRow?.total, 0);
  const settingsCount = asNumber(settingsCountRow?.total, 0);

  const isCleanInstall = usersCount === 0 && settingsCount === 0;

  return {
    isCleanInstall,
    requiresWizard: isCleanInstall,
    usersCount,
    settingsCount,
  };
}
