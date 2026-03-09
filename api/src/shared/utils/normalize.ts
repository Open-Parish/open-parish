import { isDateValue } from "./typeGuards";

export function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }
  if (isDateValue(value)) return value.toISOString();
  return fallback;
}

export function asTrimmedLowercase(value: unknown): string {
  return asString(value).trim().toLowerCase();
}

export function asTrimmedString(value: unknown): string {
  return asString(value).trim();
}

export function asPositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

export function asNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return parsed;
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function parseJsonObjectString(value: unknown): Record<string, unknown> {
  if (typeof value !== "string" || !value.trim()) return {};

  try {
    const parsed = JSON.parse(value);
    return asRecord(parsed);
  } catch {
    return {};
  }
}
