# Open Parish API

Cloudflare Worker API for Open Parish.

It uses:
- Hono for routing
- D1 for relational data
- R2 for uploaded images
- JWT-based auth with secure cookies

## Requirements

- Node.js 20+
- npm
- Wrangler
- A Cloudflare account with D1 and R2 enabled

## Local Setup

Install dependencies:

```bash
npm install
```

Copy the local env example:

```bash
cp .dev.vars.example .dev.vars
```

Then update values in `.dev.vars` as needed.

## Local Development

Apply local migrations:

```bash
npm run d1:migrate:local
```

Start the Worker:

```bash
npm run dev
```

Default local API URL:

```text
http://localhost:8787
```

## Local Env Vars

Common local vars:

```env
NODE_ENV=development
CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
ENABLE_DEV_SEED=true
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=change-this-password
SEED_SAMPLE_DATA=true
```

Notes:
- `ENABLE_DEV_SEED=true` is required for automatic local seeding.
- `SEED_SAMPLE_DATA=false` disables sample certificate records.
- In production, the dev seed path is disabled.

## Cloudflare Setup

Create your D1 database and R2 bucket, then update [`wrangler.toml`](./wrangler.toml):

- `d1_databases.database_id`
- `d1_databases.database_name`
- `r2_buckets.bucket_name`
- `r2_buckets.preview_bucket_name`

Set the required secret:

```bash
wrangler secret put JWT_SECRET
```

If you serve uploads from a public URL, set `R2_PUBLIC_URL`.

## Deploy

Apply remote migrations:

```bash
npm run d1:migrate:remote
```

Deploy the Worker:

```bash
npm run deploy
```

## Security Notes

- Production startup fails if `JWT_SECRET` is blank or still set to the default placeholder value.
- Login requests are rate limited with Cloudflare Workers Rate Limiting.
- Production cookies use `Secure`, `SameSite=Strict`, and `__Host-` prefixes.
- Internal error details are hidden in production responses.
- Authenticated uploads only allow PNG, JPEG, and WebP images up to 5 MB.
- Stored upload content types are derived from detected file signatures, not caller-provided MIME types.

## Features

- Email/password login
- Protected certificate CRUD
- Settings read/update
- Image uploads for signature and certificate header assets
- Print preview and downloadable certificate output
