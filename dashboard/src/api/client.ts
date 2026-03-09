import has from 'lodash/has';
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';
import { notifications } from '@mantine/notifications';
import type { RequestOptions } from './client.types';
import { API_BASE_URL } from '@/config';
import { clearSession, getToken } from '@/lib/session';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const buildUrl = (path: string) => (path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`);

const showGlobalErrorNotification = (status: number, message: string) => {
  if (status === 401) return;

  if (status === 422) {
    notifications.show({
      title: 'Warning',
      message,
      color: 'yellow',
    });
    return;
  }

  notifications.show({
    title: 'Error',
    message,
    color: 'red',
  });
};

const handleUnauthorized = async () => {
  clearSession();
  if (window.location.pathname === '/login') return;
  window.location.assign('/login');
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    await handleUnauthorized();
  }

  if (response.status === 204) {
    return null as unknown as T;
  }

  let payload: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const payloadMessage =
      isObjectLike(payload) && has(payload, 'message') ? (payload as { message?: unknown }).message : null;
    const message = (isString(payloadMessage) ? payloadMessage : null) ?? response.statusText ?? 'Request failed';

    showGlobalErrorNotification(response.status, message);
    throw new ApiError(message, response.status);
  }

  return (payload as T) ?? (null as T);
}

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;
  const headers: Record<string, string> = {};
  const token = getToken();
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(response);
}

export const getJson = <T>(path: string) => requestJson<T>(path, { method: 'GET' });
export const postJson = <T>(path: string, body: unknown) => requestJson<T>(path, { method: 'POST', body });
export const putJson = <T>(path: string, body: unknown) => requestJson<T>(path, { method: 'PUT', body });
export const deleteJson = <T>(path: string) => requestJson<T>(path, { method: 'DELETE' });
export const resolveApiUrl = (path: string) => buildUrl(path);

export const postFormData = async <T>(path: string, formData: FormData): Promise<T> => {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path), {
    method: 'POST',
    headers,
    body: formData,
  });

  return parseResponse<T>(response);
};
