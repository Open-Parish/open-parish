import { HTTPException } from "hono/http-exception";
import { createJwt } from "../../shared/lib/security/jwt";
import { hashPassword, verifyPassword } from "../../shared/lib/security/password";
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

export async function changeUserPassword(
  db: D1Database,
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await db
    .prepare("SELECT id, password_hash FROM users WHERE id = ?")
    .bind(userId)
    .first<{ id: string; password_hash: string }>();

  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  const valid = await verifyPassword(currentPassword, user.password_hash);
  if (!valid) {
    throw new HTTPException(422, { message: "Current password is incorrect" });
  }

  const newHash = await hashPassword(newPassword);
  await db
    .prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .bind(newHash, userId)
    .run();
}
