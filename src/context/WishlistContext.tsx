import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const WISHLIST_KEY = 'pf_wishlist';

interface WishlistContextValue {
  wishlistIds: string[];
  wishlistCount: number;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  isDrawerOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readWishlist(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>(readWishlist);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlistIds,
      wishlistCount: wishlistIds.length,
      isWishlisted: (productId) => wishlistIds.includes(productId),
      toggleWishlist: (productId) =>
        setWishlistIds((current) =>
          current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
        ),
      isDrawerOpen,
      openWishlist: () => setIsDrawerOpen(true),
      closeWishlist: () => setIsDrawerOpen(false),
    }),
    [wishlistIds, isDrawerOpen]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
