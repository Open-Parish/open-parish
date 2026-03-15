import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { Env } from "../../index.types";

const DEV_AUTH_COOKIE_NAME = "open_parish_auth";
const DEV_CSRF_COOKIE_NAME = "open_parish_csrf";
const PROD_AUTH_COOKIE_NAME = "__Host-open_parish_auth";
const PROD_CSRF_COOKIE_NAME = "__Host-open_parish_csrf";

function isProduction(env: Env["Bindings"]): boolean {
  return env.NODE_ENV === "production" || env.APP_ENV === "production";
}

function authCookieName(env: Env["Bindings"]): string {
  return isProduction(env) ? PROD_AUTH_COOKIE_NAME : DEV_AUTH_COOKIE_NAME;
}

function csrfCookieName(env: Env["Bindings"]): string {
  return isProduction(env) ? PROD_CSRF_COOKIE_NAME : DEV_CSRF_COOKIE_NAME;
}

export function setAuthCookie(c: Context<Env>, token: string): void {
  setCookie(c, authCookieName(c.env), token, {
    httpOnly: true,
    path: "/",
    sameSite: isProduction(c.env) ? "Strict" : "Lax",
    secure: isProduction(c.env),
    maxAge: 60 * 60 * 24 * 14,
  });
}

export function clearAuthCookie(c: Context<Env>): void {
  deleteCookie(c, authCookieName(c.env), {
    httpOnly: true,
    path: "/",
    sameSite: isProduction(c.env) ? "Strict" : "Lax",
    secure: isProduction(c.env),
  });
}

export function readAuthCookie(c: Context<Env>): string {
  return getCookie(c, authCookieName(c.env)) ?? "";
}

export function ensureCsrfCookie(c: Context<Env>): string {
  const existing = getCookie(c, csrfCookieName(c.env));
  if (existing) {
    return existing;
  }

  const token = crypto.randomUUID();
  setCookie(c, csrfCookieName(c.env), token, {
    httpOnly: false,
    path: "/",
    sameSite: isProduction(c.env) ? "Strict" : "Lax",
    secure: isProduction(c.env),
    maxAge: 60 * 60 * 24 * 14,
  });
  return token;
}

export function clearCsrfCookie(c: Context<Env>): void {
  deleteCookie(c, csrfCookieName(c.env), {
    httpOnly: false,
    path: "/",
    sameSite: isProduction(c.env) ? "Strict" : "Lax",
    secure: isProduction(c.env),
  });
}

export function readCsrfCookie(c: Context<Env>): string {
  return getCookie(c, csrfCookieName(c.env)) ?? "";
}
