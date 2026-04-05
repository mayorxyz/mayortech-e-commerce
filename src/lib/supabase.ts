import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mwczhzswgbgpbfkgzirl.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_fruTMWn2Y6rFJKVXiuWQeg_izf4Gj87";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
