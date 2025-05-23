import { BlogLayout } from "../_components/blog-layout";

export default function ContactPage() {
  return (
    <BlogLayout
      title="Contact"
      description="Get in touch with the blog author."
    >
      <div className="mx-auto max-w-xl space-y-8 text-lg text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Contact Form
          </h2>
          <form className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Your message..."
                required
              />
            </div>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
              disabled
            >
              Send Message
            </button>
          </form>
        </section>
        <section>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Other Ways to Connect
          </h2>
          <ul className="list-disc pl-6">
            <li>
              Email:{" "}
              <a
                href="mailto:admin@yourblog.com"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                admin@yourblog.com
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                github.com/yourprofile
              </a>
            </li>
          </ul>
        </section>
      </div>
    </BlogLayout>
  );
}
