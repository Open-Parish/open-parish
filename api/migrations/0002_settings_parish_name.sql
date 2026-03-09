ALTER TABLE settings
  ADD COLUMN parish_name TEXT NOT NULL DEFAULT 'Our Lady of the Sacred Heart';

UPDATE settings
SET parish_name = 'Our Lady of the Sacred Heart'
WHERE COALESCE(TRIM(parish_name), '') = '';
