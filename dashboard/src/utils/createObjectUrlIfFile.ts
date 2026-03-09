import { isFileValue } from './isFileValue';

export function createObjectUrlIfFile(value?: unknown): string {
  if (!isFileValue(value)) return '';
  return URL.createObjectURL(value);
}
