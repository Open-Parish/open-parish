export type UserProfile = {
  user: { id: string; email: string };
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
};
