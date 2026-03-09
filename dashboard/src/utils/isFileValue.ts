export function isFileValue(value?: unknown): value is File {
  return value instanceof File;
}
