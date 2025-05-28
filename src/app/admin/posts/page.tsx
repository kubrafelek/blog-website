"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";
import { formatDate } from "~/lib/utils";

export default function AdminPostsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = api.post.getAllForAdmin.useQuery({
    limit: 20,
    page,
    published: filter === "all" ? undefined : filter === "published",
  });

  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const togglePublish = api.post.togglePublish.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Redirect if not admin
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    void router.push("/admin/login");
    return null;
  }

  const handleDelete = (id: number, title: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      )
    ) {
      deletePost.mutate({ id });
    }
  };

  const handleTogglePublish = (id: number) => {
    togglePublish.mutate({ id });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Manage Posts
              </h1>
            </div>
            <Link
              href="/admin/posts/new"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create New Post
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              All Posts ({data?.totalCount ?? 0})
            </button>
            <button
              onClick={() => setFilter("published")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                filter === "published"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                filter === "draft"
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
              }`}
            >
              Drafts
            </button>
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : !data?.posts.length ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 h-16 w-16 text-6xl text-gray-400">
              📝
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No posts found
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {filter === "all"
                ? "Get started by creating your first post."
                : `No ${filter} posts found.`}
            </p>
            {filter === "all" && (
              <Link
                href="/admin/posts/new"
                className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create your first post
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-hidden bg-white shadow sm:rounded-md dark:bg-gray-800">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.posts.map((post) => (
                <li key={post.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-gray-900 dark:text-gray-100">
                          {post.title}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            post.published
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                      </div>

                      {post.excerpt && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>Created {formatDate(post.createdAt)}</span>
                        {post.publishedAt && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              Published {formatDate(post.publishedAt)}
                            </span>
                          </>
                        )}
                        <span className="mx-2">•</span>
                        <span>Slug: /{post.slug}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Preview Link */}
                      {post.published && (
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="View post"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Link>
                      )}

                      {/* Edit Link */}
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>

                      {/* Publish/Unpublish Button */}
                      <button
                        onClick={() => handleTogglePublish(post.id)}
                        disabled={togglePublish.isPending}
                        className={`text-sm font-medium ${
                          post.published
                            ? "text-yellow-600 hover:text-yellow-800"
                            : "text-green-600 hover:text-green-800"
                        } disabled:opacity-50`}
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={deletePost.isPending}
                        className="font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalCount > 20 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {page} of {Math.ceil(data.totalCount / 20)}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.hasMore}
              className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-200"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
