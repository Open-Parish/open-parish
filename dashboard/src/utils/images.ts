import type { UploadImageItem } from '@/services/uploadApi.types';

const DEFAULT_PREFERRED_WIDTHS = [640, 320];

export const getPreferredImageUrl = (
  item: UploadImageItem | null | undefined,
  preferredWidths: number[] = DEFAULT_PREFERRED_WIDTHS,
) => {
  if (!item) return undefined;
  const variants = item.variants ?? [];
  const match = preferredWidths
    .map((width) => variants.find((variant) => variant.width === width))
    .find((variant) => variant?.fullUrl);
  return match?.fullUrl ?? item.original?.fullUrl;
};
