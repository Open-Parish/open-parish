import type { D1Database } from "@cloudflare/workers-types";
import { upsertSettings } from "../../shared/lib/db";
import { hashPassword } from "../../shared/lib/security/password";
import {
  asNumber,
  asTrimmedLowercase,
  asTrimmedString,
} from "../../shared/utils/normalize";
import {
  type CountRow,
  type InstallBootstrapInput,
  type InstallSeedSampleData,
  type InstallStatus,
  type SystemSettingRow,
} from "./install.service.types";
import seedSampleDataJson from "./install.seed-sample.json";

const seedSampleData = seedSampleDataJson as InstallSeedSampleData;

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

async function getSystemBooleanSetting(
  db: D1Database,
  key: string,
): Promise<boolean> {
  const row = await db
    .prepare("SELECT value FROM system_settings WHERE key = ? LIMIT 1")
    .bind(key)
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
  const [isInstalled, sampleData, seedSample] = await Promise.all([
    getSystemBooleanSetting(db, "installed"),
    getSystemBooleanSetting(db, "sample_data"),
    getSystemBooleanSetting(db, "seed_sample"),
  ]);

  const isCleanInstall = usersCount === 0 && settingsCount === 0;

  return {
    isCleanInstall,
    requiresWizard: isCleanInstall,
    isInstalled,
    sampleData,
    seedSample,
    usersCount,
    settingsCount,
  };
}

async function setSystemBooleanSetting(
  db: D1Database,
  key: string,
  value: boolean,
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
    .bind(key, value ? "true" : "false", now, now)
    .run();
}

export async function markSystemInstalled(
  db: D1Database,
  sampleData = false,
  seedSample = false,
) {
  await Promise.all([
    setSystemBooleanSetting(db, "installed", true),
    setSystemBooleanSetting(db, "sample_data", sampleData),
    setSystemBooleanSetting(db, "seed_sample", seedSample),
  ]);
}

async function seedSampleCertificates(db: D1Database, userId: string) {
  const now = new Date().toISOString();
  const insertBirth = db.prepare(
    `INSERT INTO births (
      id, firstName, lastName, certificateType, address, parent1, parent2,
      celebrantPriest, sponsor1, sponsor2, birthDate, occasionDate,
      bookNumber, pageNumber, user, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertDeath = db.prepare(
    `INSERT INTO deaths (
      id, firstName, lastName, address, age, survivors, burialDate,
      deathDate, burialPlace, sacraments, celebrantPriest,
      bookNumber, pageNumber, user, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertMarriage = db.prepare(
    `INSERT INTO marriages (
      id, bride, groom, sponsor1, sponsor2, licenseNumber, registryNumber, remarks,
      occasionDate, celebrantPriest, bookNumber, pageNumber, user, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  for (const row of seedSampleData.baptismal) {
    await insertBirth
      .bind(
        crypto.randomUUID(),
        row.firstName,
        row.lastName,
        "baptismal",
        row.address,
        JSON.stringify({
          firstName: row.parent1FirstName,
          lastName: row.parent1LastName,
        }),
        row.parent2FirstName
          ? JSON.stringify({
              firstName: row.parent2FirstName,
              lastName: row.parent2LastName ?? "",
            })
          : null,
        JSON.stringify(row.celebrant),
        JSON.stringify({
          firstName: row.sponsor1FirstName,
          lastName: row.sponsor1LastName,
        }),
        row.sponsor2FirstName
          ? JSON.stringify({
              firstName: row.sponsor2FirstName,
              lastName: row.sponsor2LastName ?? "",
            })
          : null,
        row.birthDate,
        row.occasionDate,
        row.bookNumber,
        row.pageNumber,
        userId,
        now,
        now,
      )
      .run();
  }

  for (const row of seedSampleData.confirmation) {
    await insertBirth
      .bind(
        crypto.randomUUID(),
        row.firstName,
        row.lastName,
        "confirmation",
        row.address,
        JSON.stringify({
          firstName: row.parent1FirstName,
          lastName: row.parent1LastName,
        }),
        row.parent2FirstName
          ? JSON.stringify({
              firstName: row.parent2FirstName,
              lastName: row.parent2LastName ?? "",
            })
          : null,
        JSON.stringify(row.celebrant),
        JSON.stringify({
          firstName: row.sponsor1FirstName,
          lastName: row.sponsor1LastName,
        }),
        row.sponsor2FirstName
          ? JSON.stringify({
              firstName: row.sponsor2FirstName,
              lastName: row.sponsor2LastName ?? "",
            })
          : null,
        row.birthDate,
        row.occasionDate,
        row.bookNumber,
        row.pageNumber,
        userId,
        now,
        now,
      )
      .run();
  }

  for (const row of seedSampleData.deaths) {
    await insertDeath
      .bind(
        crypto.randomUUID(),
        row.firstName,
        row.lastName,
        row.address,
        row.age,
        JSON.stringify({ spouse: row.spouseName }),
        row.burialDate,
        row.deathDate,
        row.burialPlace,
        row.sacraments,
        JSON.stringify(row.celebrant),
        row.bookNumber,
        row.pageNumber,
        userId,
        now,
        now,
      )
      .run();
  }

  for (const row of seedSampleData.marriages) {
    await insertMarriage
      .bind(
        crypto.randomUUID(),
        JSON.stringify({
          firstName: row.brideFirstName,
          lastName: row.brideLastName,
        }),
        JSON.stringify({
          firstName: row.groomFirstName,
          lastName: row.groomLastName,
        }),
        JSON.stringify({
          firstName: row.sponsor1FirstName,
          lastName: row.sponsor1LastName,
        }),
        JSON.stringify({
          firstName: row.sponsor2FirstName,
          lastName: row.sponsor2LastName,
        }),
        row.licenseNumber,
        row.registryNumber,
        row.remarks,
        row.occasionDate,
        JSON.stringify(row.celebrant),
        row.bookNumber,
        row.pageNumber,
        userId,
        now,
        now,
      )
      .run();
  }
}

export async function bootstrapInstall(
  db: D1Database,
  payload: InstallBootstrapInput,
) {
  const now = new Date().toISOString();
  const userId = crypto.randomUUID();
  const email = asTrimmedLowercase(payload.user.email);
  const passwordHash = await hashPassword(payload.user.password);

  await db
    .prepare(
      `INSERT INTO users (id, email, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(userId, email, passwordHash, now, now)
    .run();

  await upsertSettings(db, {
    parishName: asTrimmedString(payload.settings.parishName),
    headerLine1: asTrimmedString(payload.settings.headerLine1),
    headerLine2: asTrimmedString(payload.settings.headerLine2),
    headerLine3: asTrimmedString(payload.settings.headerLine3),
    headerLine4: asTrimmedString(payload.settings.headerLine4),
    headerLine5: asTrimmedString(payload.settings.headerLine5),
    headerLine6: asTrimmedString(payload.settings.headerLine6),
    currentPriest: asTrimmedString(payload.settings.currentPriest),
    currentPriestSignature: asTrimmedString(
      payload.settings.currentPriestSignature,
    ),
    pdfImageLeft: asTrimmedString(payload.settings.pdfImageLeft),
    pdfImageRight: asTrimmedString(payload.settings.pdfImageRight),
  });

  if (payload.seedSample) {
    await seedSampleCertificates(db, userId);
  }

  await markSystemInstalled(db, payload.sampleData, payload.seedSample);

  return {
    message: "Install bootstrap completed",
    user: { id: userId, email },
  };
}
