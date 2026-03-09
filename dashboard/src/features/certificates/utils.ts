import { format } from 'date-fns';
import { normalizeText } from '@/utils/normalizeText';

export function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (typeof current !== 'object' || current === null) return undefined;
    return (current as Record<string, unknown>)[key];
  }, obj);
}

export function setByPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const next = structuredClone(obj);
  const keys = path.split('.');
  let cursor: Record<string, unknown> = next;

  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    const existing = cursor[key];
    if (typeof existing !== 'object' || existing === null) {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  }

  cursor[keys[keys.length - 1]] = value;
  return next;
}

export function friendlyDate(value: unknown): string {
  if (!value) return '-';
  const date = new Date(normalizeText(value));
  if (Number.isNaN(date.getTime())) return '-';
  return format(date, 'MMM dd, yyyy');
}
