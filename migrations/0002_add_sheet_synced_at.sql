-- When the row was copied to the team's Google Sheet. NULL means it hasn't been
-- (Sheet not configured yet, or the copy failed) and may need re-sending.
ALTER TABLE beta_signups ADD COLUMN sheet_synced_at TEXT;
