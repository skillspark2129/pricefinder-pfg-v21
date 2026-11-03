import { Link } from 'react-router-dom';
import ProsePage from '@/components/ProsePage';
import { usePageMeta } from '@/hooks/usePageMeta';

const AFFILIATE_PROGRAMS = [
  'Amazon USA',
  'Amazon UK',
  'Amazon UAE',
  'Daraz',
  'AliExpress',
  'Alibaba',
  'Noon',
  'Shein',
  'eBay',
  'Temu',
  'PriceOye',
];

export default function AffiliateDisclosure() {
  usePageMeta({
    title: 'Affiliate Disclosure - Price Finder Globally',
    description:
      'Price Finder Globally participates in affiliate programmes with 11 stores, including Amazon, Daraz, AliExpress, Alibaba, Noon, Shein, eBay, Temu and PriceOye.',
  });

  return (
    <ProsePage eyebrow="Transparency" title="Affiliate Disclosure" updated="2 November 2026">
      <p>
        Price Finder Globally (PFG) is a price comparison website. Some of the buy links on this site are affiliate links.
        This page explains what that means for you.
      </p>

      <h2>Our affiliate programmes</h2>
      <p>PFG takes part in the affiliate programmes of the following stores:</p>
      <ul>
        {AFFILIATE_PROGRAMS.map((program) => (
          <li key={program}>{program}</li>
        ))}
      </ul>

      <h2>What this means for you</h2>
      <p>
        When you click an affiliate link and buy something, the store may pay PFG a commission. The store, not you, pays
        this commission. Using our links does not add any cost to your order.
      </p>

      <h2>Prices can change</h2>
      <p>
        Prices, discounts, stock and delivery charges change often and may differ from what you see on PFG. Always check
        the final price on the store's website before you buy.
      </p>

      <h2>Trademarks</h2>
      <p>
        All store names and logos shown on PFG, including Amazon, Daraz, AliExpress, Alibaba, Noon, Shein, eBay, Temu and
        PriceOye, are trademarks of their respective owners. They are used only to identify the stores being compared. PFG is
        not sponsored by or affiliated with these companies unless stated otherwise.
      </p>

      <h2>Questions</h2>
      <p>
        For questions about our affiliate relationships, visit our <Link to="/contact">contact page</Link> or read our{' '}
        <Link to="/privacy-policy">Privacy Policy</Link>.
      </p>
    </ProsePage>
  );
}
