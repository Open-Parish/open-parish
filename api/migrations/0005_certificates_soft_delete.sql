CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  certificate_type TEXT,
  first_name TEXT,
  last_name TEXT,
  payload TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT
);

ALTER TABLE certificates ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0;
ALTER TABLE certificates ADD COLUMN deleted_by TEXT REFERENCES users(id);

UPDATE certificates
SET deleted = CASE WHEN deleted_at IS NULL THEN 0 ELSE 1 END
WHERE deleted = 0;

CREATE INDEX IF NOT EXISTS idx_certificates_kind_deleted ON certificates(kind, deleted);
