import { Link } from 'react-router-dom';
import ProsePage from '@/components/ProsePage';
import { usePageMeta } from '@/hooks/usePageMeta';

const FAQS: { question: string; answer: string }[] = [
  {
    question: 'What is Price Finder Globally?',
    answer:
      'Price Finder Globally is a price comparison website that shows prices for the same product from 11 global stores, including Daraz, Amazon USA, Amazon UK, Amazon UAE, AliExpress, Alibaba, Noon, Shein, eBay, Temu and PriceOye, so you can see where to buy at the lowest price.',
  },
  {
    question: 'Is Price Finder Globally free to use?',
    answer:
      'Yes. Searching, comparing prices, viewing price history and saving products to your wishlist are all free. You never have to create an account to use the main features.',
  },
  {
    question: 'Do you sell products on this website?',
    answer:
      'No. Price Finder Globally does not sell, stock or ship products. When you choose a store, you buy from that store on its own website, and the store handles payment, delivery and returns.',
  },
  {
    question: 'How does the affiliate system work?',
    answer:
      'Some of our store buttons are affiliate links. If you click one and buy a product, the store may pay us a commission. This is how we keep the site running. Read our Affiliate Disclosure page for the full explanation.',
  },
  {
    question: 'Do I pay more when I buy through your links?',
    answer:
      'No. The commission is paid by the store, not by you. The price you pay is the same whether you arrive from Price Finder Globally or from any other website.',
  },
  {
    question: 'Are the prices on Price Finder Globally always up to date?',
    answer:
      'We work hard to keep prices accurate, but online prices change often and flash sales can end quickly. Always check the final price, delivery charges and discounts on the store page before you pay.',
  },
  {
    question: 'Which stores do you compare?',
    answer:
      'We compare prices across 11 global stores: Daraz, Amazon USA, Amazon UK, Amazon UAE, AliExpress, Alibaba, Noon, Shein, eBay, Temu and PriceOye.',
  },
  {
    question: 'How do I know which store has the best price?',
    answer:
      'On each product page, the store with the lowest price is marked with a "Best price" label, and its button is shown first. The price table lists every store so you can compare delivery times and stock status as well.',
  },
  {
    question: 'What does the price history chart show?',
    answer:
      'The chart shows the average price of a product over the last six months. It helps you judge whether a current discount is a genuine bargain or a price that has simply been moved up and down.',
  },
  {
    question: 'Can I save products to look at later?',
    answer:
      'Yes. Tap the heart icon on any product to add it to your wishlist. Your wishlist is saved in your browser, so it stays on the device you used. Clearing your browser data will remove it.',
  },
  {
    question: 'How do I contact Price Finder Globally?',
    answer: 'You can send us a message or complaint through our contact form. We aim to reply within two working days.',
  },
  {
    question: 'Do you ship products to my address?',
    answer:
      'No. Delivery is arranged by the store you buy from. Daraz and PriceOye usually deliver within 3 to 7 working days in major cities. Check our Shipping Policy page for more details.',
  },
  {
    question: 'What if my order is damaged or wrong?',
    answer:
      'Contact the store you bought from as soon as possible and follow its return process. Price Finder Globally cannot accept returns, but you can email us if a product listing on our website seems incorrect.',
  },
  {
    question: 'Can Price Finder Globally get me a refund?',
    answer:
      'We cannot issue refunds because we do not handle payments. Refunds are processed by the store where you placed your order. Keep your order number and invoice so you can follow up with the store.',
  },
  {
    question: 'Is my personal information safe?',
    answer:
      'We collect only the information you choose to send us, such as your email for the newsletter or a contact message. We do not sell personal data. Read our Privacy Policy for a full explanation of what we collect and how we protect it.',
  },
  {
    question: 'How do I unsubscribe from the newsletter?',
    answer:
      'Every newsletter email includes an unsubscribe link at the bottom. You can also email us and ask us to remove your address, and we will do so promptly.',
  },
  {
    question: 'Why is a product missing from the website?',
    answer:
      'We list products that we have verified against the stores we track. If a product you are looking for is missing, send it to us through the contact form and we will consider adding it.',
  },
  {
    question: 'Can I use Price Finder Globally on my phone?',
    answer:
      'Yes. The website is designed for mobile first and works well on all modern phones. You can also install it to your home screen from the Install App button in the header, so it opens like an app.',
  },
  {
    question: 'Do you offer discount codes?',
    answer:
      'We highlight deals and flash sales when stores publish them, but we do not create discount codes ourselves. Vouchers offered by stores are shown on their own websites during checkout.',
  },
];

export default function Faq() {
  usePageMeta({
    title: 'Frequently Asked Questions',
    description:
      'Answers to common questions about Price Finder Globally, including how it works, whether it is free, how affiliate links work and how to contact us.',
  });

  return (
    <ProsePage eyebrow="Help" title="Frequently asked questions">
      <p>
        Here are answers to the questions shoppers ask us most often. If you cannot find what you need, you can always reach
        our team through the <Link to="/contact">contact page</Link>.
      </p>

      <div className="mt-8 divide-y divide-ink-200 overflow-hidden rounded-2xl border border-ink-200 dark:divide-ink-700 dark:border-ink-700">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group bg-white px-5 py-4 open:bg-primary-50/40 dark:bg-ink-800 dark:open:bg-primary-900/20">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-ink-900 dark:text-white [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span className="text-primary-600 transition-transform duration-300 group-open:rotate-45 dark:text-primary-400" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">{faq.answer}</p>
          </details>
        ))}
      </div>
    </ProsePage>
  );
}
