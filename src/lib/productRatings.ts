import { supabase } from '@/lib/supabase';
import type { RatingStats } from '@/lib/types';

const VISITOR_KEY = 'pf_visitor_id';

function ratedKey(productId: string): string {
  return `pf_rated_${productId}`;
}

function getVisitorId(): string {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, id);
  return id;
}

export function getStoredRating(productId: string): number | null {
  const value = Number(localStorage.getItem(ratedKey(productId)));
  return Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
}

export async function submitProductRating(productId: string, stars: number): Promise<void> {
  const { error } = await supabase
    .from('product_ratings')
    .insert({ product_id: productId, visitor_id: getVisitorId(), stars });
  if (error && error.code !== '23505') throw new Error(error.message);
  localStorage.setItem(ratedKey(productId), String(stars));
}

function toStats(row: { average_rating: number | string; rating_count: number }): RatingStats {
  return { average: Number(row.average_rating), count: Number(row.rating_count) };
}

export async function fetchRatingStats(productId: string): Promise<RatingStats | null> {
  const { data, error } = await supabase
    .from('product_rating_stats')
    .select('average_rating, rating_count')
    .eq('product_id', productId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toStats(data) : null;
}

export async function fetchAllRatingStats(): Promise<Map<string, RatingStats>> {
  const { data, error } = await supabase
    .from('product_rating_stats')
    .select('product_id, average_rating, rating_count');
  if (error) throw new Error(error.message);
  return new Map((data ?? []).map((row) => [row.product_id as string, toStats(row)]));
}
