# Terraform Cloudflare Setup

Creates the core Cloudflare resources for this project:
- D1 database
- R2 uploads bucket
- R2 preview bucket

## 1. Prerequisites

- Terraform `>= 1.5`
- Cloudflare API token with:
  - Account -> D1 -> Edit
  - Account -> R2 -> Edit

## 2. Configure variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Set at least:
- `cloudflare_account_id`
- `cloudflare_api_token` (or export as `TF_VAR_cloudflare_api_token`)

## 3. Apply

```bash
terraform init
terraform plan
terraform apply
```

## 4. Use outputs in Wrangler

```bash
terraform output
terraform output -raw wrangler_snippet
```

Copy output values into:
- `../api/wrangler.toml`

Replace these fields:
- `d1_databases.database_id`
- `d1_databases.database_name`
- `r2_buckets.bucket_name`
- `r2_buckets.preview_bucket_name`

## 5. Next steps

After updating `api/wrangler.toml`, run:

```bash
cd ../api
npx wrangler d1 migrations apply openparish --remote
```
