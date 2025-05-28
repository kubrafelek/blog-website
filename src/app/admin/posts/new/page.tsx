"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/trpc/react";
import Image from "next/image";

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [published, setPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createPost = api.post.create.useMutation({
    onSuccess: (data) => {
      router.push(`/admin/posts/${data.id}/edit`);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
      setIsLoading(false);
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
    router.push("/admin/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    setIsLoading(true);
    createPost.mutate({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || undefined,
      featuredImage: featuredImage.trim() || undefined,
      published,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, we'll use a placeholder. In production, you'd upload to a service like Cloudinary or AWS S3
      const reader = new FileReader();
      reader.onload = (event) => {
        setFeaturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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
                Create New Post
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/posts"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                All Posts
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Enter post title..."
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Brief description of the post..."
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Optional short description that appears in post previews
            </p>
          </div>

          {/* Featured Image */}
          <div>
            <label
              htmlFor="featuredImage"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Featured Image
            </label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="url"
                id="featuredImage"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Image URL or upload below..."
              />
              <div className="flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Upload
                </label>
              </div>
            </div>
            {featuredImage && (
              <div className="mt-4">
                <Image
                  src={featuredImage}
                  alt="Featured image preview"
                  width={500}
                  height={300}
                  className="h-48 w-full rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Content *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Write your post content here... 

You can use Markdown formatting:
# Heading
## Subheading
**Bold text**
*Italic text*
- List items
[Link text](URL)
![Alt text](image-url)"
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Supports Markdown formatting
            </p>
          </div>

          {/* Publishing Options */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Publishing Options
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="published"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Publish immediately
                </label>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {published
                  ? "Post will be visible to visitors immediately"
                  : "Post will be saved as draft"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
            <Link
              href="/admin/dashboard"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </Link>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setPublished(false);
                  if (!title.trim() || !content.trim()) {
                    alert("Title and content are required");
                    return;
                  }
                  setIsLoading(true);
                  createPost.mutate({
                    title: title.trim(),
                    content: content.trim(),
                    excerpt: excerpt.trim() || undefined,
                    featuredImage: featuredImage.trim() || undefined,
                    published: false,
                  });
                }}
                disabled={isLoading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading
                  ? "Creating..."
                  : published
                    ? "Publish Post"
                    : "Create Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
