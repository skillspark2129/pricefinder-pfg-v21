import { AlertTriangle, Check, Loader2, Scale } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CompareTable, { type CompareItem } from '@/components/CompareTable';
import { usePageMeta } from '@/hooks/usePageMeta';
import { useProductCatalog } from '@/hooks/useProductCatalog';
import { fetchProductDetail } from '@/lib/catalog';

const MAX_COMPARE = 3;

type DetailState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; items: CompareItem[] };

export default function Compare() {
  usePageMeta({
    title: 'Compare Products Side by Side',
    description:
      'Compare up to three products side by side on Price Finder Globally. See lowest prices, store counts, ratings and the best store for each product in Pakistan.',
  });

  const [params, setParams] = useSearchParams();
  const { products, status: catalogStatus, reload } = useProductCatalog();
  const selectedIds = useMemo(
    () => [...new Set((params.get('ids') ?? '').split(',').filter(Boolean))].slice(0, MAX_COMPARE),
    [params]
  );
  const selectedKey = selectedIds.join(',');
  const [detail, setDetail] = useState<DetailState>({ status: 'idle' });

  useEffect(() => {
    if (selectedKey === '') {
      setDetail({ status: 'idle' });
      return;
    }
    const ids = selectedKey.split(',');
    let cancelled = false;
    setDetail({ status: 'loading' });
    Promise.all(ids.map((id) => fetchProductDetail(id)))
      .then((results) => {
        if (cancelled) return;
        setDetail({
          status: 'ready',
          items: results.map(({ product, offers, ratingStats }) => ({ product, offers, ratingStats })),
        });
      })
      .catch((error: unknown) => {
        console.error('Failed to load comparison', error);
        if (!cancelled) setDetail({ status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, [selectedKey]);

  const toggleProduct = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((existing) => existing !== id)
      : [...selectedIds, id].slice(0, MAX_COMPARE);
    const nextParams = new URLSearchParams(params);
    if (next.length > 0) nextParams.set('ids', next.join(','));
    else nextParams.delete('ids');
    setParams(nextParams, { replace: true });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Compare</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Compare products side by side</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          Choose up to {MAX_COMPARE} products to see their prices, store counts and ratings in one table. Your selection stays
          in the page address, so you can share or bookmark it.
        </p>
      </div>

      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold">Choose products</h2>
          <span className="text-sm font-semibold text-ink-500 dark:text-ink-400">
            {selectedIds.length} of {MAX_COMPARE} selected
          </span>
        </div>

        {catalogStatus === 'loading' && (
          <div className="flex items-center gap-2 py-10 text-sm text-ink-500">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading products
          </div>
        )}
        {catalogStatus === 'error' && (
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            <p>We could not load the product list.</p>
            <button type="button" onClick={reload} className="btn-primary">
              Try again
            </button>
          </div>
        )}
        {catalogStatus === 'ready' && (
          <ul className="grid max-h-[420px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              const isDisabled = !isSelected && selectedIds.length >= MAX_COMPARE;
              return (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => toggleProduct(product.id)}
                    disabled={isDisabled}
                    aria-pressed={isSelected}
                    className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 shadow-md dark:bg-primary-900/30'
                        : 'border-ink-200 bg-white hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md dark:border-ink-700 dark:bg-ink-800'
                    }`}
                  >
                    {product.image_urls[0] ? (
                      <img
                        src={product.image_urls[0]}
                        alt=""
                        loading="lazy"
                        className="h-14 w-14 shrink-0 rounded-xl bg-ink-100 object-cover"
                      />
                    ) : (
                      <span className="h-14 w-14 shrink-0 rounded-xl bg-ink-100 dark:bg-ink-700" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 block text-sm font-semibold">{product.title}</span>
                      <span className="mt-1 block text-xs text-ink-500 dark:text-ink-400">{product.brand}</span>
                    </span>
                    {isSelected && <Check className="h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedIds.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-ink-300 px-6 py-14 text-center dark:border-ink-600">
          <Scale className="h-10 w-10 text-primary-500" />
          <p className="max-w-md text-sm text-ink-600 dark:text-ink-300">
            Pick at least two products above to see them side by side. Not sure what to compare? Browse the{' '}
            <Link to="/" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
              trending products
            </Link>{' '}
            first.
          </p>
        </div>
      )}

      {detail.status === 'loading' && (
        <div className="flex items-center gap-2 py-10 text-sm text-ink-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading comparison
        </div>
      )}
      {detail.status === 'error' && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          We could not load the comparison. Please try again in a moment.
        </div>
      )}
      {detail.status === 'ready' && selectedIds.length === 1 && (
        <p className="mb-6 rounded-2xl bg-primary-50 px-5 py-4 text-sm font-medium text-primary-800 dark:bg-primary-900/30 dark:text-primary-200">
          Select one more product to start comparing.
        </p>
      )}
      {detail.status === 'ready' && <CompareTable items={detail.items} />}
    </section>
  );
}
