import { CheckCircle2, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminShell from '@/components/AdminShell';
import StoreBadge from '@/components/StoreBadge';
import { useProductCatalog } from '@/hooks/useProductCatalog';
import { hasAdminDatabaseSession } from '@/lib/adminDatabaseSession';
import { deleteProduct } from '@/lib/adminProducts';
import { formatPrice } from '@/lib/format';
import type { ProductSummary } from '@/lib/types';

interface LocationState {
  message?: string;
}

export default function AdminProducts() {
  const location = useLocation();
  const { products, status, reload } = useProductCatalog();
  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as LocationState | null)?.message ?? null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hasWriteAccess, setHasWriteAccess] = useState(true);

  useEffect(() => {
    hasAdminDatabaseSession().then(setHasWriteAccess).catch(() => setHasWriteAccess(false));
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    setSuccessMessage(null);
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setConfirmingId(null);
      setSuccessMessage('Product deleted.');
      reload();
    } catch (error) {
      console.error('Product delete failed', error);
      setDeleteError('The product could not be deleted. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Total products: <span className="font-semibold tabular-nums text-ink-900 dark:text-ink-50">{products.length}</span>
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-lg"
        >
          <Plus className="h-5 w-5" /> Add New Product
        </Link>
      </div>

      {!hasWriteAccess && (
        <p role="alert" className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          You are not connected to the database. Sign out and sign in again with your password to add, edit or delete products.
        </p>
      )}

      {successMessage && (
        <p role="status" className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300">
          <CheckCircle2 className="h-4 w-4" /> {successMessage}
        </p>
      )}
      {deleteError && (
        <p role="alert" className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {deleteError}
        </p>
      )}

      <section className="card overflow-hidden">
        {status === 'loading' && <p className="px-5 py-10 text-center text-sm text-ink-500">Loading products</p>}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center text-sm">
            <p className="text-red-600 dark:text-red-400">The products could not be loaded.</p>
            <button type="button" onClick={reload} className="font-semibold text-primary-600 underline dark:text-primary-400">
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && products.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-ink-500">No products yet. Add your first product to put it live.</p>
        )}

        {status === 'ready' && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-200 text-left text-sm dark:divide-ink-700">
              <thead className="bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:bg-ink-900/60 dark:text-ink-400">
                <tr>
                  <th scope="col" className="px-5 py-3">Product</th>
                  <th scope="col" className="px-5 py-3">Category</th>
                  <th scope="col" className="px-5 py-3 text-right">Price</th>
                  <th scope="col" className="px-5 py-3 text-right">Stores</th>
                  <th scope="col" className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200 dark:divide-ink-700">
                {products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    confirming={confirmingId === product.id}
                    deleting={deletingId === product.id}
                    onAskDelete={() => setConfirmingId(product.id)}
                    onCancelDelete={() => setConfirmingId(null)}
                    onConfirmDelete={() => handleDelete(product.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}

interface ProductRowProps {
  product: ProductSummary;
  confirming: boolean;
  deleting: boolean;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

function ProductRow({ product, confirming, deleting, onAskDelete, onCancelDelete, onConfirmDelete }: ProductRowProps) {
  return (
    <tr className="transition-colors hover:bg-ink-50 dark:hover:bg-ink-700/40">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <img src={product.image_urls[0]} alt="" className="h-10 w-10 shrink-0 rounded-lg bg-white object-contain p-0.5" />
          <div className="min-w-0">
            <p className="line-clamp-1 max-w-xs font-semibold">{product.title}</p>
            <p className="text-xs text-ink-500 dark:text-ink-400">{product.brand}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3 text-ink-600 dark:text-ink-300">{product.category}</td>
      <td className="px-5 py-3 text-right">
        {product.lowestOffer ? (
          <div className="flex items-center justify-end gap-2">
            <StoreBadge name={product.lowestOffer.store.name} color={product.lowestOffer.store.brand_color} size="sm" />
            <span className="font-semibold tabular-nums">{formatPrice(product.lowestOffer.price)}</span>
          </div>
        ) : (
          <span className="text-ink-400">-</span>
        )}
      </td>
      <td className="px-5 py-3 text-right tabular-nums">{product.storeCount}</td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-2">
          {confirming ? (
            <>
              <button
                type="button"
                onClick={onCancelDelete}
                disabled={deleting}
                className="rounded-lg px-3 py-2 text-xs font-semibold text-ink-600 transition hover:bg-ink-100 disabled:opacity-60 dark:text-ink-300 dark:hover:bg-ink-700"
              >
                Keep
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Yes, delete
              </button>
            </>
          ) : (
            <>
              <Link
                to={`/admin/products/${product.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-primary-700 transition hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-primary-900/40"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <button
                type="button"
                onClick={onAskDelete}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
