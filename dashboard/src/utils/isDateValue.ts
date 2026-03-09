export function isDateValue(value?: unknown): value is Date {
  return value instanceof Date;
}
