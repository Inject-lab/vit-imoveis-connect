import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    email: string;
    name: string;
  } | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_CREDENTIALS = {
  email: 'admin@silviovitoria.com',
  password: 'silvio2024',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      
      login: (email: string, password: string) => {
        if (
          email === ADMIN_CREDENTIALS.email &&
          password === ADMIN_CREDENTIALS.password
        ) {
          const token = btoa(`${email}:${Date.now()}`);
          set({
            isAuthenticated: true,
            token,
            user: { email, name: 'Admin' },
          });
          return true;
        }
        return false;
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
