'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface SupabaseContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  supabase: typeof supabase;
}

interface AdminUser {
  id: string;
  login: string;
  password: string;
  full_name?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

const SupabaseContext = createContext<SupabaseContextProps | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const setData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Sign in attempt:', { email, password });
      
      // Check if user exists in users_with_auth table with matching credentials
      const { data: user, error: queryError } = await supabase
        .from('users_with_auth')
        .select('*')
        .eq('login', email)
        .single();
      
      console.log('Query result:', { user, error: queryError });
      
      if (queryError || !user) {
        return { error: { message: 'Invalid email or password' } };
      }
      
      // Verify password (using plain text comparison - not recommended for production)
      if (user.password !== password) {
        return { error: { message: 'Invalid email or password' } };
      }
      
      // Update last_login timestamp
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('users_with_auth')
        .update({ last_login: now })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error updating last_login:', updateError);
        // Continue anyway, this is not a critical error
      }
      
      // Create a custom user object
      const customUser = {
        id: user.id,
        email: user.login,
        user_metadata: {
          full_name: user.full_name || ''
        }
      };
      
      // Set custom user in state (no session needed)
      setUser(customUser as unknown as User);
      setSession({ access_token: 'custom_token', refresh_token: '' } as unknown as Session);
      
      return { data: { user } };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signOut = async () => {
    // No need to call Supabase Auth signOut, just clear our state
    setUser(null);
    setSession(null);
    return { error: null };
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
    supabase,
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
} 