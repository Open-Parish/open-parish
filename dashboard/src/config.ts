export const DEFAULT_OWNER_EMAIL = import.meta.env.VITE_DEFAULT_OWNER_EMAIL ?? import.meta.env.DEFAULT_OWNER_EMAIL;
export const DEFAULT_OWNER_PASSWORD =
  import.meta.env.VITE_DEFAULT_OWNER_PASSWORD ?? import.meta.env.DEFAULT_OWNER_PASSWORD;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8787';

export const DEV_DEFAULT_OWNER_EMAIL = import.meta.env.DEV ? (DEFAULT_OWNER_EMAIL ?? 'email@admin.com') : undefined;
export const DEV_DEFAULT_OWNER_PASSWORD = import.meta.env.DEV ? (DEFAULT_OWNER_PASSWORD ?? 'password') : undefined;
