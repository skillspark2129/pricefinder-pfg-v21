import type { Offer } from '@/lib/types';

export function getOfferLink(offer: Offer): string | null {
  const url = offer.affiliate_url?.trim();
  return url ? url : null;
}
