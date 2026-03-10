const TOKEN_KEY = 'open_parish_auth_token';
const EMAIL_KEY = 'open_parish_auth_email';

function readStorageItem(key: string): string {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return '';
  }
  return globalThis.localStorage.getItem(key) ?? '';
}

function writeStorageItem(key: string, value: string): void {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return;
  }
  globalThis.localStorage.setItem(key, value);
}

function removeStorageItem(key: string): void {
  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return;
  }
  globalThis.localStorage.removeItem(key);
}

export function getToken(): string | null {
  const token = readStorageItem(TOKEN_KEY);
  return token.length > 0 ? token : null;
}

export function getSessionEmail(): string {
  return readStorageItem(EMAIL_KEY) || 'Admin';
}

export function setSession(token: string, email: string): void {
  writeStorageItem(TOKEN_KEY, token);
  writeStorageItem(EMAIL_KEY, email);
}

export function clearSession(): void {
  removeStorageItem(TOKEN_KEY);
  removeStorageItem(EMAIL_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
