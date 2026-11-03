import { supabase } from '@/lib/supabase';

export const ADMIN_WHATSAPP_KEY = 'admin_whatsapp_number';

export async function getAdminWhatsAppNumber(): Promise<string | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', ADMIN_WHATSAPP_KEY)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const value = typeof data?.value === 'string' ? data.value.trim() : '';
  return value || null;
}

export async function saveAdminWhatsAppNumber(number: string): Promise<void> {
  const { error } = await supabase.from('settings').upsert({
    key: ADMIN_WHATSAPP_KEY,
    value: number,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}
