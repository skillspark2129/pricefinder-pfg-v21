export type SupportedStore = 'Daraz' | 'PriceOye';

const STORE_HOSTS: { store: SupportedStore; host: string }[] = [
  { store: 'Daraz', host: 'daraz.pk' },
  { store: 'PriceOye', host: 'priceoye.pk' },
];

export function parseProductLink(raw: string): { url: URL; store: SupportedStore } | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  const match = STORE_HOSTS.find(({ host }) => hostname === host || hostname.endsWith(`.${host}`));
  return match ? { url, store: match.store } : null;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function nameFromProductLink(url: URL): string {
  const lastSegment = url.pathname.split('/').filter(Boolean).pop() ?? '';
  const slug = safeDecode(lastSegment)
    .replace(/\.html?$/i, '')
    .replace(/-\d+$/, '');
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
