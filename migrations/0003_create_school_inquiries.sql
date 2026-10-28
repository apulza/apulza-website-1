-- Requests from the school pilot conversation form (POST /api/school-inquiry).
-- This stores contact details only, never student information.
CREATE TABLE school_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  sheet_synced_at TEXT
);
