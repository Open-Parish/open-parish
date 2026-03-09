import type { Context } from "hono";
import type { Env } from "../../index.types";
import { getValidatedJson } from "../../shared/middlewares/validate";
import { authSchema, changePasswordSchema } from "./auth.schema";
import { changeUserPassword, loginUser } from "./auth.service";

export async function registerController(c: Context<Env>) {
  return c.json({ message: "Registration is disabled" }, 403);
}

export async function loginController(c: Context<Env>) {
  const payload = getValidatedJson<typeof authSchema>(c);
  const result = await loginUser(
    c.env.DB,
    c.env.JWT_SECRET,
    payload.email,
    payload.password,
  );
  return c.json(result);
}

export async function profileController(c: Context<Env>) {
  return c.json({
    user: { id: c.get("userId"), email: c.get("userEmail") },
  });
}

export async function changePasswordController(c: Context<Env>) {
  const payload = getValidatedJson<typeof changePasswordSchema>(c);
  await changeUserPassword(
    c.env.DB,
    c.get("userId"),
    payload.currentPassword,
    payload.newPassword,
  );
  return c.json({ message: "Password updated successfully" });
}
