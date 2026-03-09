import { isErrorValue } from "./typeGuards";

export function errorMessageFromUnknown(value?: unknown): string {
  if (!isErrorValue(value)) return "Unknown error";
  return value.message;
}
