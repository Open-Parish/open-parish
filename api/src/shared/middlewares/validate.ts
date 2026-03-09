import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { ZodType } from "zod";
import type { Env } from "../../index.types";
import type { InferSchema } from "./validate.types";

export function validateJson<TSchema extends ZodType>(schema: TSchema) {
  return createMiddleware<Env>(async (c, next) => {
    const payload = await c.req.json().catch(() => undefined);
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      throw new HTTPException(422, {
        message: parsed.error.issues[0]?.message ?? "Invalid request payload",
      });
    }

    c.set("validatedJson", parsed.data);
    await next();
  });
}

export function validateFormData<TSchema extends ZodType>(schema: TSchema) {
  return createMiddleware<Env>(async (c, next) => {
    const payload = await c.req.parseBody();
    const parsed = schema.safeParse(payload);

    if (!parsed.success) {
      throw new HTTPException(422, {
        message: parsed.error.issues[0]?.message ?? "Invalid form payload",
      });
    }

    c.set("validatedForm", parsed.data as Record<string, unknown>);
    await next();
  });
}

export function getValidatedJson<TSchema extends ZodType>(
  c: Context<Env>,
): InferSchema<TSchema> {
  return c.get("validatedJson") as InferSchema<TSchema>;
}

export function getValidatedFormData<TSchema extends ZodType>(
  c: Context<Env>,
): InferSchema<TSchema> {
  return c.get("validatedForm") as InferSchema<TSchema>;
}
