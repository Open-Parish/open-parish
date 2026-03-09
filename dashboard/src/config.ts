export const DEFAULT_OWNER_EMAIL = import.meta.env.VITE_DEFAULT_OWNER_EMAIL ?? import.meta.env.DEFAULT_OWNER_EMAIL;
export const DEFAULT_OWNER_PASSWORD =
  import.meta.env.VITE_DEFAULT_OWNER_PASSWORD ?? import.meta.env.DEFAULT_OWNER_PASSWORD;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8787';
export const PAGE_SIZE = 20;

export const DEV_DEFAULT_OWNER_EMAIL = import.meta.env.DEV ? (DEFAULT_OWNER_EMAIL ?? 'email@admin.com') : undefined;
export const DEV_DEFAULT_OWNER_PASSWORD = import.meta.env.DEV ? (DEFAULT_OWNER_PASSWORD ?? 'password') : undefined;

export const COLOR_SWATCHES = [
  '#0f172a',
  '#1e293b',
  '#334155',
  '#1c7ed6',
  '#1971c2',
  '#0c8599',
  '#099268',
  '#2f9e44',
  '#e8590c',
  '#c2255c',
  '#9c36b5',
  '#6741d9',
];
