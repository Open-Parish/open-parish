# Deployment Guide

This repository includes a GitHub Actions workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that automatically deploys:

- API (`api/`) to Cloudflare Workers
- Dashboard (`dashboard/`) to Cloudflare Pages

## Workflow Triggers

- Push to `main` with changes in:
  - `api/**`
  - `dashboard/**`
  - `.github/workflows/deploy.yml`
- Manual run from GitHub Actions (`workflow_dispatch`)

## Required GitHub Secrets

Configure these in your GitHub repository settings:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT_NAME`
- `VITE_API_BASE_URL`

## Deployment Flow

1. `deploy-api` job
   - Installs API dependencies with `npm ci`
   - Runs remote D1 migrations:
     - `npx wrangler d1 migrations apply olshp --remote`
   - Deploys Worker:
     - `npx wrangler deploy`
2. `deploy-dashboard` job (runs after API succeeds)
   - Installs dashboard dependencies with `npm ci`
   - Builds dashboard:
     - `npm run build`
   - Deploys build output to Cloudflare Pages:
     - `npx wrangler pages deploy dist --project-name "${{ secrets.CLOUDFLARE_PAGES_PROJECT_NAME }}"`

## Notes

- The workflow uses Node.js 20.
- Dashboard deployment depends on successful API deployment in the same run.
