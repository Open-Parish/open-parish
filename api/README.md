# OLSHP API (Cloudflare)

Hono API running on Cloudflare Workers with:
- D1 for relational data
- R2 for uploaded files/images
- JWT auth (email + password)

## Runtime

- Worker entry: `src/index.ts`
- Hono modules: `src/domains/**`, `src/shared/**`
- D1 migrations: `migrations/**`
- Wrangler config: `wrangler.toml`

## Setup

1. Install dependencies

```bash
npm install
```

2. Create D1 DB + R2 bucket in Cloudflare, then update `wrangler.toml`:
- `d1_databases.database_id`
- `r2_buckets.bucket_name`
- `r2_buckets.preview_bucket_name`

3. Configure secrets/vars

```bash
wrangler secret put JWT_SECRET
```

Set `R2_PUBLIC_URL` in `wrangler.toml` (or via environment vars) if bucket objects are publicly served.

Optional local/non-production seed vars:

```bash
wrangler secret put DEFAULT_ADMIN_EMAIL
wrangler secret put DEFAULT_ADMIN_PASSWORD
```

Set `SEED_SAMPLE_DATA=false` if you want the default admin without sample certificate records.
For local `wrangler dev`, copy [`api/.dev.vars.example`](./.dev.vars.example) to `.dev.vars` and set your values there.

Set `CORS_ALLOWED_ORIGINS` to the dashboard origin list that should be allowed to call the API. Example:

```env
CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
```

In production, set this explicitly. The API no longer reflects arbitrary origins.

## Local Development

```bash
npm run d1:migrate:local
npm run dev
```

Non-production seed bootstrap:
- If `NODE_ENV`/`APP_ENV` is not `production`, the worker can auto-create core schema and seed a default admin from `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD`.
- If `SEED_SAMPLE_DATA` is not set to `false`, sample certificate records are also inserted for that default admin.
- If `NODE_ENV=production`, the auto-seed path is disabled.

## Deploy

```bash
npm run d1:migrate:remote
npm run deploy
```

## Implemented Features

- Username/password auth using email (`/register`, `/login`)
- JWT-protected routes
- Certificate CRUD for birth/baptismal/confirmation, death, marriage
- Pagination + search (`/page`, `/search`)
- Settings read/update (+ password change)
- Image upload to R2 (`/upload` and settings file fields)
- Printable certificate views (`/print`, `/print-preview`)
- Downloadable certificate output via `?download=1`
