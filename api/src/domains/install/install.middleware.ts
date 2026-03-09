import { HTTPException } from "hono/http-exception";
import type { MiddlewareHandler } from "hono";
import type { Env } from "../../index.types";
import { getInstallStatus } from "./install.service";

export const requireNotInstalled: MiddlewareHandler<Env> = async (c, next) => {
  const status = await getInstallStatus(c.env.DB);
  if (status.isInstalled) {
    throw new HTTPException(404, { message: "Not found" });
  }
  await next();
};
