import type { Context } from "hono";
import type { Env } from "../../index.types";
import { getInstallStatus, markSystemInstalled } from "./install.service";

export async function getInstallStatusController(c: Context<Env>) {
  return c.json(await getInstallStatus(c.env.DB));
}

export async function markSystemInstalledController(c: Context<Env>) {
  await markSystemInstalled(c.env.DB);
  return c.json({ message: "System installed" });
}
