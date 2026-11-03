import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type ComplaintStatus = 'pending' | 'solved';

export interface Complaint {
  id: string;
  name: string;
  whatsapp: string;
  message: string;
  product_link: string | null;
  status: ComplaintStatus;
  created_at: string;
}

const REFRESH_INTERVAL_MS = 10_000;

export function usePendingComplaintCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { count: pending, error } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
      if (active && !error) setCount(pending ?? 0);
    };
    void load();
    const timer = window.setInterval(() => void load(), REFRESH_INTERVAL_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return count;
}

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('id, name, whatsapp, message, product_link, status, created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) {
      console.error('Complaints failed to load', error);
      setStatus('error');
      return;
    }
    setComplaints((data ?? []) as Complaint[]);
    setStatus('ready');
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), REFRESH_INTERVAL_MS);
    const handleFocus = () => void load();
    window.addEventListener('focus', handleFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', handleFocus);
    };
  }, [load]);

  const updateStatus = useCallback(async (id: string, next: ComplaintStatus) => {
    const { error } = await supabase.from('messages').update({ status: next }).eq('id', id);
    if (error) throw new Error(error.message);
    setComplaints((prev) => prev.map((item) => (item.id === id ? { ...item, status: next } : item)));
  }, []);

  return { complaints, status, reload: load, updateStatus };
}
