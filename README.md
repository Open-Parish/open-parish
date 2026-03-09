# Open Parish

[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=Open-Parish_open-parish&metric=alert_status)](https://sonarcloud.io/project/overview?id=Open-Parish_open-parish)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Open-Parish_open-parish&metric=reliability_rating)](https://sonarcloud.io/project/overview?id=Open-Parish_open-parish)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Open-Parish_open-parish&metric=security_rating)](https://sonarcloud.io/project/overview?id=Open-Parish_open-parish)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Open-Parish_open-parish&metric=sqale_rating)](https://sonarcloud.io/project/overview?id=Open-Parish_open-parish)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Open-Parish_open-parish&metric=bugs)](https://sonarcloud.io/project/overview?id=Open-Parish_open-parish)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Open-Parish_open-parish&metric=vulnerabilities)](https://sonarcloud.io/project/overview?id=Open-Parish_open-parish)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Open-Parish_open-parish&metric=code_smells)](https://sonarcloud.io/project/overview?id=Open-Parish_open-parish)
[![Duplicated Lines](https://sonarcloud.io/api/project_badges/measure?project=Open-Parish_open-parish&metric=duplicated_lines_density)](https://sonarcloud.io/project/overview?id=Open-Parish_open-parish)

Open Parish is an open-source parish records and certificate management system.

It includes:
- a **Dashboard** (`/dashboard`) for parish staff
- a **Hono API** (`/api`) for certificate and settings workflows
- Cloudflare-native storage using **D1** (database) and **R2** (uploads)

## Features

- Email/password authentication
- Multi-user access on shared parish data
- Certificate CRUD for:
  - Baptismal
  - Confirmation
  - Marriage
  - Death
- PDF/print preview and downloadable certificate output
- Parish settings with image uploads (signature + PDF header images)
- People autocomplete from previously used names

## Tech Stack

- Frontend: React, Vite, TypeScript, Mantine, TanStack Query, React Context
- API: Hono, TypeScript, Zod validation, JOSE (JWT)
- Cloudflare: Workers, D1, R2, Wrangler

## Repository Structure

- [`dashboard/`](dashboard): frontend app
- [`api/`](api): Worker API
- [`terraform/`](terraform): IaC for Cloudflare resources

## Prerequisites

- Node.js 20+
- npm 10+
- Cloudflare account with D1 and R2 enabled
- Wrangler CLI (`npx wrangler` is fine)

## Local Development

### 1) API

```bash
cd api
npm install
npm run d1:migrate:local
npm run d1:seed:local
npm run dev
```

### 2) Dashboard

```bash
cd dashboard
npm install
npm run dev
```

By default:
- Dashboard: `http://localhost:5173`
- API (Wrangler dev): shown by Wrangler output

## Cloudflare Deployment

### API

```bash
cd api
npm install
npx wrangler secret put JWT_SECRET
npm run d1:migrate:remote
npm run deploy
```

### Infrastructure (optional via Terraform)

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# fill required vars
terraform init
terraform apply
```

## Quality Checks

### Dashboard

```bash
cd dashboard
npm run check
```

### API

```bash
cd api
npm run check
```

## Sonar

This repo includes Sonar exclusions for migrations in:
- [`sonar-project.properties`](sonar-project.properties)

## Contributing

1. Fork the repo
2. Create a feature branch
3. Run `npm run check` in changed projects
4. Open a PR with a clear summary and screenshots for UI changes

## Security

- Never commit secrets or tokens
- Use Cloudflare Secrets for sensitive runtime values
- Rotate exposed tokens immediately

## License

Free for parishes/nonprofits and self-hosted use.  
No resale and no hosted SaaS offering without a separate commercial license.  
Business Source License 1.1 (BSL 1.1) with a custom Additional Use Grant.  
See [`LICENSE`](LICENSE).
