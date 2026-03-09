export type LoginPayload = { email: string; password: string };
export type LoginResponse = { token: string; user?: { email?: string } };

export type AuthContextValue = {
  token: string | null;
  email: string;
  authenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};
