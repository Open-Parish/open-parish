import { asTrimmedString } from "./normalize";

export function pickString(
  primary?: unknown,
  fallback?: unknown,
  defaultValue = "",
): string {
  const primaryValue = asTrimmedString(primary);
  if (primaryValue) return primaryValue;

  const fallbackValue = asTrimmedString(fallback);
  if (fallbackValue) return fallbackValue;

  return defaultValue;
}
