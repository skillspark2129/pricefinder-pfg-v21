import { Download, Heart, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LOGO_URL } from '@/lib/constants';
import { useTheme } from '@/context/ThemeContext';
import { useWishlist } from '@/context/WishlistContext';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export default function Header() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const urlQuery = params.get('q') ?? '';
  const [query, setQuery] = useState(urlQuery);
  const { theme, toggleTheme } = useTheme();
  const { wishlistCount, openWishlist } = useWishlist();
  const { canInstall, install } = usePWAInstall();

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : '/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur-md dark:border-ink-700 dark:bg-ink-900/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Price Finder Globally home">
          <img
            src={LOGO_URL}
            alt="Price Finder Globally PFG Logo - Compare Prices Worldwide"
            width={45}
            height={45}
            className="h-[45px] w-[45px] shrink-0 transition-transform duration-300 group-hover:-rotate-6"
          />
          <span className="hidden font-display text-lg font-bold leading-none sm:block">
            Price Finder <span className="text-primary-500">Globally</span>
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          role="search"
          className="order-3 flex w-full items-center rounded-full border border-ink-200 bg-ink-50 pl-5 pr-1.5 transition focus-within:border-primary-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-100 md:order-none md:mx-auto md:w-auto md:max-w-xl md:flex-1 dark:border-ink-700 dark:bg-ink-800 dark:focus-within:bg-ink-800 dark:focus-within:ring-primary-900/40"
        >
          <Search className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phones, laptops, watches and more"
            aria-label="Search products"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none dark:text-ink-50"
          />
          <button type="submit" className="btn-primary !rounded-full !px-4 !py-2 text-xs">
            Search
          </button>
        </form>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {canInstall && (
            <button
              type="button"
              onClick={install}
              className="btn-primary !px-3 !py-2 text-xs sm:!px-4"
              aria-label="Install Price Finder Globally app"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={openWishlist}
            aria-label={`Open wishlist, ${wishlistCount} saved`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition hover:bg-primary-50 hover:text-primary-600 dark:text-ink-300 dark:hover:bg-ink-800"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
