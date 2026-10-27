# UW Math AI Lab blog service

GitHub identity, author approval, drafts, publication, and images for
https://ai.math.uw.edu/blog/. The frontend lives in `uw-math-ai/AI-Lab-website`.

This is a dependency-free Cloudflare Worker, hosted with Sites. D1 stores posts,
approvals, and sessions; R2 stores uploaded images. `.openai/hosting.json` binds
the existing Site. Never create a replacement Site to deploy an update: doing
so would create a different database and media bucket.

## Author workflow

Visit `/blog/write/` on the lab website and sign in with GitHub. The owner,
GitHub user ID **134547794** (`zengrf`), is always an administrator. In **Authors**,
an administrator approves a GitHub username as an author or administrator.
Approval is stored by GitHub ID so a renamed account retains its permissions.
Unapproved users may sign in but cannot create, read, or change drafts.

Authors edit their own posts; administrators can edit all posts. Drafts autosave
with optimistic concurrency checks. Publishing takes a snapshot. Later draft
edits do not change that public snapshot until **Publish changes** is clicked.
Unpublish removes the snapshot; delete is available only for unpublished drafts.

## GitHub setup

Production runtime environment:

- `BLOG_SITE_URL`: `https://ai.math.uw.edu`
- `SERVICE_URL`: the public URL of this Worker
- `ROOT_GITHUB_ID`: `134547794`
- `RUNTIME_SECRET`: secret, 32 random bytes encoded as base64url
- `SETUP_TOKEN`: secret, a separate 32-byte random token

Open `/setup?token=SETUP_TOKEN` privately in the owner's browser. The prefilled
GitHub App manifest requests public identity only, no repository permissions.
Register it under **zengrf**. GitHub returns to `/setup/complete`; the service
exchanges the manifest code, verifies the owner ID, and stores the client
credentials encrypted with `RUNTIME_SECRET`. The setup flow then closes itself.
No copy/paste of OAuth client secrets is needed. Keep `RUNTIME_SECRET` stable:
changing it would make stored credentials unreadable.

For an existing GitHub OAuth/App registration, secret environment variables
`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` can be supplied instead. Register
`SERVICE_URL/auth/github/callback` as its callback URL.

OAuth uses a state cookie, server PKCE, and a one-use browser handoff bound to a
second verifier. GitHub access tokens are discarded after the identity lookup.
Only hashes of seven-day blog session tokens are stored. Every editor request
checks the current approval. CORS allows the lab and service origins only.

## Development and tests

Requires Node 20+ and Python 3 with SQLite 3.35+ (`RETURNING` support).

```sh
npm test
npm run build
npm run validate
npm run dev
```

The local server binds only `127.0.0.1:4318`, creates a disposable SQLite
 database, and provides **local-only** test accounts. Use the frontend at port
4317 with `VITE_BLOG_API=http://127.0.0.1:4318`. In that browser's sessionStorage,
set `math-ai-blog-session` to 43 repetitions of `a` (owner), `b` (author), or `d`
(unapproved reader). These tokens never exist in production. Set `PYTHON` if a
specific Python binary is needed. Never enable `LOCAL_PREVIEW` in production.

Tests exercise authorization, ownership, optimistic locking, publication
snapshots, revocation, search, OAuth/PKCE, expiry, manifest setup, and invalid
uploads against real SQLite. `tests/dev-server.mjs` and all test fixtures are
excluded from the production artifact by the build script.

## Deploy and maintain

Use the Sites workflow on this exact project ID from `.openai/hosting.json`:
push source, run `npm run build` and `npm run validate`, package the artifact,
save a version, and deploy it. The build contains only `worker/index.js`, the
hosting manifest, and the schema migrations in `drizzle/` (included by the Sites
packaging helper). For schema changes, add a new numbered migration and journal
entry; do not edit a migration already applied to production.

The lab repository also includes a source mirror in `services/blog/` for review
and recovery. Keep it synchronized when deploying the service.

`GET /health` reports service health and whether GitHub is connected. It never
returns credentials. **Export backup** in the administrator dashboard downloads
all posts, their published snapshots, and approvals. Store that export privately.
Image URLs remain stable; images are public by URL, including images uploaded
while drafting. Image binary files are stored separately in R2 and are not part
of the JSON export. Deleting a post does not delete its image objects.

The editor supports Markdown, tables, code, and `$...$` / `$$...$$` math. Raw
HTML and unsafe link protocols are disabled, and KaTeX renders with `trust:false`.
Uploads accept JPEG, PNG, or WebP signatures, up to 5 MB. SVG/HTML is rejected.
