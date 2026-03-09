PRAGMA foreign_keys = OFF;

CREATE TABLE certificates_new (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('baptismal', 'confirmation', 'death', 'marriage')),
  certificate_type TEXT,
  first_name TEXT,
  last_name TEXT,
  payload TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);

INSERT INTO certificates_new (
  id,
  kind,
  certificate_type,
  first_name,
  last_name,
  payload,
  created_at,
  updated_at,
  deleted_at
)
SELECT
  id,
  CASE
    WHEN kind = 'birth' AND LOWER(COALESCE(certificate_type, '')) = 'confirmation' THEN 'confirmation'
    WHEN kind = 'birth' THEN 'baptismal'
    ELSE kind
  END AS kind,
  CASE
    WHEN kind = 'birth' AND LOWER(COALESCE(certificate_type, '')) IN ('', 'birth', 'baptismal') THEN 'baptismal'
    WHEN kind = 'birth' AND LOWER(COALESCE(certificate_type, '')) = 'confirmation' THEN 'confirmation'
    ELSE certificate_type
  END AS certificate_type,
  first_name,
  last_name,
  payload,
  created_at,
  updated_at,
  deleted_at
FROM certificates;

DROP TABLE certificates;
ALTER TABLE certificates_new RENAME TO certificates;

CREATE INDEX IF NOT EXISTS idx_certificates_kind ON certificates(kind);
CREATE INDEX IF NOT EXISTS idx_certificates_created_at ON certificates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_first_last_name ON certificates(first_name, last_name);

PRAGMA foreign_keys = ON;
