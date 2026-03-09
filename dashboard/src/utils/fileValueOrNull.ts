import { isFileValue } from './isFileValue';

export function fileValueOrNull(value?: unknown): File | null {
  if (!isFileValue(value)) return null;
  return value;
}
