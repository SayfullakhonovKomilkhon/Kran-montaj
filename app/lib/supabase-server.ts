import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcwxaxysuoslhspsnnfy.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jd3hheHlzdW9zbGhzcHNubmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDI1NTYsImV4cCI6MjA2MjYxODU1Nn0.a55WRVX8xbrR0m6sNBLRETMnd35cA-jjWNqXmc5W-wA',
    {
      cookies: {
        get(name) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name, value, options) {
          try {
            // Next.js cookies() doesn't support directly setting cookies in middleware
            // This is normally used by Supabase Auth and should work on the client
            cookieStore.set(name, value);
          } catch (error) {
            // Ignore errors during static rendering or middleware
          }
        },
        remove(name, options) {
          try {
            cookieStore.delete(name);
          } catch (error) {
            // Ignore errors during static rendering or middleware
          }
        },
      },
    }
  );
} 