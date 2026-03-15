import { getJson, putJson } from '@/api/client';
import type { ChangePasswordPayload, UserProfile } from './authApi.types';

export function getProfile() {
  return getJson<UserProfile>('/users/profile');
}

export function changePassword(payload: ChangePasswordPayload) {
  return putJson<{ message: string }>('/users/password', payload);
}
