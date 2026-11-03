import { fetchProductAffiliateLinks, type ProductAffiliateLink } from '@/lib/affiliateLinks';
import { fetchAllRatingStats, fetchRatingStats } from '@/lib/productRatings';
import { supabase } from '@/lib/supabase';
import type { Offer, PricePoint, Product, ProductSummary, RatingStats, Store } from '@/lib/types';

export class NotFoundError extends Error {
  constructor() {
    super('Not found');
    this.name = 'NotFoundError';
  }
}

const PRODUCT_COLUMNS =
  'id, title, brand, category, image_urls, description, specs, sample_reviews, list_price, rating, review_count, commission_percent';
const OFFER_COLUMNS =
  'id, product_id, price, delivery_text, stock_status, affiliate_url, store:stores(id, name, brand_color, sort_order)';

type OfferRow = Omit<Offer, 'store'> & { store: Store | Store[] | null };

function normalizeOffers(rows: OfferRow[]): Offer[] {
  return rows.flatMap((row) => {
    const store = Array.isArray(row.store) ? (row.store[0] ?? null) : row.store;
    return store ? [{ ...row, store }] : [];
  });
}

function assertOk<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  if (result.data === null) throw new Error('No data returned');
  return result.data;
}

export async function fetchProductCatalog(): Promise<ProductSummary[]> {
  const [products, offers, ratingStats] = await Promise.all([
    supabase.from('products').select(PRODUCT_COLUMNS).order('rating', { ascending: false }),
    supabase.from('product_offers').select(OFFER_COLUMNS),
    fetchAllRatingStats(),
  ]);

  const productRows = assertOk<Product[]>({ data: products.data, error: products.error });
  const offerRows = normalizeOffers(assertOk<OfferRow[]>({ data: offers.data, error: offers.error }));

  const offersByProduct = new Map<string, Offer[]>();
  for (const offer of offerRows) {
    const list = offersByProduct.get(offer.product_id) ?? [];
    list.push(offer);
    offersByProduct.set(offer.product_id, list);
  }

  return productRows.map((product) => {
    const productOffers = offersByProduct.get(product.id) ?? [];
    const lowestOffer = productOffers.reduce<Offer | null>(
      (lowest, offer) => (lowest === null || offer.price < lowest.price ? offer : lowest),
      null
    );
    return {
      ...product,
      lowestOffer,
      storeCount: productOffers.length,
      ratingStats: ratingStats.get(product.id) ?? null,
    };
  });
}

export async function fetchProductDetail(id: string): Promise<{
  product: Product;
  offers: Offer[];
  history: PricePoint[];
  ratingStats: RatingStats | null;
  affiliateLinks: ProductAffiliateLink[];
}> {
  const [product, offers, history, ratingStats, affiliateLinks] = await Promise.all([
    supabase.from('products').select(PRODUCT_COLUMNS).eq('id', id).maybeSingle(),
    supabase.from('product_offers').select(OFFER_COLUMNS).eq('product_id', id).order('price', { ascending: true }),
    supabase.from('price_history').select('recorded_on, price').eq('product_id', id).order('recorded_on', { ascending: true }),
    fetchRatingStats(id),
    fetchProductAffiliateLinks(id),
  ]);

  if (product.error) throw new Error(product.error.message);
  if (!product.data) throw new NotFoundError();
  if (offers.error) throw new Error(offers.error.message);
  if (history.error) throw new Error(history.error.message);

  return {
    product: product.data as Product,
    offers: normalizeOffers((offers.data ?? []) as OfferRow[]),
    history: (history.data ?? []) as PricePoint[],
    ratingStats,
    affiliateLinks,
  };
}

export async function fetchStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('id, name, brand_color, sort_order')
    .order('sort_order', { ascending: true });
  return assertOk<Store[]>({ data, error });
}

export async function subscribeToNewsletter(email: string): Promise<'subscribed' | 'duplicate'> {
  const { error } = await supabase.from('newsletter_subscribers').insert({ email });
  if (!error) return 'subscribed';
  if (error.code === '23505') return 'duplicate';
  throw new Error(error.message);
}
