import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <Compass className="h-12 w-12 text-primary-500" />
      <p className="text-5xl font-bold text-primary-500">404</p>
      <h1 className="text-2xl font-bold">We could not find that page</h1>
      <p className="text-sm text-ink-500 dark:text-ink-400">The link may be broken or the page has moved.</p>
      <Link to="/" className="btn-primary">
        <ArrowLeft className="h-4 w-4" /> Go to home page
      </Link>
    </div>
  );
}
