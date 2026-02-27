import { supabase } from './supabase';

export const authQueryKey = ['session'];

export async function fetchSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function getDisplayName(session) {
  if (!session?.user) return '';
  const meta = session.user.user_metadata;
  const name = meta?.full_name || meta?.name || '';
  if (name?.trim()) return name.trim();
  return session.user.email ?? '';
}

export function getInitials(session) {
  if (!session?.user) return '?';
  const meta = session.user.user_metadata;
  const name = meta?.full_name || meta?.name || '';
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }
  const email = session.user.email;
  if (email) return email.charAt(0).toUpperCase();
  return '?';
}

export function subscribeAuthToQueryClient(queryClient) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    queryClient.setQueryData(authQueryKey, session);
  });
  return () => subscription.unsubscribe();
}
