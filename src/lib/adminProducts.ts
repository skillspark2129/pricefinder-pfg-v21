import { saveProductAffiliateLinks, type AffiliateLinkMap } from '@/lib/affiliateLinks';
import { fetchStores } from '@/lib/catalog';
import { supabase } from '@/lib/supabase';

export interface ProductFormValues {
  name: string;
  imageUrl: string;
  price: number;
  originalPrice: number;
  category: string;
  description: string;
  affiliateLinks: AffiliateLinkMap;
  commission: number;
}

const OFFER_STORES = ['Daraz', 'PriceOye'] as const;

export function defaultDescription(name: string): string {
  return `Best price for ${name} in Pakistan - Compare on Price Finder Globally`;
}

export async function saveProduct(values: ProductFormValues, productId: string | null): Promise<string> {
  const stores = await fetchStores();
  const productFields = {
    title: values.name,
    brand: values.name.split(' ')[0],
    category: values.category,
    image_urls: [values.imageUrl],
    description: values.description,
    list_price: values.originalPrice,
    commission_percent: values.commission,
  };

  let id = productId;
  if (productId) {
    const { error } = await supabase.from('products').update(productFields).eq('id', productId);
    if (error) throw new Error(error.message);
  } else {
    const { data, error } = await supabase
      .from('products')
      .insert({ ...productFields, specs: [], sample_reviews: [], rating: 0, review_count: 0 })
      .select('id')
      .single();
    if (error) throw new Error(error.message);
    id = data.id;
  }
  if (!id) throw new Error('The product could not be saved.');

  for (const storeName of OFFER_STORES) {
    const store = stores.find((row) => row.name === storeName);
    if (!store) throw new Error(`${storeName} is missing from the store list.`);
    const link = storeName === 'Daraz' ? values.affiliateLinks.daraz : values.affiliateLinks.priceoye;
    await saveOffer(id, store.id, values.price, link.trim());
  }

  await saveProductAffiliateLinks(id, values.affiliateLinks);

  return id;
}

async function saveOffer(productId: string, storeId: string, price: number, link: string): Promise<void> {
  const { data: existing, error: findError } = await supabase
    .from('product_offers')
    .select('id')
    .eq('product_id', productId)
    .eq('store_id', storeId)
    .maybeSingle();
  if (findError) throw new Error(findError.message);

  if (!link) {
    if (!existing) return;
    const { error } = await supabase.from('product_offers').delete().eq('id', existing.id);
    if (error) throw new Error(error.message);
    return;
  }

  const offerFields = { price, affiliate_url: link, delivery_text: 'Check store for delivery', stock_status: 'In stock' };
  if (existing) {
    const { error } = await supabase.from('product_offers').update(offerFields).eq('id', existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from('product_offers').insert({ product_id: productId, store_id: storeId, ...offerFields });
    if (error) throw new Error(error.message);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw new Error(error.message);
}
