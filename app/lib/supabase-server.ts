import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerSupabaseClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rgpdolopvlfdiutwlvow.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncGRvbG9wdmxmZGl1dHdsdm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzg2MzEsImV4cCI6MjA3OTkxNDYzMX0.aXW3FbtyBik86D22UOvKmMmywMa1RkpqOF360JmNzyE',
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