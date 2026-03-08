export type UploadImageVariant = {
  url: string;
  fullUrl?: string;
  width: number;
  height: number;
  type: string;
  size: number;
};

export type UploadImageOriginal = {
  url: string;
  fullUrl?: string;
  width: number;
  height: number;
  type: string;
  size: number;
};

export type UploadImageItem = {
  id: string;
  name: string;
  original: UploadImageOriginal;
  variants: UploadImageVariant[];
};

export type UploadImagesResponse = {
  items: UploadImageItem[];
};
