import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mcwxaxysuoslhspsnnfy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jd3hheHlzdW9zbGhzcHNubmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDI1NTYsImV4cCI6MjA2MjYxODU1Nn0.a55WRVX8xbrR0m6sNBLRETMnd35cA-jjWNqXmc5W-wA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 