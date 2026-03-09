import { isDateValue } from './isDateValue';

export function normalizeText(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  if (isDateValue(value)) return value.toISOString();
  return fallback;
}
