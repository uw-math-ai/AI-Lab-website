CREATE TABLE github_access (github_id INTEGER PRIMARY KEY, token TEXT NOT NULL, expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX github_access_expiration ON github_access(expires_at);
