import type { Context } from "hono";
import type { Env } from "../../index.types";
import { getValidatedFormData } from "../../shared/middlewares/validate";
import { uploadFileSchema } from "./uploads.schema";
import {
  getUploadFileResponse,
  getUploadKeyFromPath,
  uploadFileToR2,
} from "./uploads.service";

export async function getUploadFileController(c: Context<Env>) {
  const key = getUploadKeyFromPath(new URL(c.req.url).pathname);
  return getUploadFileResponse(c.env, key);
}

export async function uploadFileController(c: Context<Env>) {
  const payload = getValidatedFormData<typeof uploadFileSchema>(c);
  const result = await uploadFileToR2(c.env, payload.file);
  return c.json(result);
}
