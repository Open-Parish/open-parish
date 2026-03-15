import { HTTPException } from "hono/http-exception";
import { fileTypeFromBuffer } from "file-type";
import type { Env } from "../../index.types";

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

type ValidatedUpload = {
  body: ArrayBuffer;
  contentType: string;
  extension: string;
};

export async function validateImageUpload(file: File): Promise<ValidatedUpload> {
  if (!(file instanceof File) || file.size <= 0) {
    throw new HTTPException(422, { message: "File is required" });
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new HTTPException(422, {
      message: "File is too large. Maximum size is 5 MB",
    });
  }

  const body = await file.arrayBuffer();
  const detectedType = await fileTypeFromBuffer(new Uint8Array(body));

  if (
    !detectedType ||
    !["image/png", "image/jpeg", "image/webp"].includes(detectedType.mime)
  ) {
    throw new HTTPException(422, {
      message: "Only PNG, JPEG, and WebP images are allowed",
    });
  }

  return {
    body,
    contentType: detectedType.mime,
    extension: `.${detectedType.ext}`,
  };
}

export async function uploadToR2(
  env: Env["Bindings"],
  file: File,
): Promise<string> {
  const validated = await validateImageUpload(file);
  const key = `uploads/${Date.now()}-${crypto.randomUUID()}${validated.extension}`;

  await env.UPLOADS.put(key, validated.body, {
    httpMetadata: { contentType: validated.contentType },
  });

  if (env.R2_PUBLIC_URL) {
    return `${env.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
  }

  return `/upload/file/${key}`;
}
