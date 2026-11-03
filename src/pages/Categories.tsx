import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORY_ICONS } from '@/lib/categoryIcons';
import { CATEGORIES } from '@/lib/constants';
import { useProductCatalog } from '@/hooks/useProductCatalog';

export default function Categories() {
  const { products, status, reload } = useProductCatalog();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Browse</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">All categories</h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">Pick a category to compare prices across stores.</p>
      </div>

      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-red-600 dark:text-red-400">Categories could not be loaded.</p>
          <button type="button" onClick={reload} className="btn-primary">
            Try again
          </button>
        </div>
      )}

      {status !== 'error' && (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon];
            const count = products.filter((product) => product.category === category.name).length;
            return (
              <li key={category.name}>
                <Link
                  to={`/?category=${encodeURIComponent(category.name)}`}
                  className="group card flex h-full flex-col gap-5 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl sm:p-6 dark:hover:border-primary-800"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition group-hover:bg-primary-500 group-hover:text-white dark:bg-primary-900/40 dark:text-primary-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="mt-auto">
                    <p className="font-bold">{category.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-ink-500 dark:text-ink-400">
                      {status === 'ready' ? `${count} ${count === 1 ? 'product' : 'products'}` : 'Loading'}
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
