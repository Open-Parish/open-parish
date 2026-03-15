import type { D1Database } from "@cloudflare/workers-types";
import type { Env } from "../../index.types";
import seedSampleDataJson from "../seeds/dev-seed-sample-data.json";
import devSeedSettingsJson from "../seeds/dev-seed-settings.json";
import { upsertSettings } from "./db";
import { ensureCoreSchema } from "./ensureCoreSchema";
import { hashPassword } from "./security/password";
import { setSystemBooleanSetting } from "./systemSettings";
import { asTrimmedLowercase } from "../utils/normalize";
import type { SettingsRecord } from "./types.types";

type SeedBirthRecord = {
  firstName: string;
  lastName: string;
  address: string;
  parent1FirstName: string;
  parent1LastName: string;
  parent2FirstName?: string;
  parent2LastName?: string;
  sponsor1FirstName: string;
  sponsor1LastName: string;
  sponsor2FirstName?: string;
  sponsor2LastName?: string;
  celebrant: {
    firstName: string;
    lastName: string;
  };
  birthDate: string;
  occasionDate: string;
  bookNumber: number;
  pageNumber: number;
};

type SeedConfirmationRecord = {
  firstName: string;
  lastName: string;
  address: string;
  parent1FirstName: string;
  parent1LastName: string;
  parent2FirstName?: string;
  parent2LastName?: string;
  celebrant: {
    firstName: string;
    lastName: string;
  };
  sponsor1FirstName: string;
  sponsor1LastName: string;
  sponsor2FirstName?: string;
  sponsor2LastName?: string;
  birthDate: string;
  occasionDate: string;
  bookNumber: number;
  pageNumber: number;
};

type SeedDeathRecord = {
  firstName: string;
  lastName: string;
  address: string;
  age: string;
  spouseName: string;
  burialDate: string;
  deathDate: string;
  burialPlace: string;
  sacraments: string;
  celebrant: {
    firstName: string;
    lastName: string;
  };
  bookNumber: number;
  pageNumber: number;
};

type SeedMarriageRecord = {
  brideFirstName: string;
  brideLastName: string;
  groomFirstName: string;
  groomLastName: string;
  sponsor1FirstName: string;
  sponsor1LastName: string;
  sponsor2FirstName: string;
  sponsor2LastName: string;
  licenseNumber: string;
  registryNumber: string;
  remarks: string;
  occasionDate: string;
  celebrant: {
    firstName: string;
    lastName: string;
  };
  bookNumber: number;
  pageNumber: number;
};

type InstallSeedSampleData = {
  baptismal: SeedBirthRecord[];
  confirmation: SeedConfirmationRecord[];
  deaths: SeedDeathRecord[];
  marriages: SeedMarriageRecord[];
};

const seedSampleData = seedSampleDataJson as InstallSeedSampleData;
const devSeedSettings = devSeedSettingsJson as SettingsRecord;

let ensureDevSeedPromise: Promise<void> | null = null;

function isProductionEnv(env: Env["Bindings"]): boolean {
  const nodeEnv = String(env.NODE_ENV ?? env.APP_ENV ?? "")
    .trim()
    .toLowerCase();
  return nodeEnv === "production";
}

function shouldSeedSampleData(env: Env["Bindings"]): boolean {
  return String(env.SEED_SAMPLE_DATA ?? "true").trim().toLowerCase() !== "false";
}

function buildSeedSettings(): SettingsRecord {
  return { ...devSeedSettings };
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

async function runEnsureDevSeed(env: Env["Bindings"]) {
  if (isProductionEnv(env)) {
    return;
  }

  const email = asTrimmedLowercase(env.DEFAULT_ADMIN_EMAIL);
  const password = String(env.DEFAULT_ADMIN_PASSWORD ?? "").trim();

  if (!email || !password) {
    return;
  }

  await ensureCoreSchema(env.DB);

  const existingUser = await env.DB
    .prepare("SELECT id FROM users ORDER BY created_at ASC LIMIT 1")
    .first<{ id: string }>();
  const existingSettings = await env.DB
    .prepare("SELECT id FROM settings WHERE id = 1")
    .first<{ id: number }>();
  const existingCertificateCounts = await env.DB
    .prepare(
      `SELECT
        (SELECT COUNT(*) FROM births) AS births,
        (SELECT COUNT(*) FROM deaths) AS deaths,
        (SELECT COUNT(*) FROM marriages) AS marriages`,
    )
    .first<{ births: number; deaths: number; marriages: number }>();

  let userId = existingUser?.id ?? "";

  if (!existingUser) {
    const now = new Date().toISOString();
    userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    await env.DB
      .prepare(
        `INSERT INTO users (id, email, password_hash, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(userId, email, passwordHash, now, now)
      .run();
  }

  const seedSample = shouldSeedSampleData(env);
  const hasSeededCertificates =
    Number(existingCertificateCounts?.births ?? 0) > 0 ||
    Number(existingCertificateCounts?.deaths ?? 0) > 0 ||
    Number(existingCertificateCounts?.marriages ?? 0) > 0;

  if (!existingSettings) {
    await upsertSettings(env.DB, buildSeedSettings());
  }

  if (seedSample && !hasSeededCertificates) {
    await seedSampleCertificates(env.DB, userId);
  }

  await Promise.all([
    setSystemBooleanSetting(env.DB, "installed", true),
    setSystemBooleanSetting(env.DB, "sample_data", seedSample),
    setSystemBooleanSetting(env.DB, "seed_sample", seedSample),
  ]);
}

export function ensureDevSeed(env: Env["Bindings"]): Promise<void> {
  if (!ensureDevSeedPromise) {
    ensureDevSeedPromise = runEnsureDevSeed(env).catch((error) => {
      ensureDevSeedPromise = null;
      throw error;
    });
  }

  return ensureDevSeedPromise;
}
