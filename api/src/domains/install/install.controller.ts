import type { Context } from "hono";
import type { Env } from "../../index.types";
import { getValidatedJson } from "../../shared/middlewares/validate";
import { installBootstrapSchema } from "./install.schema";
import {
  bootstrapInstall,
  getInstallStatus,
  markSystemInstalled,
} from "./install.service";

export async function getInstallStatusController(c: Context<Env>) {
  return c.json(await getInstallStatus(c.env.DB));
}

export async function markSystemInstalledController(c: Context<Env>) {
  await markSystemInstalled(c.env.DB);
  return c.json({ message: "System installed" });
}

export async function bootstrapInstallController(c: Context<Env>) {
  const payload = getValidatedJson<typeof installBootstrapSchema>(c);
  return c.json(await bootstrapInstall(c.env.DB, payload));
}
