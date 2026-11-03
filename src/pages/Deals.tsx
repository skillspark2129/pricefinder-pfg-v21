import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import { useProductCatalog } from '@/hooks/useProductCatalog';
import { discountPercent } from '@/lib/format';

export default function Deals() {
  const { products, status, reload } = useProductCatalog();

  const deals = useMemo(
    () =>
      products
        .flatMap((product) => {
          if (!product.lowestOffer) return [];
          const percent = discountPercent(product.list_price, product.lowestOffer.price);
          return percent > 0 ? [{ product, percent }] : [];
        })
        .sort((a, b) => b.percent - a.percent)
        .map((entry) => entry.product),
    [products]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Save more</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Today's deals</h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
          Products available below their list price, biggest savings first.
        </p>
      </div>

      <ProductGrid
        products={deals}
        status={status}
        onRetry={reload}
        emptyMessage="No discounted products are listed right now."
      />

      <Link to="/" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400">
        <ArrowLeft className="h-4 w-4" /> Back to the home page
      </Link>
    </section>
  );
}
