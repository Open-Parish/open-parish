import { compare, hash } from "bcryptjs";

const BCRYPT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  return compare(password, storedHash);
}
