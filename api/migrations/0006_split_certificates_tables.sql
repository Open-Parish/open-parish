PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS births;
DROP TABLE IF EXISTS deaths;
DROP TABLE IF EXISTS marriages;

CREATE TABLE births (
  id TEXT PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  certificateType TEXT NOT NULL,
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
);

CREATE TABLE deaths (
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
);

CREATE TABLE marriages (
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
);

INSERT OR REPLACE INTO births (
  id,
  firstName,
  lastName,
  certificateType,
  address,
  parent1,
  parent2,
  celebrantPriest,
  sponsor1,
  sponsor2,
  birthDate,
  occasionDate,
  bookNumber,
  pageNumber,
  user,
  createdAt,
  updatedAt,
  deleted,
  deletedBy,
  deletedAt
)
SELECT
  id,
  COALESCE(json_extract(payload, '$.firstName'), first_name, ''),
  COALESCE(json_extract(payload, '$.lastName'), last_name, ''),
  CASE
    WHEN LOWER(COALESCE(certificate_type, json_extract(payload, '$.certificateType'))) = 'confirmation' THEN 'confirmation'
    ELSE 'baptismal'
  END,
  COALESCE(json_extract(payload, '$.address'), ''),
  json_extract(payload, '$.parent1'),
  json_extract(payload, '$.parent2'),
  json_extract(payload, '$.celebrantPriest'),
  json_extract(payload, '$.sponsor1'),
  json_extract(payload, '$.sponsor2'),
  COALESCE(json_extract(payload, '$.birthDate'), ''),
  COALESCE(json_extract(payload, '$.occasionDate'), ''),
  COALESCE(json_extract(payload, '$.bookNumber'), 0),
  COALESCE(json_extract(payload, '$.pageNumber'), 0),
  COALESCE(json_extract(payload, '$.user'), ''),
  created_at,
  updated_at,
  COALESCE(deleted, CASE WHEN deleted_at IS NULL THEN 0 ELSE 1 END),
  deleted_by,
  deleted_at
FROM certificates
WHERE kind IN ('birth', 'baptismal', 'confirmation');

INSERT OR REPLACE INTO deaths (
  id,
  firstName,
  lastName,
  address,
  age,
  survivors,
  burialDate,
  deathDate,
  burialPlace,
  sacraments,
  celebrantPriest,
  bookNumber,
  pageNumber,
  user,
  createdAt,
  updatedAt,
  deleted,
  deletedBy,
  deletedAt
)
SELECT
  id,
  COALESCE(json_extract(payload, '$.firstName'), first_name, ''),
  COALESCE(json_extract(payload, '$.lastName'), last_name, ''),
  COALESCE(json_extract(payload, '$.address'), ''),
  COALESCE(json_extract(payload, '$.age'), ''),
  json_extract(payload, '$.survivors'),
  COALESCE(json_extract(payload, '$.burialDate'), ''),
  COALESCE(json_extract(payload, '$.deathDate'), ''),
  COALESCE(json_extract(payload, '$.burialPlace'), ''),
  COALESCE(json_extract(payload, '$.sacraments'), ''),
  json_extract(payload, '$.celebrantPriest'),
  COALESCE(json_extract(payload, '$.bookNumber'), 0),
  COALESCE(json_extract(payload, '$.pageNumber'), 0),
  COALESCE(json_extract(payload, '$.user'), ''),
  created_at,
  updated_at,
  COALESCE(deleted, CASE WHEN deleted_at IS NULL THEN 0 ELSE 1 END),
  deleted_by,
  deleted_at
FROM certificates
WHERE kind = 'death';

INSERT OR REPLACE INTO marriages (
  id,
  bride,
  groom,
  sponsor1,
  sponsor2,
  licenseNumber,
  registryNumber,
  remarks,
  occasionDate,
  celebrantPriest,
  bookNumber,
  pageNumber,
  user,
  createdAt,
  updatedAt,
  deleted,
  deletedBy,
  deletedAt
)
SELECT
  id,
  json_extract(payload, '$.bride'),
  json_extract(payload, '$.groom'),
  json_extract(payload, '$.sponsor1'),
  json_extract(payload, '$.sponsor2'),
  COALESCE(json_extract(payload, '$.licenseNumber'), ''),
  COALESCE(json_extract(payload, '$.registryNumber'), ''),
  COALESCE(json_extract(payload, '$.remarks'), ''),
  COALESCE(json_extract(payload, '$.occasionDate'), ''),
  json_extract(payload, '$.celebrantPriest'),
  COALESCE(json_extract(payload, '$.bookNumber'), 0),
  COALESCE(json_extract(payload, '$.pageNumber'), 0),
  COALESCE(json_extract(payload, '$.user'), ''),
  created_at,
  updated_at,
  COALESCE(deleted, CASE WHEN deleted_at IS NULL THEN 0 ELSE 1 END),
  deleted_by,
  deleted_at
FROM certificates
WHERE kind = 'marriage';

DROP TABLE IF EXISTS certificates;

CREATE INDEX IF NOT EXISTS idx_births_certificate_type_deleted ON births(certificateType, deleted);
CREATE INDEX IF NOT EXISTS idx_births_name ON births(firstName, lastName);
CREATE INDEX IF NOT EXISTS idx_births_created_at ON births(createdAt DESC);

CREATE INDEX IF NOT EXISTS idx_deaths_deleted ON deaths(deleted);
CREATE INDEX IF NOT EXISTS idx_deaths_name ON deaths(firstName, lastName);
CREATE INDEX IF NOT EXISTS idx_deaths_created_at ON deaths(createdAt DESC);

CREATE INDEX IF NOT EXISTS idx_marriages_deleted ON marriages(deleted);
CREATE INDEX IF NOT EXISTS idx_marriages_created_at ON marriages(createdAt DESC);

PRAGMA foreign_keys = ON;
