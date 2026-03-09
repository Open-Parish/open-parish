PRAGMA foreign_keys = OFF;

CREATE TABLE deaths_new (
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

INSERT INTO deaths_new (
  id, firstName, lastName, address, age, survivors, burialDate, deathDate, burialPlace, sacraments,
  celebrantPriest, bookNumber, pageNumber, user, createdAt, updatedAt, deleted, deletedBy, deletedAt
)
SELECT
  id, firstName, lastName, address, age, survivors, burialDate, deathDate, burialPlace, sacraments,
  celebrantPriest, bookNumber, pageNumber, user, createdAt, updatedAt, deleted, deletedBy, deletedAt
FROM deaths;

DROP TABLE deaths;
ALTER TABLE deaths_new RENAME TO deaths;

CREATE INDEX IF NOT EXISTS idx_deaths_deleted ON deaths(deleted);
CREATE INDEX IF NOT EXISTS idx_deaths_name ON deaths(firstName, lastName);
CREATE INDEX IF NOT EXISTS idx_deaths_created_at ON deaths(createdAt DESC);

CREATE TABLE marriages_new (
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

INSERT INTO marriages_new (
  id, bride, groom, sponsor1, sponsor2, licenseNumber, registryNumber, remarks, occasionDate, celebrantPriest,
  bookNumber, pageNumber, user, createdAt, updatedAt, deleted, deletedBy, deletedAt
)
SELECT
  id, bride, groom, sponsor1, sponsor2, licenseNumber, registryNumber, remarks, occasionDate, celebrantPriest,
  bookNumber, pageNumber, user, createdAt, updatedAt, deleted, deletedBy, deletedAt
FROM marriages;

DROP TABLE marriages;
ALTER TABLE marriages_new RENAME TO marriages;

CREATE INDEX IF NOT EXISTS idx_marriages_deleted ON marriages(deleted);
CREATE INDEX IF NOT EXISTS idx_marriages_created_at ON marriages(createdAt DESC);

PRAGMA foreign_keys = ON;
