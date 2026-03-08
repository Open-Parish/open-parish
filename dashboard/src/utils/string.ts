export const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const safeTrim = (value?: string | null, fallback = ''): string => {
  const trimmed = value?.trim();
  return trimmed || fallback;
};
