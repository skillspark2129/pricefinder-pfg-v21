import { supabase } from '@/lib/supabase';

export const AFFILIATE_PLATFORMS = [
  { code: 'daraz', label: 'Daraz 🇵🇰 PK' },
  { code: 'amazon_usa', label: 'Amazon USA 🇺🇸' },
  { code: 'amazon_uk', label: 'Amazon UK 🇬🇧' },
  { code: 'amazon_uae', label: 'Amazon UAE 🇦🇪' },
  { code: 'aliexpress', label: 'AliExpress' },
  { code: 'alibaba', label: 'Alibaba' },
  { code: 'noon', label: 'Noon' },
  { code: 'shein', label: 'Shein' },
  { code: 'ebay', label: 'eBay' },
  { code: 'temu', label: 'Temu' },
  { code: 'priceoye', label: 'PriceOye' },
] as const;

export type AffiliatePlatform = (typeof AFFILIATE_PLATFORMS)[number]['code'];
export type AffiliateLinkMap = Record<AffiliatePlatform, string>;

export interface ProductAffiliateLink {
  platform: AffiliatePlatform;
  label: string;
  url: string;
}

export function emptyAffiliateLinkMap(): AffiliateLinkMap {
  return Object.fromEntries(AFFILIATE_PLATFORMS.map((platform) => [platform.code, ''])) as AffiliateLinkMap;
}

export function toAffiliateLinkMap(links: ProductAffiliateLink[]): AffiliateLinkMap {
  const map = emptyAffiliateLinkMap();
  for (const link of links) map[link.platform] = link.url;
  return map;
}

export async function fetchProductAffiliateLinks(productId: string): Promise<ProductAffiliateLink[]> {
  const { data, error } = await supabase
    .from('product_affiliate_links')
    .select('platform, url')
    .eq('product_id', productId);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as { platform: string; url: string }[];
  return AFFILIATE_PLATFORMS.flatMap((platform) => {
    const row = rows.find((candidate) => candidate.platform === platform.code);
    return row && row.url.trim() !== ''
      ? [{ platform: platform.code, label: platform.label, url: row.url }]
      : [];
  });
}

export async function saveProductAffiliateLinks(productId: string, links: AffiliateLinkMap): Promise<void> {
  const filled = AFFILIATE_PLATFORMS.filter((platform) => links[platform.code].trim() !== '');
  const cleared = AFFILIATE_PLATFORMS.filter((platform) => links[platform.code].trim() === '');

  if (filled.length > 0) {
    const { error } = await supabase.from('product_affiliate_links').upsert(
      filled.map((platform) => ({
        product_id: productId,
        platform: platform.code,
        url: links[platform.code].trim(),
        updated_at: new Date().toISOString(),
      })),
      { onConflict: 'product_id,platform' }
    );
    if (error) throw new Error(error.message);
  }

  if (cleared.length > 0) {
    const { error } = await supabase
      .from('product_affiliate_links')
      .delete()
      .eq('product_id', productId)
      .in('platform', cleared.map((platform) => platform.code));
    if (error) throw new Error(error.message);
  }
}
