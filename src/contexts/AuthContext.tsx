import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.access_token) {
        localStorage.setItem('trigantara_admin_token', s.access_token);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.access_token) {
          localStorage.setItem('trigantara_admin_token', s.access_token);
        } else {
          localStorage.removeItem('trigantara_admin_token');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = !!user;

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return {};
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error during signOut:', err);
    } finally {
      localStorage.removeItem('trigantara_admin_token');
      setSession(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return ctx;
}
