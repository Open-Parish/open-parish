export type LoginPayload = { email: string; password: string };
export type LoginResponse = { user?: { id?: string; email?: string }; csrfToken: string };

export type AuthContextValue = {
  email: string;
  authenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};
