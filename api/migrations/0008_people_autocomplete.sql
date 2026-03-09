CREATE TABLE IF NOT EXISTS people_autocomplete (
  id TEXT PRIMARY KEY,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  normalizedName TEXT NOT NULL UNIQUE,
  useCount INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), firstName, lastName, lower(trim(firstName) || '|' || trim(lastName)), 1, datetime('now'), datetime('now')
FROM births
WHERE trim(COALESCE(firstName, '')) <> '' OR trim(COALESCE(lastName, '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(parent1, '$.firstName'), ''), COALESCE(json_extract(parent1, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(parent1, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(parent1, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM births
WHERE trim(COALESCE(json_extract(parent1, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(parent1, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(parent2, '$.firstName'), ''), COALESCE(json_extract(parent2, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(parent2, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(parent2, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM births
WHERE trim(COALESCE(json_extract(parent2, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(parent2, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(sponsor1, '$.firstName'), ''), COALESCE(json_extract(sponsor1, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(sponsor1, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(sponsor1, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM births
WHERE trim(COALESCE(json_extract(sponsor1, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(sponsor1, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(sponsor2, '$.firstName'), ''), COALESCE(json_extract(sponsor2, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(sponsor2, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(sponsor2, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM births
WHERE trim(COALESCE(json_extract(sponsor2, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(sponsor2, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(celebrantPriest, '$.firstName'), ''), COALESCE(json_extract(celebrantPriest, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(celebrantPriest, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(celebrantPriest, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM births
WHERE trim(COALESCE(json_extract(celebrantPriest, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(celebrantPriest, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), firstName, lastName, lower(trim(firstName) || '|' || trim(lastName)), 1, datetime('now'), datetime('now')
FROM deaths
WHERE trim(COALESCE(firstName, '')) <> '' OR trim(COALESCE(lastName, '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(survivors, '$.firstName'), ''), COALESCE(json_extract(survivors, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(survivors, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(survivors, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM deaths
WHERE trim(COALESCE(json_extract(survivors, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(survivors, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(celebrantPriest, '$.firstName'), ''), COALESCE(json_extract(celebrantPriest, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(celebrantPriest, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(celebrantPriest, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM deaths
WHERE trim(COALESCE(json_extract(celebrantPriest, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(celebrantPriest, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(bride, '$.firstName'), ''), COALESCE(json_extract(bride, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(bride, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(bride, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM marriages
WHERE trim(COALESCE(json_extract(bride, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(bride, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(groom, '$.firstName'), ''), COALESCE(json_extract(groom, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(groom, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(groom, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM marriages
WHERE trim(COALESCE(json_extract(groom, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(groom, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(sponsor1, '$.firstName'), ''), COALESCE(json_extract(sponsor1, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(sponsor1, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(sponsor1, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM marriages
WHERE trim(COALESCE(json_extract(sponsor1, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(sponsor1, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(sponsor2, '$.firstName'), ''), COALESCE(json_extract(sponsor2, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(sponsor2, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(sponsor2, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM marriages
WHERE trim(COALESCE(json_extract(sponsor2, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(sponsor2, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');

INSERT INTO people_autocomplete (id, firstName, lastName, normalizedName, useCount, createdAt, updatedAt)
SELECT lower(hex(randomblob(16))), COALESCE(json_extract(celebrantPriest, '$.firstName'), ''), COALESCE(json_extract(celebrantPriest, '$.lastName'), ''),
  lower(trim(COALESCE(json_extract(celebrantPriest, '$.firstName'), '')) || '|' || trim(COALESCE(json_extract(celebrantPriest, '$.lastName'), ''))),
  1, datetime('now'), datetime('now')
FROM marriages
WHERE trim(COALESCE(json_extract(celebrantPriest, '$.firstName'), '')) <> '' OR trim(COALESCE(json_extract(celebrantPriest, '$.lastName'), '')) <> ''
ON CONFLICT(normalizedName) DO UPDATE SET useCount = people_autocomplete.useCount + 1, updatedAt = datetime('now');
