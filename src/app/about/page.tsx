import { BlogLayout } from "../_components/blog-layout";

export default function AboutPage() {
  return (
    <BlogLayout
      title="About"
      description="Learn more about this blog and its creator."
    >
      <div className="mx-auto max-w-2xl space-y-8 text-lg text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Our Mission
          </h2>
          <p>
            Welcome to mine blog! This platform is dedicated to sharing
            insightful articles, tutorials, and stories on web development,
            technology, and creativity. Our goal is to inspire and educate
            readers of all backgrounds.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            About the Author
          </h2>
          <p>
            Hi! I'm the creator and sole author of this blog. With a passion for
            building modern web applications and a love for teaching, I strive
            to make complex topics accessible and enjoyable. Thank you for being
            part of this journey!
          </p>
        </section>
      </div>
    </BlogLayout>
  );
}
