variable "cloudflare_api_token" {
  description = "Cloudflare API token with D1/R2 permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "project_name" {
  description = "Project slug used for resource names"
  type        = string
  default     = "open-parish"
}

variable "environment" {
  description = "Environment suffix for resources"
  type        = string
  default     = "prod"
}

variable "d1_database_name" {
  description = "D1 database name"
  type        = string
  default     = "openparish"
}

variable "r2_uploads_bucket_name" {
  description = "R2 bucket name for uploads"
  type        = string
  default     = "openparish-uploads"
}

variable "r2_preview_bucket_name" {
  description = "R2 bucket name for preview/dev uploads"
  type        = string
  default     = "openparish-uploads-preview"
}
