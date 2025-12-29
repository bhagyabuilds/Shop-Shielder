
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hzybtjvklajqxxhcmsuk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6eWJ0anZrbGFqcXh4aGNtc3VrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMTkyMzMsImV4cCI6MjA4MjU5NTIzM30.6YtO7qb2fpTGU64IQoHlhpbrAdrN3ChXlk90bTn7JEs';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
