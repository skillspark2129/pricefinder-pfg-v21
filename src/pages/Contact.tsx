import { MapPin } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Contact() {
  usePageMeta({
    title: 'Contact Us',
    description:
      'Send Price Finder Globally a message or complain through the contact form. Based in Peshawar, Khyber Pakhtunkhwa, Pakistan.',
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Contact</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">We are here to help</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          Questions about a price, a store or your wishlist? Send us a message or complain using the form below.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        <div className="space-y-4">
          <div className="card flex items-start gap-4 p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300">
              <MapPin className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">Address</span>
              <span className="mt-1 block text-sm text-ink-600 dark:text-ink-300">Peshawar, Khyber Pakhtunkhwa, Pakistan</span>
            </span>
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="mb-6 text-xl font-bold">Send us a message or complain</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
