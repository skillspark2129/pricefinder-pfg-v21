import { Link } from 'react-router-dom';
import ProsePage from '@/components/ProsePage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function ShippingPolicy() {
  usePageMeta({
    title: 'Shipping Policy - Delivery by Partner Stores',
    description:
      'Price Finder Globally does not ship products. Daraz, PriceOye and other partner stores deliver directly, usually within 3 to 7 days.',
  });

  return (
    <ProsePage eyebrow="Policies" title="Shipping Policy">
      <h2>We do not ship products</h2>
      <p>
        Price Finder Globally is a price comparison website. We do not hold stock, pack orders or deliver products to your door. When
        you choose a product and click a store button, you complete your purchase on that store's own website. The store
        processes your payment and arranges delivery, so shipping is handled entirely by the store you buy from.
      </p>

      <h2>Typical delivery times</h2>
      <p>
        Delivery times depend on the store, the product, your city and the courier that the store uses. As a general guide,
        orders from large marketplaces such as Daraz and PriceOye usually arrive within 3 to 7 working days in major cities,
        and may take longer for remote areas. Each product page shows the delivery estimate that the store provided at the
        time of our most recent check, but this is only an estimate and the store's checkout page is the final word.
      </p>

      <h2>Shipping charges</h2>
      <p>
        Some stores offer free delivery on certain products or above a minimum order value, while others charge a flat fee or
        a fee based on weight and distance. Any shipping charge will be shown to you by the store before you pay. The prices we
        display do not always include delivery, so compare the total cost at checkout when you are choosing between stores.
      </p>

      <h2>Tracking your order</h2>
      <p>
        Once you have placed an order, the store will send you its order confirmation and tracking details, usually by SMS or
        email. Please keep these messages until your product has arrived. If you do not receive a tracking number, contact the
        store directly using the details in your order confirmation.
      </p>

      <h2>Delayed or missing deliveries</h2>
      <p>
        If your order is delayed beyond the store's stated timeframe, or it has not arrived, the first step is to contact the
        store's customer support. Most stores have dedicated help centres for delivery problems. If you need help identifying
        the right contact channel, you can send us a message on our contact page and we will point you in the right
        direction, although we cannot change a store's delivery decision on your behalf.
      </p>

      <h2>Cash on delivery and payment</h2>
      <p>
        Payment options, including cash on delivery, online payment and instalment plans, are decided by each store. Please check
        the payment options at checkout before you complete your order. Price Finder Globally never asks you to send money to us directly.
      </p>

      <h2>Related policies</h2>
      <p>
        Read our <Link to="/return-policy">Return Policy</Link> to understand how to send back a product, and our{' '}
        <Link to="/terms">Terms and Conditions</Link> for general rules about using this website.
      </p>
    </ProsePage>
  );
}
