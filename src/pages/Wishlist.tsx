import { useMemo } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from '@/components/ProductGrid';
import { useProductCatalog } from '@/hooks/useProductCatalog';
import { useWishlist } from '@/context/WishlistContext';

export default function Wishlist() {
  const { products, status, reload } = useProductCatalog();
  const { wishlistIds } = useWishlist();

  const saved = useMemo(
    () => products.filter((product) => wishlistIds.includes(product.id)),
    [products, wishlistIds]
  );

  const isEmpty = wishlistIds.length === 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Your list</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Wishlist</h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
          {wishlistIds.length === 0
            ? 'Save products you like and find them here.'
            : `${wishlistIds.length} saved on this device.`}
        </p>
      </div>

      {isEmpty ? (
        <div className="card mx-auto flex max-w-md flex-col items-center gap-4 p-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
            <Heart className="h-7 w-7" />
          </span>
          <p className="font-bold">Your wishlist is empty</p>
          <p className="text-sm text-ink-500 dark:text-ink-400">Tap the heart on any product to save it here.</p>
          <Link to="/" className="btn-primary">
            Browse products
          </Link>
        </div>
      ) : (
        <ProductGrid
          products={saved}
          status={status}
          onRetry={reload}
          emptyMessage="Your saved products are no longer listed."
        />
      )}

      <Link to="/" className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400">
        <ArrowLeft className="h-4 w-4" /> Back to the home page
      </Link>
    </section>
  );
}
