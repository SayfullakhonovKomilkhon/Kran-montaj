import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  
  // Create a cookies container
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mcwxaxysuoslhspsnnfy.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jd3hheHlzdW9zbGhzcHNubmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDI1NTYsImV4cCI6MjA2MjYxODU1Nn0.a55WRVX8xbrR0m6sNBLRETMnd35cA-jjWNqXmc5W-wA',
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set(name, value, options);
        },
        remove(name, options) {
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  // Refresh session if expired & still has refresh token
  const { data: { session } } = await supabase.auth.getSession();

  // If the user is not signed in and the current path is /admin, redirect to /admin/login
  if (!session && request.nextUrl.pathname.startsWith('/admin')) {
    // Don't redirect if already on the login page
    if (request.nextUrl.pathname !== '/admin/login') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // If the user is signed in and trying to access /admin, redirect to /admin/dashboard
  if (session && request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*'],
}; 