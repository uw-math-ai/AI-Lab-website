CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE authors (github_id INTEGER PRIMARY KEY, login TEXT NOT NULL, name TEXT NOT NULL, avatar TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('author','admin')), added_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE sessions (token_hash TEXT PRIMARY KEY, github_id INTEGER NOT NULL, login TEXT NOT NULL, name TEXT NOT NULL, avatar TEXT NOT NULL, expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE auth_flows (state_hash TEXT PRIMARY KEY, verifier TEXT NOT NULL, challenge TEXT NOT NULL, client_state TEXT NOT NULL, return_to TEXT NOT NULL, expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE handoffs (code_hash TEXT PRIMARY KEY, github_id INTEGER NOT NULL, login TEXT NOT NULL, name TEXT NOT NULL, avatar TEXT NOT NULL, challenge TEXT NOT NULL, expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE posts (id TEXT PRIMARY KEY, author_id INTEGER NOT NULL, author_login TEXT NOT NULL, author_name TEXT NOT NULL, title TEXT NOT NULL DEFAULT '', slug TEXT NOT NULL UNIQUE, summary TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '[]', cover TEXT NOT NULL DEFAULT '', cover_alt TEXT NOT NULL DEFAULT '', version INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, published_at INTEGER, published_json TEXT);
--> statement-breakpoint
CREATE INDEX posts_published ON posts(published_at DESC);
--> statement-breakpoint
CREATE INDEX posts_author ON posts(author_id,updated_at DESC);
--> statement-breakpoint
CREATE TABLE media (id TEXT PRIMARY KEY, author_id INTEGER NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, created_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, reset_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE INDEX sessions_expiration ON sessions(expires_at);
--> statement-breakpoint
CREATE INDEX flows_expiration ON auth_flows(expires_at);
--> statement-breakpoint
CREATE INDEX handoffs_expiration ON handoffs(expires_at);
--> statement-breakpoint
CREATE INDEX rate_expiration ON rate_limits(reset_at);
