import { resolveApiUrl } from '@/api/client';
import { normalizeText } from '@/utils/normalizeText';

export function resolveAssetPreview(value: string): string {
  const trimmed = normalizeText(value).trim();
  if (!trimmed) return '';

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return resolveApiUrl(trimmed);
  }

  return resolveApiUrl(`/${trimmed}`);
}
