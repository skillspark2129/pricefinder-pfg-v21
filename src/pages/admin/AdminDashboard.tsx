import { Boxes, Layers, Package, Star, Store } from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import AdminShell from '@/components/AdminShell';
import AdminTrendingAlerts from '@/components/AdminTrendingAlerts';
import AdminWhatsAppSettings from '@/components/AdminWhatsAppSettings';
import StoreBadge from '@/components/StoreBadge';
import { useProductCatalog } from '@/hooks/useProductCatalog';
import { formatPrice } from '@/lib/format';
import type { ProductSummary } from '@/lib/types';

export default function AdminDashboard() {
  const { products, status, reload } = useProductCatalog();

  const stats = useMemo(() => {
    const categories = new Set(products.map((product) => product.category));
    const liveOffers = products.reduce((total, product) => total + product.storeCount, 0);
    const averageRating =
      products.length > 0 ? products.reduce((total, product) => total + product.rating, 0) / products.length : 0;
    return { categories: categories.size, liveOffers, averageRating };
  }, [products]);

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Overview of the products and prices shown on the site.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Package className="h-5 w-5" />} label="Products" value={products.length.toString()} />
        <StatCard icon={<Store className="h-5 w-5" />} label="Live store offers" value={stats.liveOffers.toString()} />
        <StatCard icon={<Layers className="h-5 w-5" />} label="Categories" value={stats.categories.toString()} />
        <StatCard
          icon={<Star className="h-5 w-5" />}
          label="Average rating"
          value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '-'}
        />
      </div>

      <AdminWhatsAppSettings />

      <AdminTrendingAlerts />

      <section className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4 dark:border-ink-700">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Boxes className="h-5 w-5 text-primary-500" /> Product catalogue
          </h2>
        </div>

        {status === 'loading' && <p className="px-5 py-10 text-center text-sm text-ink-500">Loading products</p>}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center text-sm">
            <p className="text-red-600 dark:text-red-400">The catalogue could not be loaded.</p>
            <button type="button" onClick={reload} className="font-semibold text-primary-600 underline dark:text-primary-400">
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && products.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-ink-500">No products have been added yet.</p>
        )}

        {status === 'ready' && products.length > 0 && <CatalogueTable products={products} />}
      </section>
    </AdminShell>
  );
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium text-ink-500 dark:text-ink-400">{label}</p>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function CatalogueTable({ products }: { products: ProductSummary[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-ink-200 text-left text-sm dark:divide-ink-700">
        <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:bg-ink-900/60 dark:text-ink-400">
          <tr>
            <th scope="col" className="px-5 py-3">Product</th>
            <th scope="col" className="px-5 py-3">Category</th>
            <th scope="col" className="px-5 py-3 text-right">List price</th>
            <th scope="col" className="px-5 py-3 text-right">Lowest price</th>
            <th scope="col" className="px-5 py-3 text-right">Stores</th>
            <th scope="col" className="px-5 py-3 text-right">Rating</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-200 dark:divide-ink-700">
          {products.map((product) => (
            <tr key={product.id} className="transition-colors hover:bg-ink-50 dark:hover:bg-ink-700/40">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image_urls[0]}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-lg bg-white object-contain p-0.5"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-1 max-w-xs font-semibold">{product.title}</p>
                    <p className="text-xs text-ink-500 dark:text-ink-400">{product.brand}</p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3 text-ink-600 dark:text-ink-300">{product.category}</td>
              <td className="px-5 py-3 text-right tabular-nums">{formatPrice(product.list_price)}</td>
              <td className="px-5 py-3 text-right">
                {product.lowestOffer ? (
                  <div className="flex items-center justify-end gap-2">
                    <StoreBadge
                      name={product.lowestOffer.store.name}
                      color={product.lowestOffer.store.brand_color}
                      size="sm"
                    />
                    <span className="font-semibold tabular-nums">{formatPrice(product.lowestOffer.price)}</span>
                  </div>
                ) : (
                  <span className="text-ink-400">-</span>
                )}
              </td>
              <td className="px-5 py-3 text-right tabular-nums">{product.storeCount}</td>
              <td className="px-5 py-3 text-right tabular-nums">{product.rating.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
