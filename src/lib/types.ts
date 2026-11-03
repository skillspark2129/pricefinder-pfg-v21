export interface Store {
  id: string;
  name: string;
  brand_color: string;
  sort_order: number;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Review {
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  image_urls: string[];
  description: string;
  specs: Spec[];
  sample_reviews: Review[];
  list_price: number;
  rating: number;
  review_count: number;
  commission_percent: number;
}

export interface Offer {
  id: string;
  product_id: string;
  price: number;
  delivery_text: string;
  stock_status: string;
  affiliate_url: string | null;
  store: Store;
}

export interface RatingStats {
  average: number;
  count: number;
}

export interface ProductSummary extends Product {
  lowestOffer: Offer | null;
  storeCount: number;
  ratingStats: RatingStats | null;
}

export interface PricePoint {
  recorded_on: string;
  price: number;
}
