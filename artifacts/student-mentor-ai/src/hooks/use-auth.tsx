import { useState } from 'react';

export type AuthRole = 'student' | 'teacher' | 'admin';

export type AuthState = {
  token: string;
  role: AuthRole;
};

export function useAuth() {
  const [user, setUser] = useState<AuthState | null>(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.token && parsed.role) {
          return parsed as AuthState;
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (data: AuthState) => {
    localStorage.setItem('auth', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
  };

  return { user, login, logout };
}
