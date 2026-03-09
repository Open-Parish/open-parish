PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  header_line_1 TEXT NOT NULL,
  header_line_2 TEXT NOT NULL,
  header_line_3 TEXT NOT NULL,
  header_line_4 TEXT NOT NULL,
  header_line_5 TEXT NOT NULL,
  header_line_6 TEXT NOT NULL,
  current_priest TEXT NOT NULL,
  current_priest_signature TEXT NOT NULL,
  logo TEXT NOT NULL,
  pdf_image_left TEXT NOT NULL DEFAULT '',
  pdf_image_right TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS certificates (
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

CREATE INDEX IF NOT EXISTS idx_certificates_kind ON certificates(kind);
CREATE INDEX IF NOT EXISTS idx_certificates_created_at ON certificates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_certificates_first_last_name ON certificates(first_name, last_name);
