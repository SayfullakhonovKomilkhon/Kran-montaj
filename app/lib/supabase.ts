import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rgpdolopvlfdiutwlvow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncGRvbG9wdmxmZGl1dHdsdm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzg2MzEsImV4cCI6MjA3OTkxNDYzMX0.aXW3FbtyBik86D22UOvKmMmywMa1RkpqOF360JmNzyE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 