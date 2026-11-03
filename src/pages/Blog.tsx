import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';
import { BLOG_POSTS } from '@/lib/blogPosts';
import { formatBlogDate } from '@/lib/format';

export default function Blog() {
  usePageMeta({
    title: 'Shopping Guides and Tips',
    description:
      'Shopping guides for Pakistan: the best mobiles under Rs. 30,000, how to save money online, and Daraz vs PriceOye price comparisons.',
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Blog</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Shopping guides for smart buyers in Pakistan</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
          Practical advice on choosing products, comparing stores and getting real value from online shopping.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="card group flex flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl dark:hover:border-primary-800"
          >
            <div className="flex items-center gap-3 text-xs font-semibold text-ink-500 dark:text-ink-400">
              <span>{formatBlogDate(post.published)}</span>
              <span aria-hidden="true">|</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {post.readMinutes} min read
              </span>
            </div>
            <h2 className="mt-4 text-xl font-bold leading-snug transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {post.title}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{post.description}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400">
              Read the guide <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
