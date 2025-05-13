import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    // Execute SQL to alter users table
    const { error } = await supabase.rpc('execute_sql', {
      sql_query: `
        ALTER TABLE public.users
        ADD COLUMN IF NOT EXISTS full_name TEXT,
        ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
      `
    });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ success: true, message: 'Users table updated successfully' });
  } catch (error) {
    console.error('Error updating users table:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update users table' },
      { status: 500 }
    );
  }
} 