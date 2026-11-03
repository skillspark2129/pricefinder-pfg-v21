import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export type TrendingStatus = 'pending' | 'published';

export interface TrendingAlert {
  id: string;
  name: string;
  trend_score: number;
  affiliate_url: string | null;
  status: TrendingStatus;
  sort_order: number;
}

export function useTrendingAlerts() {
  const [alerts, setAlerts] = useState<TrendingAlert[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('trending_alerts')
      .select('id, name, trend_score, affiliate_url, status, sort_order')
      .order('sort_order', { ascending: true });
    if (error) {
      console.error('Trending alerts failed to load', error);
      setStatus('error');
      return;
    }
    setAlerts((data ?? []) as TrendingAlert[]);
    setStatus('ready');
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const publishLink = useCallback(async (id: string, affiliateUrl: string) => {
    const { error } = await supabase
      .from('trending_alerts')
      .update({ affiliate_url: affiliateUrl, status: 'published' })
      .eq('id', id);
    if (error) throw new Error(error.message);
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, affiliate_url: affiliateUrl, status: 'published' } : alert))
    );
  }, []);

  return { alerts, status, reload: load, publishLink };
}
