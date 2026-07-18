import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mftqwebckhhayhniaopu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mdHF3ZWJja2hoYXlobmlhb3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0MDEzOTQsImV4cCI6MjA5OTk3NzM5NH0.48KEbmcDgmAlzDNo_PhEEYD7ZDlQrWU8JFlGZSdOF7I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);