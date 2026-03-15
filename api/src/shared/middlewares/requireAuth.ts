import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { Env } from "../../index.types";
import { readAuthCookie, readCsrfCookie } from "../lib/authCookie";
import { verifyJwt } from "../lib/security/jwt";

function requiresCsrf(method: string): boolean {
  return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
}

export const requireAuth = createMiddleware<Env>(async (c, next) => {
  const authorization = c.req.header("Authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : readAuthCookie(c);

  if (!token) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const payload = await verifyJwt(c.env.JWT_SECRET, token);

  if (requiresCsrf(c.req.method)) {
    const csrfHeader = c.req.header("X-CSRF-Token") ?? "";
    const csrfCookie = readCsrfCookie(c);
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      throw new HTTPException(403, { message: "Invalid CSRF token" });
    }
  }

  c.set("userId", payload.sub);
  c.set("userEmail", payload.email);

  await next();
});
