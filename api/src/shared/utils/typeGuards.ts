import { HTTPException } from "hono/http-exception";

export function isDateValue(value?: unknown): value is Date {
  return value instanceof Date;
}

export function isFileValue(value?: unknown): value is File {
  return value instanceof File;
}

export function isHttpException(value?: unknown): value is HTTPException {
  return value instanceof HTTPException;
}

export function isErrorValue(value?: unknown): value is Error {
  return value instanceof Error;
}
