import { useCallback, useEffect, useState } from 'react';
import { fetchProductCatalog } from '@/lib/catalog';
import type { ProductSummary } from '@/lib/types';

type LoadStatus = 'loading' | 'ready' | 'error';

export function useProductCatalog() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetchProductCatalog()
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        console.error('Failed to load products', error);
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { products, status, reload };
}
