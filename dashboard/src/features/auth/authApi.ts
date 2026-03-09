import { getJson, putJson } from '@/api/client';

export type UserProfile = {
  user: { id: string; email: string };
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
};

export function getProfile() {
  return getJson<UserProfile>('/users/profile');
}

export function changePassword(payload: ChangePasswordPayload) {
  return putJson<{ message: string }>('/users/password', payload);
}
