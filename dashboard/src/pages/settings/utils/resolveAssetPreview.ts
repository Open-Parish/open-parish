import { resolveApiUrl } from '@/api/client';
import { normalizeText } from '@/utils/normalizeText';
import { withAuthToken } from './withAuthToken';

export function resolveAssetPreview(value: string, authToken?: string | null): string {
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
    return withAuthToken(resolveApiUrl(trimmed), authToken);
  }

  return withAuthToken(resolveApiUrl(`/${trimmed}`), authToken);
}
