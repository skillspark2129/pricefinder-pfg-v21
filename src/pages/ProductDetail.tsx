import { AlertTriangle, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import OfferBuyLink from '@/components/OfferBuyLink';
import PlatformBuyButtons from '@/components/PlatformBuyButtons';
import PriceComparisonTable from '@/components/PriceComparisonTable';
import PriceHistoryChart from '@/components/PriceHistoryChart';
import ProductGallery from '@/components/ProductGallery';
import ProductPriceLabel from '@/components/ProductPriceLabel';
import ProductRating from '@/components/ProductRating';
import { ProductReviews, ProductSpecs } from '@/components/ProductSpecsReviews';
import RatingPrompt from '@/components/RatingPrompt';
import WishlistToggle from '@/components/WishlistToggle';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useProductDetail, type ProductDetailData } from '@/hooks/useProductDetail';
import { useProductRating } from '@/hooks/useProductRating';
import NotFound from '@/pages/NotFound';

export default function ProductDetail() {
  const { id } = useParams();
  const { state, reload } = useProductDetail(id);

  if (state.status === 'loading') {
    return (
      <div className="flex items-center justify-center gap-2 py-32 text-sm text-ink-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading product details
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <p className="font-semibold">We could not load this product.</p>
        <p className="text-sm text-ink-500 dark:text-ink-400">Please check your connection and try again.</p>
        <button type="button" onClick={reload} className="btn-primary">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </div>
    );
  }

  if (state.status === 'not-found') {
    return <NotFound />;
  }

  return <ProductDetailContent data={state.data} />;
}

function ProductDetailContent({ data }: { data: ProductDetailData }) {
  const { product, offers, history, ratingStats, affiliateLinks } = data;
  const lowestOffer = offers[0] ?? null;
  const summary = { ...product, lowestOffer, storeCount: offers.length, ratingStats };
  const rating = useProductRating(product.id, ratingStats);
  const [buyClicked, setBuyClicked] = useState(false);
  const markBuyClicked = () => setBuyClicked(true);

  usePageMeta({
    title: `${product.title} - Compare Prices in Pakistan`,
    description: `Compare ${product.title} prices across ${offers.length} stores in Pakistan. See the best deal, delivery details and six-month price history on Price Finder Globally.`,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-600 transition hover:text-primary-600 dark:text-ink-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.image_urls} title={product.title} />

        <div className="flex flex-col gap-6 animate-fade-up">
          <div>
            <span className="inline-block rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              {product.brand} · {product.category}
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">{product.title}</h1>
            <div className="mt-3">
              <ProductRating rating={rating} />
            </div>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-primary-50/60 p-5 dark:border-primary-900/50 dark:bg-primary-900/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">Lowest price</p>
            <div className="mt-2">
              <ProductPriceLabel product={summary} size="lg" />
            </div>
            {lowestOffer && (
              <p className="mt-3 text-sm text-ink-600 dark:text-ink-300">
                At <span className="font-semibold">{lowestOffer.store.name}</span> · {lowestOffer.delivery_text} ·{' '}
                {lowestOffer.stock_status}
              </p>
            )}
          </div>

          <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">{product.description}</p>

          <div className="flex flex-col gap-3 sm:flex-row">
            {lowestOffer ? (
              <OfferBuyLink offer={lowestOffer} onClick={markBuyClicked} className="btn-primary flex-1 !py-4 text-base">
                View Price on {lowestOffer.store.name}
              </OfferBuyLink>
            ) : (
              <span className="btn-primary flex-1 cursor-not-allowed !py-4 text-base opacity-50" aria-disabled="true">
                Check Price
              </span>
            )}
            <a
              href="#compare"
              className="flex flex-1 items-center justify-center rounded-xl border border-ink-300 px-5 py-4 text-base font-semibold text-ink-800 transition hover:border-primary-400 hover:text-primary-600 dark:border-ink-600 dark:text-ink-100"
            >
              Compare Prices
            </a>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <WishlistToggle productId={product.id} productTitle={product.title} variant="button" />
          </div>
        </div>
      </div>

      <section id="compare" className="scroll-mt-24 mt-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Compare prices across stores</h2>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {offers.length} stores listed. The best price is highlighted.
          </p>
        </div>
        <PriceComparisonTable offers={offers} />
        <div className="mt-8">
          <PlatformBuyButtons links={affiliateLinks} onBuyClick={markBuyClicked} />
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Price history</h2>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Average price over the last six months.</p>
        </div>
        <PriceHistoryChart history={history} />
      </section>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <ProductSpecs product={product} />
        <ProductReviews product={product} />
      </div>

      <RatingPrompt rating={rating} enabled={!buyClicked} />
    </div>
  );
}
