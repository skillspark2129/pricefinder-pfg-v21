import { ArrowLeft, Clock } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { findBlogPost } from '@/lib/blogPosts';
import { formatBlogDate } from '@/lib/format';
import NotFound from '@/pages/NotFound';
import ProsePage from '@/components/ProsePage';

export default function BlogPost() {
  const { slug } = useParams();
  const post = findBlogPost(slug);

  usePageMeta({
    title: post?.title ?? 'Blog',
    description: post?.description ?? 'Shopping guides from Price Finder Globally.',
  });

  if (!post) return <NotFound />;

  return (
    <div>
      <ProsePage eyebrow={`Blog · ${formatBlogDate(post.published)}`} title={post.title}>
        <p className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-400">
          <Clock className="h-4 w-4" /> {post.readMinutes} min read
        </p>
        <p className="text-base">{post.intro}</p>
        {post.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </section>
        ))}
        <p>
          Ready to compare? <Link to="/">Search for a product</Link> on Price Finder Globally and see every store's price side by side.
        </p>
      </ProsePage>
      <div className="mx-auto -mt-6 max-w-3xl px-4 pb-14 sm:px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:underline dark:text-primary-400"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all guides
        </Link>
      </div>
    </div>
  );
}
