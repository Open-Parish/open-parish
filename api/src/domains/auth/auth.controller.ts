import type { Context } from "hono";
import type { Env } from "../../index.types";
import { getValidatedJson } from "../../shared/middlewares/validate";
import { authSchema } from "./auth.schema";
import { loginUser } from "./auth.service";

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
    message: "You made it to the secure route",
    user: { id: c.get("userId"), email: c.get("userEmail") },
  });
}
