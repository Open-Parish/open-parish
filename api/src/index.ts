import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./domains/auth/auth.routes";
import { certificateRoutes } from "./domains/certificates/certificates.routes";
import { settingsRoutes } from "./domains/settings/settings.routes";
import { uploadRoutes } from "./domains/uploads/uploads.routes";
import { peopleRoutes } from "./domains/people/people.routes";
import { installRoutes } from "./domains/install/install.routes";
import type { Env } from "./index.types";
import { errorMessageFromUnknown } from "./shared/utils/errorMessageFromUnknown";
import { isHttpException } from "./shared/utils/typeGuards";
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
app.route("/", installRoutes);

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
      details: errorMessageFromUnknown(err),
    },
    500,
  );
});

export default app;
