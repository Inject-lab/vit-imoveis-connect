import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  checkAdminRole: (userId: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  loading: true,

  checkAdminRole: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) throw error;
      const isAdmin = !!data;
      set({ isAdmin });
      return isAdmin;
    } catch (error) {
      console.error('Error checking admin role:', error);
      set({ isAdmin: false });
      return false;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const isAdmin = await get().checkAdminRole(data.user.id);
        
        if (!isAdmin) {
          await supabase.auth.signOut();
          return { success: false, error: 'Acesso negado. Apenas administradores podem fazer login.' };
        }

        set({ 
          isAuthenticated: true, 
          user: data.user,
          isAdmin: true
        });
        return { success: true };
      }

      return { success: false, error: 'Erro ao fazer login' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Credenciais inválidas' 
      };
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, user: null, isAdmin: false });
  },

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const isAdmin = await get().checkAdminRole(session.user.id);
        set({ 
          isAuthenticated: true, 
          user: session.user,
          isAdmin,
          loading: false
        });
      } else {
        set({ 
          isAuthenticated: false, 
          user: null, 
          isAdmin: false,
          loading: false
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ 
        isAuthenticated: false, 
        user: null, 
        isAdmin: false,
        loading: false
      });
    }
  },
}));
