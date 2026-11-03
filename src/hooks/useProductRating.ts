import { useCallback, useState } from 'react';
import { fetchRatingStats, getStoredRating, submitProductRating } from '@/lib/productRatings';
import type { RatingStats } from '@/lib/types';

const RATING_ERROR = 'Your rating could not be saved. Please try again.';

function withNewRating(current: RatingStats | null, stars: number): RatingStats {
  const count = current?.count ?? 0;
  const total = (current?.average ?? 0) * count + stars;
  return { average: Math.round((total / (count + 1)) * 10) / 10, count: count + 1 };
}

export function useProductRating(productId: string, initialStats: RatingStats | null) {
  const [stats, setStats] = useState<RatingStats | null>(initialStats);
  const [myRating, setMyRating] = useState<number | null>(() => getStoredRating(productId));
  const [error, setError] = useState<string | null>(null);

  const rate = useCallback(
    async (stars: number) => {
      if (myRating !== null) return;
      const previousStats = stats;
      setError(null);
      setMyRating(stars);
      setStats(withNewRating(previousStats, stars));
      try {
        await submitProductRating(productId, stars);
      } catch (caught) {
        console.error('Rating failed to save', caught);
        setMyRating(null);
        setStats(previousStats);
        setError(RATING_ERROR);
        return;
      }
      try {
        setStats(await fetchRatingStats(productId));
      } catch (caught) {
        console.error('Rating total failed to refresh', caught);
      }
    },
    [myRating, productId, stats]
  );

  return { stats, myRating, error, rate };
}

export type ProductRatingController = ReturnType<typeof useProductRating>;
