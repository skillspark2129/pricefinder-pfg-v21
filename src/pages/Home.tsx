import { ArrowLeft, X } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import CategoryBar from '@/components/CategoryBar';
import FlashSale from '@/components/FlashSale';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import StoreBar from '@/components/StoreBar';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useProductCatalog } from '@/hooks/useProductCatalog';
import type { ProductSummary } from '@/lib/types';

const TRENDING_COUNT = 12;

function matchesQuery(product: ProductSummary, query: string): boolean {
  const haystack = `${product.title} ${product.brand} ${product.category}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export default function Home() {
  const [params] = useSearchParams();
  const query = params.get('q')?.trim() ?? '';
  const category = params.get('category') ?? 'All';
  const isFiltering = query !== '' || category !== 'All';
  const { hash } = useLocation();
  const { products, status, reload } = useProductCatalog();

  usePageMeta({
    title: '11 Global Stores in One Search - Price Finder Globally PFG',
    description:
      'Compare prices for phones, laptops, home appliances and more across 11 global stores including Daraz, Amazon, AliExpress, Temu, Shein and eBay. Find the best deal on Price Finder Globally.',
  });

  const results = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === 'All' || product.category === category) && (query === '' || matchesQuery(product, query))
      ),
    [products, category, query]
  );

  const featured = products.slice(0, TRENDING_COUNT);

  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  return (
    <>
      <HeroSection />
      <div className="py-8">
        <CategoryBar activeCategory={category} />
      </div>

      {isFiltering ? (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6" aria-label="Search results">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                {query ? `Results for "${query}"` : category}
              </h2>
              {status === 'ready' && (
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                  {results.length} {results.length === 1 ? 'product' : 'products'} found
                </p>
              )}
            </div>
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-semibold transition hover:border-primary-300 hover:text-primary-600 dark:border-ink-600"
            >
              <X className="h-4 w-4" /> Clear filters
            </Link>
          </div>
          <ProductGrid
            products={results}
            status={status}
            onRetry={reload}
            emptyMessage={query ? `No products match "${query}".` : `No ${category} products yet.`}
          />
          <Link to="/" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400">
            <ArrowLeft className="h-4 w-4" /> Back to the home page
          </Link>
        </section>
      ) : (
        <>
          <FlashSale products={products} status={status} onRetry={reload} />
          <section id="trending" className="scroll-mt-24 mx-auto max-w-7xl px-4 pb-14 sm:px-6">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                Most compared
              </p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Featured products</h2>
            </div>
            <ProductGrid
              products={featured}
              status={status}
              onRetry={reload}
              emptyMessage="No products are listed yet."
            />
          </section>

          <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6" aria-labelledby="why-compare">
            <h2 id="why-compare" className="text-2xl font-bold sm:text-3xl">
              Why compare prices before you buy in Pakistan?
            </h2>
            <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-ink-700 dark:text-ink-300">
              <p>
                Online shopping has never offered more choice. The same phone, laptop, air fryer or pair of
                sneakers can be listed on Daraz, Amazon, AliExpress, Temu, eBay and many other stores, often at very different prices
                on the same day. Price Finder Globally brings those offers together so you can see the real lowest price in seconds
                instead of opening a dozen tabs.
              </p>
              <p>
                Every product page shows the stores that sell an item, their current prices, delivery estimates and stock
                status. The store with the best price is labelled clearly, and a six-month price history chart helps you tell
                a genuine discount from an inflated sale price. Our flash sale and deals pages highlight the biggest reductions
                we can see, so you can spot bargains as they appear.
              </p>
              <p>
                Searching is simple. Type a product name, brand or category into the search bar at the top of the page, or
                browse by category to explore electronics, mobiles, home appliances, fashion, beauty and more. Save products to
                your wishlist to check them again later, or use the{' '}
                <Link to="/compare" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                  compare page
                </Link>{' '}
                to line up up to three products side by side.
              </p>
              <p>
                Price Finder Globally is free to use. We earn a small commission when you buy through our store links, at no extra cost
                to you. You can read exactly how this works on our{' '}
                <Link to="/affiliate-disclosure" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                  affiliate disclosure
                </Link>{' '}
                page, and find answers to common questions in our{' '}
                <Link to="/faq" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                  FAQ
                </Link>
                . Prices change often, so always confirm the final amount on the store's website before you pay.
              </p>
            </div>
          </section>
        </>
      )}

      <StoreBar />
    </>
  );
}
