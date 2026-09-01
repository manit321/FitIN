import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthService } from '../services/authService';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: typeof AuthService.signIn;
  signUp: typeof AuthService.signUp;
  signOut: typeof AuthService.signOut;
  resetPasswordForEmail: typeof AuthService.resetPasswordForEmail;
  updatePassword: typeof AuthService.updatePassword;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured yet, fallback to offline demo mode
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    // 1. Check existing session on boot
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 2. Listen to real-time auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, pass: string) => {
    const res = await AuthService.signIn(email, pass);
    if (res.session) {
      setSession(res.session);
      setUser(res.user);
    }
    return res;
  }, []);

  const signUp = useCallback(async (email: string, pass: string, fullName?: string) => {
    const res = await AuthService.signUp(email, pass, fullName);
    if (res.session) {
      setSession(res.session);
      setUser(res.user);
    }
    return res;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await AuthService.signOut();
    } catch (err) {
      console.warn('Error during signOut:', err);
    } finally {
      setSession(null);
      setUser(null);
    }
    return { error: null };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        signIn,
        signUp,
        signOut,
        resetPasswordForEmail: AuthService.resetPasswordForEmail,
        updatePassword: AuthService.updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
