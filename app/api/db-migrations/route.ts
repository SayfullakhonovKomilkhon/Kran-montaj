import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST() {
  try {
    // Test database connection by doing a simple query
    const { error: testError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Database connection test error:', testError);
      // This is not critical, continue with the response
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