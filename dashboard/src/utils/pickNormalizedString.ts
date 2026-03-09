import { normalizeText } from './normalizeText';

export function pickNormalizedString(primary?: unknown, fallback?: unknown, defaultValue = ''): string {
  const primaryValue = normalizeText(primary).trim();
  if (primaryValue) return primaryValue;

  const fallbackValue = normalizeText(fallback).trim();
  if (fallbackValue) return fallbackValue;

  return defaultValue;
}
