/**
 * Supabase wiring — NOT used by the MVP demo yet (the app runs on the in-memory
 * store in src/data/store.tsx). This is the drop-in point for the real backend.
 *
 * To activate:
 *   1. Create a project at https://supabase.com and run supabase/migrations/0001_init.sql
 *   2. cd app && npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
 *   3. Copy .env.example -> .env and fill the two values below
 *   4. Uncomment the client block and swap StoreProvider's seed data for queries
 */

import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? "";
export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.supabaseAnonKey ?? "";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

/*
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
*/
