import { Link } from 'react-router-dom';
import ProsePage from '@/components/ProsePage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function ReturnPolicy() {
  usePageMeta({
    title: 'Return Policy - Returns Handled by the Store',
    description:
      'Price Finder Globally does not accept returns. Returns and refunds for Daraz, PriceOye and other stores follow each store\'s own return policy.',
  });

  return (
    <ProsePage eyebrow="Policies" title="Return Policy">
      <h2>Returns are handled by the store</h2>
      <p>
        Price Finder Globally does not sell products, so we cannot accept returns, exchange items or issue refunds. Every product you see
        on our website is sold by a third-party store, and that store's return and refund policy applies to your purchase. This
        includes the return window, the condition the item must be in, and whether the store or the courier covers return
        shipping.
      </p>

      <h2>How to start a return</h2>
      <p>If you need to return a product, follow these general steps:</p>
      <ul>
        <li>Open your order in the store's app or website, or use the order number from your confirmation message.</li>
        <li>Look for the return, refund or help option and select the reason for your return.</li>
        <li>Keep the original packaging, accessories, invoice and any warranty card in good condition.</li>
        <li>Follow the store's instructions for sending the item back, including any return code or pickup request.</li>
        <li>Keep proof of postage or pickup until the refund is confirmed.</li>
      </ul>

      <h2>Common return reasons</h2>
      <p>
        Stores usually accept returns for items that arrive damaged, defective, incomplete, or significantly different from
        the product description. Many stores also accept returns for wrong items, and some offer a change-of-mind return within
        a fixed number of days. Items that have been used, damaged by the customer, or sold as final sale may not be eligible.
        Each store sets its own rules, so please read them before you order.
      </p>

      <h2>Refund timelines</h2>
      <p>
        Once a return has been received and inspected by the store, the refund is processed according to the store's timeline.
        Refunds may go back to your original payment method, to a store credit balance, or to a bank or wallet account. Refund
        processing times vary between stores and payment providers, so please check the store's refund details if the money has
        not appeared within the stated period.
      </p>

      <h2>Price changes after purchase</h2>
      <p>
        If a product drops in price after you have bought it, the store's own price-adjustment policy applies. Price Finder Globally
        cannot request a price difference on your behalf, but you can check the store's price protection terms and contact its
        support team if you believe you are entitled to an adjustment.
      </p>

      <h2>Warranty claims</h2>
      <p>
        Warranty repairs and replacements for electronics and appliances are usually handled by the brand's authorised service
        centre or by the store. Keep your warranty card and invoice safe, and contact the brand or store if a fault appears
        after the return period has ended. Price Finder Globally does not provide warranty service.
      </p>

      <h2>When to contact us</h2>
      <p>
        We cannot process returns or refunds, but we can help if a store is listed incorrectly on our website, or if a link
        on Price Finder Globally does not work. Please send us a message on our contact page with the product name and the problem you
        are seeing, and we will investigate and correct our listing where needed.
      </p>

      <h2>Related policies</h2>
      <p>
        For delivery information, read our <Link to="/shipping-policy">Shipping Policy</Link>. For general rules about using
        this website, see our <Link to="/terms">Terms and Conditions</Link>.
      </p>
    </ProsePage>
  );
}
