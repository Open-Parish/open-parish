import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { clearCsrfToken, postJson, setCsrfToken } from '@/api/client';
import { getProfile } from '@/features/auth/authApi';
import type { AuthContextValue, LoginPayload, LoginResponse } from './AuthContext.types';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>('Admin');

  useEffect(() => {
    let active = true;

    void getProfile()
      .then((response) => {
        if (!active) return;
        setCsrfToken(response.csrfToken);
        setAuthenticated(true);
        setEmail(response.user.email || 'Admin');
      })
      .catch(() => {
        if (!active) return;
        clearCsrfToken();
        setAuthenticated(false);
        setEmail('Admin');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await postJson<LoginResponse>('/login', payload);
    const nextEmail = response.user?.email ?? payload.email;
    setCsrfToken(response.csrfToken);
    setAuthenticated(true);
    setEmail(nextEmail);
  }, []);

  const logout = useCallback(() => {
    void postJson<{ success: boolean }>('/logout', {});
    clearCsrfToken();
    setAuthenticated(false);
    setEmail('Admin');
  }, []);

  const value = useMemo(
    () => ({ email, authenticated, loading, login, logout }),
    [authenticated, email, loading, login, logout],
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
