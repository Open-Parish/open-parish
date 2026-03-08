import { postFormData } from '@/api/client';
import type { UploadImagesResponse } from './uploadApi.types';

export const uploadImages = (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });
  return postFormData<UploadImagesResponse>('/api/protected/upload/images', formData);
};
