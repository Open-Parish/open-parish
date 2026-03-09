import { HTTPException } from "hono/http-exception";
import type { Env } from "../../index.types";
import { uploadToR2 } from "../../shared/utils/upload";

export function getUploadKeyFromPath(pathname: string): string {
  const prefix = "/upload/file/";
  const key = decodeURIComponent(
    pathname.startsWith(prefix) ? pathname.slice(prefix.length) : "",
  );

  if (!key) {
    throw new HTTPException(404, { message: "File not found" });
  }

  return key;
}

export async function getUploadFileResponse(env: Env["Bindings"], key: string) {
  const object = await env.UPLOADS.get(key);
  if (!object) {
    throw new HTTPException(404, { message: "File not found" });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return new Response(object.body, { headers });
}

export async function uploadFileToR2(env: Env["Bindings"], file: File) {
  const url = await uploadToR2(env, file);

  return {
    key: url.replace(/^\/upload\/file\//, ""),
    url,
    size: file.size,
    type: file.type,
    originalName: file.name,
  };
}
