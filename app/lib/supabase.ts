import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vqvgvmlblaarrtuiadhj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxdmd2bWxibGFhcnJ0dWlhZGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjA1ODQsImV4cCI6MjA5ODEzNjU4NH0.Rw2SU9PoektFKznTaGIASFkSr_Es4DVg9m4q0fGNv04";

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);