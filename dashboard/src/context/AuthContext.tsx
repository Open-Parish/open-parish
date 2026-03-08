import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { postJson } from '@/api/client';
import { clearSession, getSessionEmail, getToken, isAuthenticated, setSession } from '@/lib/session';

type LoginPayload = { email: string; password: string };
type LoginResponse = { token: string; user?: { email?: string } };

type AuthContextValue = {
  token: string | null;
  email: string;
  authenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [email, setEmail] = useState<string>(getSessionEmail());

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await postJson<LoginResponse>('/login', payload);
    const nextEmail = response.user?.email ?? payload.email;
    setSession(response.token, nextEmail);
    setToken(response.token);
    setEmail(nextEmail);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setToken(null);
    setEmail('Admin');
  }, []);

  const value = useMemo(
    () => ({ token, email, authenticated: isAuthenticated(), login, logout }),
    [email, login, logout, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
