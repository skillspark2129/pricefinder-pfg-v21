import { useEffect, useState } from 'react';
import type { ProductAffiliateLink } from '@/lib/affiliateLinks';
import { NotFoundError, fetchProductDetail } from '@/lib/catalog';
import type { Offer, PricePoint, Product, RatingStats } from '@/lib/types';

export interface ProductDetailData {
  product: Product;
  offers: Offer[];
  history: PricePoint[];
  ratingStats: RatingStats | null;
  affiliateLinks: ProductAffiliateLink[];
}

export type ProductDetailState =
  | { status: 'loading' }
  | { status: 'ready'; data: ProductDetailData }
  | { status: 'not-found' }
  | { status: 'error' };

export function useProductDetail(id: string | undefined) {
  const [state, setState] = useState<ProductDetailState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) {
      setState({ status: 'not-found' });
      return;
    }
    let cancelled = false;
    setState({ status: 'loading' });
    fetchProductDetail(id)
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof NotFoundError) {
          setState({ status: 'not-found' });
          return;
        }
        console.error('Failed to load product', error);
        setState({ status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  return { state, reload: () => setAttempt((n) => n + 1) };
}
