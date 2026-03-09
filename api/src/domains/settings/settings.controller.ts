import type { Context } from "hono";
import type { Env } from "../../index.types";
import {
  getValidatedFormData,
  getValidatedJson,
} from "../../shared/middlewares/validate";
import { asRecord } from "../../shared/utils/normalize";
import { changePasswordSchema, settingsFormSchema } from "./settings.schema";
import {
  changeUserPassword,
  getSettings,
  updateSettings,
} from "./settings.service";

export async function getSettingsController(c: Context<Env>) {
  const settings = await getSettings(c.env.DB);
  return c.json(settings);
}

export async function updateSettingsController(c: Context<Env>) {
  const body = getValidatedFormData<typeof settingsFormSchema>(c);
  const nextSettings = await updateSettings(c.env, asRecord(body));
  return c.json(nextSettings);
}

export async function changePasswordController(c: Context<Env>) {
  const payload = getValidatedJson<typeof changePasswordSchema>(c);
  await changeUserPassword(
    c.env.DB,
    c.get("userId"),
    payload.currentPassword,
    payload.newPassword,
  );

  return c.json({ message: true });
}
