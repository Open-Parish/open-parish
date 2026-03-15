import { normalizeText } from './normalizeText';

export function hasNormalizedText(value: unknown): boolean {
  return normalizeText(value).trim().length > 0;
}
