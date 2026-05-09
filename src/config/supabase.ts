import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getEnv } from "./env";

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const env = getEnv();
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseClient;
}
