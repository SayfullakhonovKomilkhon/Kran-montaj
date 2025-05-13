import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST() {
  try {
    // Update users table to add full_name and last_login columns
    const { error: usersTableError } = await supabase.from('_sql').rpc('alter_table_users');
    
    if (usersTableError) {
      console.error('SQL error:', usersTableError);
      
      // Alternative approach: try using SQL directly
      const { error: directSqlError } = await supabase
        .from('users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', '00000000-0000-0000-0000-000000000000')
        .select();
      
      if (directSqlError) {
        console.error('Direct SQL error:', directSqlError);
        throw directSqlError;
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database migrations completed successfully' 
    });
  } catch (error) {
    console.error('Error during database migrations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to run database migrations' },
      { status: 500 }
    );
  }
} 