"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { Skeleton } from "./skeleton";
import { MarkdownRenderer } from "./markdown-renderer";
import { api } from "~/trpc/react";
import { formatDate } from "~/lib/utils";

export function PostContent({ slug }: { slug: string }) {
  const { data: post, isLoading } = api.post.getBySlug.useQuery(
    { slug },
    {
      retry: false,
    },
  );

  if (isLoading) {
    return (
      <article className="mx-auto max-w-4xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="mb-4 h-12 w-3/4" />
          <div className="mb-6 flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="mb-2 h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </article>
    );
  }

  if (!post) {
    notFound();
  }

  const title = post.title ?? "Untitled";
  const content = post.content ?? "";
  const author = post.createdBy.name ?? "Anonymous";
  const date = post.publishedAt ?? post.createdAt;
  const image = post.featuredImage ?? "/default-image.jpg";

  return (
    <article className="mx-auto max-w-4xl">
      {/* Post Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>

        {/* Post Meta */}
        <div className="mb-6 flex items-center space-x-4">
          {post.createdBy.image && (
            <Image
              src={post.createdBy.image}
              alt={post.createdBy.name ?? "Author"}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {author}
            </p>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={date.toISOString()}>{formatDate(date)}</time>
              <span className="mx-2">•</span>
              <span>{Math.ceil(content.length / 1000)} min read</span>
            </div>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-6 text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            {post.excerpt}
          </p>
        )}

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <Image
              src={image}
              alt={title}
              width={1200}
              height={600}
              className="w-full rounded-lg object-cover shadow-lg"
              priority
            />
          </div>
        )}
      </header>

      {/* Post Content */}
      <div className="mb-8">
        <MarkdownRenderer content={content} />
      </div>

      {/* Post Footer */}
      <footer className="border-t border-gray-200 pt-8 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {post.createdBy.image && (
              <Image
                src={post.createdBy.image}
                alt={post.createdBy.name ?? "Author"}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {author}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published on {formatDate(date)}
              </p>
            </div>
          </div>

          {/* Share buttons could go here */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                if (navigator.share) {
                  void navigator.share({
                    title: title,
                    text: post.excerpt ?? title,
                    url: window.location.href,
                  });
                } else {
                  void navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }
              }}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              Share
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}
