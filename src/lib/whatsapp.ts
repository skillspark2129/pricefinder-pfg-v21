export function normalizeWhatsAppNumber(raw: string): string | null {
  const digits = raw.replace(/[\s\-()+]/g, '');
  if (!/^\d{7,15}$/.test(digits)) return null;
  if (digits.length === 10 && digits.startsWith('3')) return `92${digits}`;
  return digits.startsWith('0') ? `92${digits.slice(1)}` : digits;
}

export function buildWhatsAppChatUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
