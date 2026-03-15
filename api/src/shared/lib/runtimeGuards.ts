import { HTTPException } from "hono/http-exception";
import type { Env } from "../../index.types";

const DEFAULT_JWT_SECRET = "change-me-in-cloudflare";

function isProductionEnv(env: Env["Bindings"]): boolean {
  const nodeEnv = String(env.NODE_ENV ?? env.APP_ENV ?? "")
    .trim()
    .toLowerCase();
  return nodeEnv === "production";
}

export function assertRuntimeSecurity(env: Env["Bindings"]): void {
  const jwtSecret = String(env.JWT_SECRET ?? "").trim();

  if (!isProductionEnv(env)) {
    return;
  }

  if (!jwtSecret || jwtSecret === DEFAULT_JWT_SECRET) {
    throw new HTTPException(500, {
      message: "JWT_SECRET must be set to a non-default value in production",
    });
  }
}
