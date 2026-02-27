import { supabase } from "./supabase";

export const authQueryKey = ["session"];

export async function fetchSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
