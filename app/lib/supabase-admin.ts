import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// ఈ క్లయింట్‌ను కేవలం సర్వర్-సైడ్ (API Routes) లో మాత్రమే వాడండి
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);