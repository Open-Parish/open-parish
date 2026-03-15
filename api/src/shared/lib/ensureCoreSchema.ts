import type { D1Database } from "@cloudflare/workers-types";

const CREATE_STATEMENTS = [
  "PRAGMA foreign_keys = ON",
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    parish_name TEXT NOT NULL,
    header_line_1 TEXT NOT NULL,
    header_line_2 TEXT NOT NULL,
    header_line_3 TEXT NOT NULL,
    header_line_4 TEXT NOT NULL,
    header_line_5 TEXT NOT NULL,
    header_line_6 TEXT NOT NULL,
    current_priest TEXT NOT NULL,
    current_priest_signature TEXT NOT NULL,
    logo TEXT NOT NULL,
    pdf_image_left TEXT NOT NULL,
    pdf_image_right TEXT NOT NULL,
    show_parish_seal INTEGER NOT NULL DEFAULT 1,
    show_pdf_image_left INTEGER NOT NULL DEFAULT 1,
    show_pdf_image_right INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS births (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    certificateType TEXT NOT NULL CHECK (
      LOWER(certificateType) IN ('baptismal', 'confirmation')
    ),
    address TEXT NOT NULL,
    parent1 TEXT,
    parent2 TEXT,
    celebrantPriest TEXT,
    sponsor1 TEXT,
    sponsor2 TEXT,
    birthDate TEXT,
    occasionDate TEXT NOT NULL,
    bookNumber REAL,
    pageNumber REAL,
    user TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deleted INTEGER NOT NULL DEFAULT 0,
    deletedBy TEXT REFERENCES users(id),
    deletedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS deaths (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    address TEXT NOT NULL,
    age TEXT NOT NULL,
    survivors TEXT,
    burialDate TEXT NOT NULL,
    deathDate TEXT NOT NULL,
    burialPlace TEXT NOT NULL,
    sacraments TEXT NOT NULL,
    celebrantPriest TEXT,
    bookNumber REAL,
    pageNumber REAL,
    user TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deleted INTEGER NOT NULL DEFAULT 0,
    deletedBy TEXT REFERENCES users(id),
    deletedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS marriages (
    id TEXT PRIMARY KEY,
    bride TEXT,
    groom TEXT,
    sponsor1 TEXT,
    sponsor2 TEXT,
    licenseNumber TEXT,
    registryNumber TEXT,
    remarks TEXT,
    occasionDate TEXT NOT NULL,
    celebrantPriest TEXT,
    bookNumber REAL,
    pageNumber REAL,
    user TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    deleted INTEGER NOT NULL DEFAULT 0,
    deletedBy TEXT REFERENCES users(id),
    deletedAt TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS people_autocomplete (
    id TEXT PRIMARY KEY,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    normalizedName TEXT NOT NULL UNIQUE,
    useCount INTEGER NOT NULL DEFAULT 1,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_births_certificate_type_deleted
    ON births(certificateType, deleted)`,
  "CREATE INDEX IF NOT EXISTS idx_births_name ON births(firstName, lastName)",
  "CREATE INDEX IF NOT EXISTS idx_births_created_at ON births(createdAt DESC)",
  "CREATE INDEX IF NOT EXISTS idx_deaths_deleted ON deaths(deleted)",
  "CREATE INDEX IF NOT EXISTS idx_deaths_name ON deaths(firstName, lastName)",
  "CREATE INDEX IF NOT EXISTS idx_deaths_created_at ON deaths(createdAt DESC)",
  "CREATE INDEX IF NOT EXISTS idx_marriages_deleted ON marriages(deleted)",
  "CREATE INDEX IF NOT EXISTS idx_marriages_created_at ON marriages(createdAt DESC)",
  `CREATE INDEX IF NOT EXISTS idx_people_autocomplete_name
    ON people_autocomplete(lastName, firstName)`,
  `CREATE INDEX IF NOT EXISTS idx_people_autocomplete_use_count
    ON people_autocomplete(useCount DESC)`,
];

let ensurePromise: Promise<void> | null = null;

async function runEnsureCoreSchema(db: D1Database): Promise<void> {
  for (const statement of CREATE_STATEMENTS) {
    await db.prepare(statement).run();
  }
}

export function ensureCoreSchema(db: D1Database): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = runEnsureCoreSchema(db).catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }
  return ensurePromise;
}
