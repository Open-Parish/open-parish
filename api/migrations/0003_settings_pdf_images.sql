-- NOTE:
-- Column creation was moved into 0001_init.sql.
-- Keep this migration as a safe backfill for databases that already have the new columns.
UPDATE settings
SET
  pdf_image_left = CASE
    WHEN TRIM(COALESCE(pdf_image_left, '')) = '' THEN COALESCE(logo, '')
    ELSE pdf_image_left
  END,
  pdf_image_right = CASE
    WHEN TRIM(COALESCE(pdf_image_right, '')) = '' THEN COALESCE(logo, '')
    ELSE pdf_image_right
  END,
  updated_at = datetime('now')
WHERE id = 1;
