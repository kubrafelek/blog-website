import Image from "next/image";
import Link from "next/link";
import { formatDate, truncateText } from "~/lib/utils";

interface BlogPostCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    featuredImage?: string | null;
    publishedAt: Date | null;
    createdBy: {
      id: string;
      name: string | null;
      image: string | null;
    };
  };
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const displayExcerpt =
    post.excerpt || truncateText(post.content.replace(/[#*`\[\]]/g, ""), 150);
  const publishDate = post.publishedAt ? formatDate(post.publishedAt) : "Draft";
  const readTime = Math.ceil(post.content.length / 1000);

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Featured Image */}
      {post.featuredImage && (
        <Link href={`/posts/${post.slug}`} className="block">
          <div className="aspect-video w-full overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={400}
              height={225}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              priority={false}
            />
          </div>
        </Link>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category/Tags could go here */}

        {/* Title */}
        <h3 className="mb-3">
          <Link
            href={`/posts/${post.slug}`}
            className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400"
          >
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-400">
          {displayExcerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-3">
            {/* Author */}
            <div className="flex items-center space-x-2">
              {post.createdBy.image ? (
                <Image
                  src={post.createdBy.image}
                  alt={post.createdBy.name || "Author"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {post.createdBy.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
              )}
              <span className="font-medium">
                {post.createdBy.name || "Anonymous"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Read Time */}
            <span>{readTime} min read</span>

            {/* Date */}
            <time dateTime={post.publishedAt?.toISOString() || ""}>
              {publishDate}
            </time>
          </div>
        </div>

        {/* Read More Link */}
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
          <Link
            href={`/posts/${post.slug}`}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Read full article
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
