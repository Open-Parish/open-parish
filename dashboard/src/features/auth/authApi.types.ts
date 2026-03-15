export type UserProfile = {
  user: { id: string; email: string };
  csrfToken: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
};
