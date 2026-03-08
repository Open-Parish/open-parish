output "d1_database_id" {
  description = "Use this value in api/wrangler.toml -> d1_databases.database_id"
  value       = cloudflare_d1_database.main.id
}

output "d1_database_name" {
  description = "Use this value in api/wrangler.toml -> d1_databases.database_name"
  value       = cloudflare_d1_database.main.name
}

output "r2_uploads_bucket_name" {
  description = "Use this value in api/wrangler.toml -> r2_buckets.bucket_name"
  value       = cloudflare_r2_bucket.uploads.name
}

output "r2_preview_bucket_name" {
  description = "Use this value in api/wrangler.toml -> r2_buckets.preview_bucket_name"
  value       = cloudflare_r2_bucket.uploads_preview.name
}

output "wrangler_snippet" {
  description = "Copy into api/wrangler.toml"
  value       = <<-EOT
[[d1_databases]]
binding = "DB"
database_name = "${cloudflare_d1_database.main.name}"
database_id = "${cloudflare_d1_database.main.id}"
migrations_dir = "migrations"

[[r2_buckets]]
binding = "UPLOADS"
bucket_name = "${cloudflare_r2_bucket.uploads.name}"
preview_bucket_name = "${cloudflare_r2_bucket.uploads_preview.name}"
  EOT
}
