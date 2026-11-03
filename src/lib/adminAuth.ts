import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const SESSION_KEY = 'isAdmin';
const FINGERPRINT_KEY = 'adminFingerprintId';

export const ADMIN_NOT_CONFIGURED_MESSAGE = 'Admin login is not configured in the database';

interface AdminSessionTokens {
  access_token: string;
  refresh_token: string;
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.functions.invoke<{ ok?: boolean; session?: AdminSessionTokens }>(
    'admin-login',
    { body: { email, password } },
  );
  if (error instanceof FunctionsHttpError && error.context.status === 401) return false;
  if (error instanceof FunctionsHttpError && error.context.status === 500) {
    const body = (await error.context.json().catch(() => null)) as { error?: string } | null;
    if (body?.error === ADMIN_NOT_CONFIGURED_MESSAGE) throw new Error(ADMIN_NOT_CONFIGURED_MESSAGE);
  }
  if (error) throw error;
  if (data?.ok !== true) return false;
  if (!data.session) throw new Error('Admin session was not returned.');

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
  if (sessionError) throw sessionError;
  return true;
}


export function isAdminSignedIn(): boolean {
  return localStorage.getItem(SESSION_KEY) === 'true';
}

export function startAdminSession(): void {
  localStorage.setItem(SESSION_KEY, 'true');
}

export function endAdminSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getFingerprintId(): string | null {
  return localStorage.getItem(FINGERPRINT_KEY);
}

export function saveFingerprintId(id: string): void {
  localStorage.setItem(FINGERPRINT_KEY, id);
}

export function removeFingerprintId(): void {
  localStorage.removeItem(FINGERPRINT_KEY);
}
