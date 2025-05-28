"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { formatDate } from "~/lib/utils";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const { data: stats } = api.post.getStats.useQuery();
  const { data: recentPosts } = api.post.getAllForAdmin.useQuery({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "ADMIN") {
      void router.push("/admin/login");
      return;
    }

    setIsLoading(false);
  }, [session, status, router]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSignOut = () => {
    void signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="font-bold text-white">B</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                View Blog
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {session?.user?.name ?? session?.user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="rounded-md bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {session?.user?.name ?? "Admin"}!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your blog posts and content from here.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-500">
                      <span className="text-sm font-medium text-white">📝</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Posts
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {stats?.totalPosts ?? 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-500">
                      <span className="text-sm font-medium text-white">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        Published
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {stats?.publishedPosts ?? 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500">
                      <span className="text-sm font-medium text-white">📄</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        Drafts
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {stats?.draftPosts ?? 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/admin/posts/new"
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  <span className="mr-2">✏️</span>
                  Create New Post
                </Link>
                <Link
                  href="/admin/posts"
                  className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <span className="mr-2">📋</span>
                  Manage All Posts
                </Link>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                Blog Navigation
              </h3>
              <div className="space-y-3">
                <Link
                  href="/posts"
                  className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <span className="mr-2">🌐</span>
                  View Published Posts
                </Link>
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <span className="mr-2">🏠</span>
                  Go to Homepage
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Posts */}
          <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Recent Posts
              </h3>
            </div>
            <div className="overflow-hidden">
              {recentPosts?.posts && recentPosts.posts.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentPosts.posts.slice(0, 5).map((post) => (
                    <li key={post.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                            {post.title ?? "Untitled"}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(post.createdAt)} •{" "}
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                post.published
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              }`}
                            >
                              {post.published ? "Published" : "Draft"}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/posts/${post.id}/edit`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                          >
                            Edit
                          </Link>
                          {post.published && (
                            <Link
                              href={`/posts/${post.slug}`}
                              className="text-sm font-medium text-gray-400 hover:text-gray-500"
                            >
                              View
                            </Link>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="text-gray-400 dark:text-gray-500">
                    <div className="mx-auto mb-4 h-12 w-12 text-4xl">📝</div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      No posts yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by creating your first blog post.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/admin/posts/new"
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                      >
                        Create your first post
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
