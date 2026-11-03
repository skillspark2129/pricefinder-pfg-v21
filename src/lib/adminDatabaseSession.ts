import { supabase } from '@/lib/supabase';

export async function hasAdminDatabaseSession(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return data.session !== null;
}
