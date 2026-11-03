import ProsePage from '@/components/ProsePage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function Terms() {
  usePageMeta({
    title: 'Terms of Service - Price Finder Globally',
    description:
      'Terms of service for Price Finder Globally (PFG), a price comparison service that is not a seller and does not handle purchases.',
  });

  return (
    <ProsePage eyebrow="Legal" title="Terms of Service" updated="2 November 2026">
      <p>
        By using Price Finder Globally (PFG), you agree to these terms. If you do not agree, please stop using the website.
      </p>

      <h2>1. What PFG is</h2>
      <p>
        PFG is a price comparison service. We collect prices from third-party stores and show them side by side. We are
        not a seller, we do not own or ship the products listed, and we do not process payments.
      </p>

      <h2>2. Prices come from third parties</h2>
      <p>
        Prices, stock and delivery details come from third-party stores and may change at any time. Always confirm the
        final price, taxes and delivery charges on the store's website before you buy.
      </p>

      <h2>3. Your purchases</h2>
      <p>
        Every purchase is made directly with the store you choose, and that store's terms, shipping policy and return
        policy apply. PFG is not responsible for the purchase, delivery, quality, refund or any dispute with a store.
      </p>

      <h2>4. Affiliate links</h2>
      <p>
        Some links on PFG are affiliate links. Stores may pay us a commission when you buy through them, at no extra cost
        to you. See our <a href="/affiliate-disclosure">Affiliate Disclosure</a> for details.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        Do not use PFG to send spam, attempt to disrupt or break the website, copy our content for commercial use without
        permission, or mislead other shoppers.
      </p>

      <h2>6. Limitation of liability</h2>
      <p>
        PFG is provided "as is" and "as available". To the fullest extent permitted by law, PFG is not liable for losses
        arising from your use of the website, from reliance on price information, or from transactions with third-party
        stores.
      </p>

      <h2>7. Changes to these terms</h2>
      <p>
        We may update these terms. The date at the top of this page shows when they last changed. Continued use of PFG
        after a change means you accept the updated terms.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about these terms? Email <a href="mailto:support@pricefinderglobally.com">support@pricefinderglobally.com</a>.
      </p>
    </ProsePage>
  );
}
