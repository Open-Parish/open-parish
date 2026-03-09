import type { Context } from "hono";
import type { Env } from "../../index.types";
import { getInstallStatus } from "./install.service";

export async function getInstallStatusController(c: Context<Env>) {
  const status = await getInstallStatus(c.env.DB);
  return c.json(status);
}
