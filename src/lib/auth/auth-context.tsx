// =====================================================
// PCMS - Auth Context Provider
// Provides auth state to entire app via React Context
// =====================================================

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, AuthUser, LoginRequest } from '@/types';
import { getCurrentUser, login as authLogin, logout as authLogout } from './auth';

const AuthContext = createContext<{
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
} | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    hydrated: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const user = getCurrentUser();
    setState({
      user,
      accessToken: typeof window !== 'undefined' ? localStorage.getItem('pcms_access_token') : null,
      refreshToken: typeof window !== 'undefined' ? localStorage.getItem('pcms_refresh_token') : null,
      isAuthenticated: user !== null,
      hydrated: true,
    });
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authLogin(credentials);
    setState({
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      hydrated: true,
    });
  };

  const logout = () => {
    authLogout();
    setState({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, hydrated: true });
  };

  const setUser = (user: AuthUser | null) => {
    setState((s) => ({ ...s, user, isAuthenticated: user !== null, hydrated: true }));
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
