import { HTTPException } from "hono/http-exception";
import { createJwt } from "../../shared/lib/security/jwt";
import { verifyPassword } from "../../shared/lib/security/password";
import { asTrimmedLowercase } from "../../shared/utils/normalize";

export async function loginUser(
  db: D1Database,
  jwtSecret: string,
  emailInput: string,
  password: string,
) {
  const email = asTrimmedLowercase(emailInput);

  const user = await db
    .prepare("SELECT id, email, password_hash FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: string; email: string; password_hash: string }>();

  if (!user) {
    throw new HTTPException(422, { message: "Invalid credentials" });
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    throw new HTTPException(422, { message: "Invalid credentials" });
  }

  const token = await createJwt(jwtSecret, {
    id: user.id,
    email: user.email,
  });

  return { token, user: { id: user.id, email: user.email } };
}
