import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import EditPostForm from "./EditPostForm";
import { api } from "~/trpc/server";
import getServerSession from "next-auth";
import { authConfig } from "~/server/auth/config";
import type { Session } from "next-auth";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Generate metadata for the page
export const metadata: Metadata = {
  title: "Edit Post",
  description: "Edit an existing blog post",
};

export default async function EditPostPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  await searchParams; // Await searchParams even if not used

  // Validate postId
  if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
    notFound();
  }

  try {
    // Verify post exists before rendering the form
    await api.post.getByIdForAdmin({ id: parseInt(id) });
  } catch {
    notFound();
  }

  const session = (await getServerSession(
    authConfig,
  )) as unknown as Session | null;
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return <EditPostForm postId={parseInt(id)} />;
}
