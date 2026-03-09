import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { authRoutes } from "./domains/auth/auth.routes";
import { certificateRoutes } from "./domains/certificates/certificates.routes";
import { settingsRoutes } from "./domains/settings/settings.routes";
import { uploadRoutes } from "./domains/uploads/uploads.routes";
import { peopleRoutes } from "./domains/people/people.routes";
import type { Env } from "./index.types";
export type { Env } from "./index.types";

const app = new Hono<Env>({ strict: false });

app.use("*", cors());

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
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json(
    {
      error: true,
      message: "Internal server error",
      details: err instanceof Error ? err.message : String(err),
    },
    500,
  );
});

export default app;
