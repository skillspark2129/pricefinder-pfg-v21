import { Link } from 'react-router-dom';
import ProsePage from '@/components/ProsePage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function About() {
  usePageMeta({
    title: 'About Price Finder Globally - PFG',
    description:
      'Price Finder Globally (PFG) helps shoppers find the lowest price worldwide across 11 stores, including Daraz, Amazon USA, UK and UAE, AliExpress, Alibaba, Noon, Shein, eBay, Temu and PriceOye.',
  });

  return (
    <ProsePage eyebrow="About us" title="About Price Finder Globally">
      <p>
        Price Finder Globally (PFG) exists for one reason: to help you find the lowest price for the product you want,
        wherever it is sold. The same item can cost very different amounts on different stores and in different countries,
        and the cheapest option is rarely the first one you see.
      </p>

      <h2>Our mission</h2>
      <p>
        Our mission is to help shoppers around the world spend wisely. We bring prices from trusted stores together in one
        clear place, so you can compare them in seconds instead of opening tab after tab.
      </p>

      <h2>The stores we compare</h2>
      <p>
        PFG currently compares prices across 11 stores: Daraz, Amazon USA, Amazon UK, Amazon UAE, AliExpress, Alibaba,
        Noon, Shein, eBay, Temu and PriceOye. We show each store's price, and where it is available, the shopping link
        for that store.
      </p>

      <h2>How we earn money</h2>
      <p>
        PFG is free to use. When you buy a product through one of our store links, the store may pay us a small
        commission. You do not pay anything extra, and the price you see is the price you pay. We explain this in full on
        our <Link to="/affiliate-disclosure">Affiliate Disclosure</Link> page.
      </p>

      <h2>Our commitment to you</h2>
      <ul>
        <li>We show prices as accurately as we can and tell you when a price may have changed.</li>
        <li>We never rank a store higher just because it pays us more.</li>
        <li>We do not sell your personal information.</li>
        <li>We answer questions and feedback honestly and promptly.</li>
      </ul>

      <h2>Get in touch</h2>
      <p>
        Found a price error, want us to look at a product, or have a question? Send us a message through our{' '}
        <Link to="/contact">contact page</Link>.
      </p>
    </ProsePage>
  );
}
