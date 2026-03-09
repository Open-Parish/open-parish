import type { Env } from "../../index.types";

export async function uploadToR2(
  env: Env["Bindings"],
  file: File,
): Promise<string> {
  const extension = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
    : "";
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}${extension}`;

  await env.UPLOADS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
  });

  if (env.R2_PUBLIC_URL) {
    return `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  }

  return `/upload/file/${key}`;
}
