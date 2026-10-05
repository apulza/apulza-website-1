-- Beta tester sign-ups from the website form (POST /api/beta-signup).
-- Deliberately no diagnoses, student IDs, grades, or school credentials.
CREATE TABLE beta_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'counselor')),
  confirmed_18_plus INTEGER NOT NULL CHECK (confirmed_18_plus = 1),
  terms_version TEXT NOT NULL,
  school TEXT,
  year_level TEXT,
  feedback_pref TEXT CHECK (feedback_pref IN ('survey', 'call', 'in_app')),
  phone TEXT,            -- only kept when feedback_pref = 'call'
  support_needs TEXT     -- JSON array of broad, self-identified checkboxes
);
