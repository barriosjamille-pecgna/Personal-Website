import { createClient } from "@supabase/supabase-js";

// Only ever the public anon key here — never the service role key.
// These come from Netlify env vars (VITE_ prefix so Vite exposes them
// to client code). If they're not set, the app falls back to local
// placeholder content (see src/data/localContent.js) so development
// and first deploy work before Supabase is wired up.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = Boolean(supabase);
