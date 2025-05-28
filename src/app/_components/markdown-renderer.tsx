import ReactMarkdown from "react-markdown";
import type { ComponentPropsWithoutRef } from "react";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import Image from "next/image";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: (props: ComponentPropsWithoutRef<"h1">) => (
            <h1
              className="mt-8 mb-6 text-3xl font-bold text-gray-900 first:mt-0 dark:text-gray-100"
              {...props}
            />
          ),
          h2: (props: ComponentPropsWithoutRef<"h2">) => (
            <h2
              className="mt-8 mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100"
              {...props}
            />
          ),
          h3: (props: ComponentPropsWithoutRef<"h3">) => (
            <h3
              className="mt-6 mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100"
              {...props}
            />
          ),
          p: (props: ComponentPropsWithoutRef<"p">) => (
            <p
              className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          ul: (props: ComponentPropsWithoutRef<"ul">) => (
            <ul
              className="mb-4 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          ol: (props: ComponentPropsWithoutRef<"ol">) => (
            <ol
              className="mb-4 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),
          li: (props: ComponentPropsWithoutRef<"li">) => (
            <li className="leading-relaxed" {...props} />
          ),
          blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
            <blockquote
              className="mb-4 rounded-r-md border-l-4 border-gray-300 bg-gray-50 py-2 pl-4 text-gray-600 italic dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
              {...props}
            />
          ),
          pre: (props: ComponentPropsWithoutRef<"pre">) => (
            <pre
              className="mb-4 overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
              {...props}
            />
          ),
          a: (props: ComponentPropsWithoutRef<"a">) => {
            const { href, children, ...rest } = props;
            return (
              <a
                href={href}
                className="text-blue-600 underline underline-offset-2 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={
                  href?.startsWith("http") ? "noopener noreferrer" : undefined
                }
                {...rest}
              >
                {children}
              </a>
            );
          },
          img: (props: ComponentPropsWithoutRef<"img">) => {
            const { src, alt } = props;
            if (!src || typeof src !== "string") return null;

            return (
              <Image
                src={src}
                alt={alt ?? "Image"}
                width={500}
                height={300}
                className="mb-4 h-auto max-w-full rounded-lg shadow-md"
                loading="lazy"
              />
            );
          },
          table: (props: ComponentPropsWithoutRef<"table">) => (
            <div className="mb-4 overflow-x-auto">
              <table
                className="min-w-full border-collapse border border-gray-300 dark:border-gray-600"
                {...props}
              />
            </div>
          ),
          th: (props: ComponentPropsWithoutRef<"th">) => (
            <th
              className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              {...props}
            />
          ),
          td: (props: ComponentPropsWithoutRef<"td">) => (
            <td
              className="border border-gray-300 px-4 py-2 text-gray-700 dark:border-gray-600 dark:text-gray-300"
              {...props}
            />
          ),
          hr: (props: ComponentPropsWithoutRef<"hr">) => (
            <hr
              className="my-8 border-t-2 border-gray-200 dark:border-gray-700"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
