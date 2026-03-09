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

## Local Development

```bash
npm run d1:migrate:local
npm run dev
```

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
