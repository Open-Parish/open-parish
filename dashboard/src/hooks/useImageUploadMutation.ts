import { useMutation } from '@tanstack/react-query';
import { uploadImages } from '@/services/uploadApi';
import type { UploadImagesInput } from './useImageUploadMutation.types';

export const useImageUploadMutation = () =>
  useMutation({
    mutationFn: ({ files }: UploadImagesInput) => uploadImages(files),
  });
