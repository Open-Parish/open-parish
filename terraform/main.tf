resource "cloudflare_d1_database" "main" {
  account_id = var.cloudflare_account_id
  name       = var.d1_database_name
}

resource "cloudflare_r2_bucket" "uploads" {
  account_id = var.cloudflare_account_id
  name       = var.r2_uploads_bucket_name
}

resource "cloudflare_r2_bucket" "uploads_preview" {
  account_id = var.cloudflare_account_id
  name       = var.r2_preview_bucket_name
}
