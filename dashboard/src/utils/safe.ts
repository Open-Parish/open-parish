export const safeString = (v: unknown, fallback = ''): string =>
  typeof v === 'string' ? v : fallback;

export const safeTrimmedString = (v: unknown, fallback = ''): string =>
  safeString(v, fallback).trim();

export const safeLowerTrimmedString = (v: unknown, fallback = ''): string =>
  safeTrimmedString(v, fallback).toLowerCase();

export const safeNullableTrimmedString = (v: unknown): string | null => {
  const normalized = safeTrimmedString(v);
  return normalized.length > 0 ? normalized : null;
};

export const safeNullableLowerTrimmedString = (v: unknown): string | null => {
  const normalized = safeNullableTrimmedString(v);
  return normalized ? normalized.toLowerCase() : null;
};

export const safeNumber = (v: unknown, fallback = 0): number =>
  typeof v === 'number' && !Number.isNaN(v) ? v : fallback;

export const safeBoolean = (v: unknown, fallback = false): boolean =>
  typeof v === 'boolean' ? v : fallback;

export const safeArray = <T = unknown>(v: unknown, fallback: T[] = []): T[] =>
  Array.isArray(v) ? (v as T[]) : fallback;

export const safeObject = <T extends object = Record<string, unknown>>(
  v: unknown,
  fallback = {} as T,
): T =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
    ? (v as T)
    : fallback;

export const isStringValue = (v: unknown): v is string => typeof v === 'string';

export const isNumberValue = (v: unknown): v is number =>
  typeof v === 'number' && !Number.isNaN(v);

export const toOptionalString = (v: unknown): string | undefined =>
  isStringValue(v) ? v : undefined;

export const toNullableString = (v: unknown): string | null =>
  isStringValue(v) ? v : null;

export const toOptionalNumber = (v: unknown): number | undefined =>
  isNumberValue(v) ? v : undefined;

export const toNullableNumber = (v: unknown): number | null =>
  isNumberValue(v) ? v : null;
