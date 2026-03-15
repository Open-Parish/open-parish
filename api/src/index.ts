import { Hono } from "hono";
import { authRoutes } from "./domains/auth/auth.routes";
import { certificateRoutes } from "./domains/certificates/certificates.routes";
import { settingsRoutes } from "./domains/settings/settings.routes";
import { uploadRoutes } from "./domains/uploads/uploads.routes";
import { peopleRoutes } from "./domains/people/people.routes";
import type { Env } from "./index.types";
import { ensureDevSeed } from "./shared/lib/devSeed";
import { assertRuntimeSecurity } from "./shared/lib/runtimeGuards";
import { errorMessageFromUnknown } from "./shared/utils/errorMessageFromUnknown";
import { isHttpException } from "./shared/utils/typeGuards";
export type { Env } from "./index.types";

const app = new Hono<Env>({ strict: false });

const DEFAULT_DEV_CORS_ORIGIN_PATTERNS = [
  /^http:\/\/127\.0\.0\.1:\d+$/,
  /^http:\/\/localhost:\d+$/,
];

function parseAllowedOrigins(env: Env["Bindings"]): Set<string> {
  const configured = (env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (configured.length > 0) {
    return new Set(configured);
  }

  const isProduction =
    env.NODE_ENV === "production" || env.APP_ENV === "production";
  return isProduction ? new Set() : new Set();
}

function isAllowedOrigin(origin: string, env: Env["Bindings"]): boolean {
  const allowedOrigins = parseAllowedOrigins(env);
  if (allowedOrigins.has(origin)) {
    return true;
  }

  const isProduction =
    env.NODE_ENV === "production" || env.APP_ENV === "production";
  if (isProduction) {
    return false;
  }

  return DEFAULT_DEV_CORS_ORIGIN_PATTERNS.some((pattern) =>
    pattern.test(origin),
  );
}

function applyCorsHeaders(headers: Headers, origin: string): void {
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CSRF-Token",
  );
  headers.set("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, OPTIONS");
  headers.append("Vary", "Origin");
}

app.use("*", async (c, next) => {
  const origin = c.req.header("Origin") ?? "";
  const originAllowed = origin !== "" && isAllowedOrigin(origin, c.env);

  if (c.req.method === "OPTIONS") {
    if (origin && !originAllowed) {
      return c.json({ message: "Origin not allowed", statusCode: 403 }, 403);
    }

    const headers = new Headers();
    if (originAllowed) {
      applyCorsHeaders(headers, origin);
    }
    return new Response(null, { status: 204, headers });
  }

  await next();

  if (originAllowed) {
    applyCorsHeaders(c.res.headers, origin);
  }
});

app.use("*", async (c, next) => {
  assertRuntimeSecurity(c.env);
  await ensureDevSeed(c.env);
  await next();
});

app.get("/status", (c) =>
  c.json({ message: "API running on Cloudflare Worker" }),
);

app.route("/", authRoutes);
app.route("/", certificateRoutes);
app.route("/", settingsRoutes);
app.route("/", uploadRoutes);
app.route("/", peopleRoutes);

app.notFound((c) => c.json({ error: true, message: "404 not found" }, 404));

app.onError((err, c) => {
  if (isHttpException(err)) {
    return c.json(
      {
        message: err.message || "Request failed",
        statusCode: err.status,
      },
      err.status,
    );
  }

  return c.json(
    {
      message: "Internal server error",
      statusCode: 500,
      ...(String(c.env.NODE_ENV ?? c.env.APP_ENV ?? "").trim().toLowerCase() ===
      "production"
        ? {}
        : { details: errorMessageFromUnknown(err) }),
    },
    500,
  );
});

export default app;
