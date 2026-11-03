import ProsePage from '@/components/ProsePage';
import { usePageMeta } from '@/hooks/usePageMeta';

export default function PrivacyPolicy() {
  usePageMeta({
    title: 'Privacy Policy - Price Finder Globally',
    description:
      'How Price Finder Globally (PFG) handles your information, including contact messages, newsletter emails, cookies and affiliate links.',
  });

  return (
    <ProsePage eyebrow="Legal" title="Privacy Policy" updated="2 November 2026">
      <p>
        This Privacy Policy explains what information Price Finder Globally (PFG) collects, why, and what choices you have.
      </p>

      <h2>1. Information you give us</h2>
      <p>
        If you send us a message through the contact form or subscribe to our newsletter, we collect the details you
        provide, such as your name, email address and message. We do not ask for bank details or national ID numbers.
      </p>

      <h2>2. Basic technical information</h2>
      <p>
        Like most websites, PFG receives basic technical information such as browser type, device type and pages viewed.
        We use it only to keep the website running and to improve it. We do not build personal profiles.
      </p>

      <h2>3. Cookies and local storage</h2>
      <p>
        PFG saves a few things on your device, such as your wishlist and your light or dark theme choice. Stores we link
        to may set their own cookies. You can block or delete cookies in your browser settings at any time.
      </p>

      <h2>4. Affiliate links</h2>
      <p>
        When you click a store link on PFG, the store may place a cookie so it can recognise that you came from us. The
        store handles your purchase and payment under its own privacy policy. PFG does not receive your card details or
        delivery address.
      </p>

      <h2>5. How we use your information</h2>
      <ul>
        <li>To reply to your messages and complaints.</li>
        <li>To send the newsletter you asked for. You can unsubscribe at any time.</li>
        <li>To protect the website against spam and abuse.</li>
      </ul>

      <h2>6. We do not sell your data</h2>
      <p>
        PFG does not sell, rent or trade your personal information. We share it only when needed to run the service, such
        as with our database provider, or when the law requires it.
      </p>

      <h2>7. Your rights</h2>
      <p>
        You can ask what information we hold about you, ask us to correct or delete it, or stop receiving emails. Contact us
        at <a href="mailto:support@pricefinderglobally.com">support@pricefinderglobally.com</a>.
      </p>

      <h2>8. Links to other websites</h2>
      <p>
        PFG links to many stores. Their privacy policies apply once you leave our website, and we are not responsible for
        how they handle your information.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top of this page shows when it last changed.
      </p>

      <h2>10. Contact us</h2>
      <p>
        Questions about this policy? Email <a href="mailto:support@pricefinderglobally.com">support@pricefinderglobally.com</a>.
      </p>
    </ProsePage>
  );
}
