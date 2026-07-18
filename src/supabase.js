import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mftqwebckhhayhniaopo.supabase.co';
const SUPABASE_KEY = 'sb_publishable_25Bjrnb_SNR6Vx9JlOF_Kg_LJhr8uiU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);