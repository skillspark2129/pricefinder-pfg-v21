import { ArrowLeft, Loader2, Save, Wand2 } from 'lucide-react';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminShell from '@/components/AdminShell';
import AffiliateLinkFields from '@/components/AffiliateLinkFields';
import { CATEGORIES } from '@/lib/constants';
import { fetchProductDetail, NotFoundError } from '@/lib/catalog';
import { defaultDescription, saveProduct, type ProductFormValues } from '@/lib/adminProducts';
import { AFFILIATE_PLATFORMS, emptyAffiliateLinkMap, toAffiliateLinkMap, type AffiliateLinkMap, type AffiliatePlatform } from '@/lib/affiliateLinks';
import { nameFromProductLink, parseProductLink } from '@/lib/productLink';

interface FormState {
  name: string;
  imageUrl: string;
  price: string;
  originalPrice: string;
  category: string;
  description: string;
  links: AffiliateLinkMap;
  commission: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  imageUrl: '',
  price: '',
  originalPrice: '',
  category: CATEGORIES[0].name,
  description: '',
  links: emptyAffiliateLinkMap(),
  commission: '10',
};

const INPUT = 'input-base';

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [originalTouched, setOriginalTouched] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [autoMessage, setAutoMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>(isEdit ? 'loading' : 'ready');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoadStatus('loading');
    fetchProductDetail(id)
      .then(({ product, offers, affiliateLinks }) => {
        if (cancelled) return;
        const links = toAffiliateLinkMap(affiliateLinks);
        const daraz = offers.find((offer) => offer.store.name === 'Daraz');
        const priceOye = offers.find((offer) => offer.store.name === 'PriceOye');
        links.daraz ||= daraz?.affiliate_url ?? '';
        links.priceoye ||= priceOye?.affiliate_url ?? '';
        setForm({
          name: product.title,
          imageUrl: product.image_urls[0] ?? '',
          price: String(offers[0]?.price ?? product.list_price),
          originalPrice: String(product.list_price),
          category: product.category,
          description: product.description,
          links,
          commission: String(product.commission_percent),
        });
        setOriginalTouched(true);
        setLoadStatus('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('Product load failed', error);
        setLoadStatus(error instanceof NotFoundError ? 'missing' : 'error');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const update = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const updateLink = (platform: AffiliatePlatform, value: string) =>
    setForm((current) => ({ ...current, links: { ...current.links, [platform]: value } }));

  const handlePriceChange = (value: string) => {
    setForm((current) => {
      const price = Number(value);
      const originalPrice =
        !originalTouched && Number.isFinite(price) && price > 0 ? String(Math.round(price * 1.2)) : current.originalPrice;
      return { ...current, price: value, originalPrice };
    });
  };

  const handleAutoFill = () => {
    const parsed = parseProductLink(linkInput);
    if (!parsed) {
      setAutoMessage({ tone: 'error', text: 'Paste a full Daraz or PriceOye product link (starting with https://).' });
      return;
    }
    const link = linkInput.trim();
    const name = nameFromProductLink(parsed.url);
    const platform: AffiliatePlatform = parsed.store === 'Daraz' ? 'daraz' : 'priceoye';
    setForm((current) => ({
      ...current,
      name,
      links: { ...current.links, [platform]: link },
      description: current.description || defaultDescription(name),
    }));
    setAutoMessage({
      tone: 'success',
      text: `Name and ${parsed.store} link filled in. Now paste the image link and enter the price.`,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    const values = toProductValues(form);
    if (typeof values === 'string') {
      setFormError(values);
      return;
    }
    setSaving(true);
    try {
      await saveProduct(values, id ?? null);
      navigate('/admin/products', {
        replace: true,
        state: { message: isEdit ? 'Product updated and live on the site.' : 'Product saved and live on the site.' },
      });
    } catch (error) {
      console.error('Product save failed', error);
      setFormError('The product could not be saved. Check your connection, sign in again with your password, then retry.');
    } finally {
      setSaving(false);
    }
  };

  if (loadStatus === 'loading') {
    return (
      <AdminShell>
        <p className="py-16 text-center text-sm text-ink-500">Loading product</p>
      </AdminShell>
    );
  }

  if (loadStatus === 'missing' || loadStatus === 'error') {
    return (
      <AdminShell>
        <div className="card mx-auto max-w-lg p-8 text-center">
          <p className="font-semibold">{loadStatus === 'missing' ? 'This product no longer exists.' : 'The product could not be loaded.'}</p>
          <Link to="/admin/products" className="mt-4 inline-block text-sm font-semibold text-primary-600 underline dark:text-primary-400">
            Back to products
          </Link>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="mb-8">
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{isEdit ? 'Edit product' : 'Add new product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {!isEdit && (
          <section className="card space-y-4 p-6">
            <label htmlFor="product-link" className="block text-base font-bold">
              Paste Daraz Product Link
            </label>
            <input
              id="product-link"
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="https://www.daraz.pk/products/iphone-14-123.html"
              className="input-base py-4 text-base"
            />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={handleAutoFill} className="btn-primary">
                <Wand2 className="h-4 w-4" /> Auto Fill From Link
              </button>
              {autoMessage && (
                <p role="status" className={`text-sm font-medium ${autoMessage.tone === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-600 dark:text-red-400'}`}>
                  {autoMessage.text}
                </p>
              )}
            </div>
          </section>
        )}

        <section className="card grid gap-6 p-6 sm:grid-cols-2">
          <Field label="Product name" htmlFor="product-name" className="sm:col-span-2">
            <input id="product-name" value={form.name} onChange={(e) => update('name', e.target.value)} className={INPUT} />
          </Field>

          <Field
            label="Paste image link"
            htmlFor="product-image"
            hint="Right-click the product image and choose Copy image address."
            className="sm:col-span-2"
          >
            <input
              id="product-image"
              type="url"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              placeholder="https://..."
              className={INPUT}
            />
          </Field>

          {form.imageUrl && (
            <div className="sm:col-span-2">
              <img src={form.imageUrl} alt="Product preview" className="h-32 w-32 rounded-xl bg-white object-contain p-2 shadow-sm" />
            </div>
          )}

          <Field label="Price (Rs.)" htmlFor="product-price">
            <input
              id="product-price"
              inputMode="numeric"
              value={form.price}
              onChange={(e) => handlePriceChange(e.target.value)}
              className={INPUT}
            />
          </Field>

          <Field label="Original price (Rs.)" htmlFor="product-original-price" hint="Filled as price plus 20%. You can change it.">
            <input
              id="product-original-price"
              inputMode="numeric"
              value={form.originalPrice}
              onChange={(e) => {
                setOriginalTouched(true);
                update('originalPrice', e.target.value);
              }}
              className={INPUT}
            />
          </Field>

          <Field label="Category" htmlFor="product-category">
            <select id="product-category" value={form.category} onChange={(e) => update('category', e.target.value)} className={INPUT}>
              {CATEGORIES.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Commission (%)" htmlFor="product-commission">
            <input
              id="product-commission"
              inputMode="numeric"
              value={form.commission}
              onChange={(e) => update('commission', e.target.value)}
              className={INPUT}
            />
          </Field>

          <Field label="Description" htmlFor="product-description" className="sm:col-span-2">
            <textarea
              id="product-description"
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className={INPUT}
            />
          </Field>

          <AffiliateLinkFields links={form.links} onChange={updateLink} />
        </section>

        {formError && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {formError}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link to="/admin/products" className="rounded-xl px-5 py-3 text-sm font-semibold text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-700">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-green-700 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Product - Go Live
          </button>
        </div>
      </form>
    </AdminShell>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  className = '',
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink-500 dark:text-ink-400">{hint}</p>}
    </div>
  );
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function toProductValues(form: FormState): ProductFormValues | string {
  const name = form.name.trim();
  const imageUrl = form.imageUrl.trim();
  const price = Number(form.price);
  const originalPrice = Number(form.originalPrice);
  const commission = Number(form.commission);
  const links = Object.fromEntries(
    AFFILIATE_PLATFORMS.map((platform) => [platform.code, form.links[platform.code].trim()])
  ) as AffiliateLinkMap;

  if (!name) return 'Enter the product name.';
  if (!isHttpUrl(imageUrl)) return 'Paste the image link (right-click the image and choose Copy image address).';
  if (!Number.isInteger(price) || price <= 0) return 'Enter the price in rupees, for example 99999.';
  if (!Number.isInteger(originalPrice) || originalPrice <= 0) return 'Enter the original price in rupees.';
  if (!CATEGORIES.some((category) => category.name === form.category)) return 'Choose a category.';
  if (!Number.isInteger(commission) || commission < 0 || commission > 100) return 'Commission must be a whole number from 0 to 100.';
  if (AFFILIATE_PLATFORMS.every((platform) => links[platform.code] === '')) {
    return 'Paste at least one affiliate link.';
  }
  const invalid = AFFILIATE_PLATFORMS.find((platform) => links[platform.code] !== '' && !isHttpUrl(links[platform.code]));
  if (invalid) return `The ${invalid.label} affiliate link is not a valid web address.`;

  return {
    name,
    imageUrl,
    price,
    originalPrice,
    category: form.category,
    description: form.description.trim() || defaultDescription(name),
    affiliateLinks: links,
    commission,
  };
}
