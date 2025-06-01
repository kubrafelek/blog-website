import { BlogLayout } from "../../_components/blog-layout";
import { PostContent } from "~/app/_components/post-content";
import { type Metadata } from "next";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  return {
    title: "Blog Post",
    description: "Read our latest blog post",
  };
}

type PageProps = {
  params: { slug: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function PostPage({ params }: PageProps) {
  return (
    <BlogLayout title="Blog Post" description="Read our latest blog post">
      <div className="py-8">
        <PostContent slug={params.slug} />
      </div>
    </BlogLayout>
  );
}
