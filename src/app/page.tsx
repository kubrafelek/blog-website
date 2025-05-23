"use client";

import { useState } from "react";
import { BlogLayout } from "./_components/blog-layout";
import { BlogPostCard } from "./_components/blog-post-card";
import { Skeleton } from "./_components/skeleton";
import { api } from "~/trpc/react";

function BlogPostGrid() {
  const [page, setPage] = useState(1);
  const limit = 8;

  const { data, isLoading, error } = api.post.getAllPublished.useQuery({
    limit,
    page,
  });

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-16 w-16 text-6xl text-gray-400">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Error loading posts
        </h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <Skeleton className="aspect-video w-full" />
            <div className="p-6">
              <Skeleton className="mb-3 h-6 w-3/4" />
              <Skeleton className="mb-4 h-4 w-full" />
              <Skeleton className="mb-4 h-4 w-2/3" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data?.posts.length) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-4 h-16 w-16 text-6xl text-gray-400">📝</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          No posts yet
        </h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Check back soon for new content!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts List */}
      <div className="space-y-8">
        {data.posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {data.totalCount > limit && (
        <div className="flex items-center justify-center space-x-4 pt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-700"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {page} of {Math.ceil(data.totalCount / limit)}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.hasMore || isLoading}
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <BlogLayout
      title="Welcome to Our Blog"
      description="Discover insights, tutorials, and stories from our community"
    >
      <BlogPostGrid />
    </BlogLayout>
  );
}
