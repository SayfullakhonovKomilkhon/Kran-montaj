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
}

interface AdminUser {
  id: string;
  email: string;
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
      // Check if user exists in users table with matching credentials
      const { data: user, error: queryError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
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
        .from('users')
        .update({ last_login: now })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error updating last_login:', updateError);
        // Continue anyway, this is not a critical error
      }
      
      // Create a session with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        return { error };
      }
      
      // Set user in state
      setUser(data.user);
      setSession(data.session);
      
      return { data: { user } };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
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