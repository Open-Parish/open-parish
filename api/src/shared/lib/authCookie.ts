import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { Env } from "../../index.types";

export const AUTH_COOKIE_NAME = "open_parish_auth";
export const CSRF_COOKIE_NAME = "open_parish_csrf";

function isProduction(env: Env["Bindings"]): boolean {
  return env.NODE_ENV === "production" || env.APP_ENV === "production";
}

export function setAuthCookie(c: Context<Env>, token: string): void {
  setCookie(c, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure: isProduction(c.env),
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearAuthCookie(c: Context<Env>): void {
  deleteCookie(c, AUTH_COOKIE_NAME, {
    httpOnly: true,
    path: "/",
    sameSite: "Lax",
    secure: isProduction(c.env),
  });
}

export function readAuthCookie(c: Context<Env>): string {
  return getCookie(c, AUTH_COOKIE_NAME) ?? "";
}

export function ensureCsrfCookie(c: Context<Env>): string {
  const existing = getCookie(c, CSRF_COOKIE_NAME);
  if (existing) {
    return existing;
  }

  const token = crypto.randomUUID();
  setCookie(c, CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    path: "/",
    sameSite: "Lax",
    secure: isProduction(c.env),
    maxAge: 60 * 60 * 24 * 14,
  });
  return token;
}

export function clearCsrfCookie(c: Context<Env>): void {
  deleteCookie(c, CSRF_COOKIE_NAME, {
    httpOnly: false,
    path: "/",
    sameSite: "Lax",
    secure: isProduction(c.env),
  });
}

export function readCsrfCookie(c: Context<Env>): string {
  return getCookie(c, CSRF_COOKIE_NAME) ?? "";
}
