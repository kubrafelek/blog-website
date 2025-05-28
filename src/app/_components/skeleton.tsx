import { cn } from "~/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-800",
        className,
      )}
      {...props}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Featured Image Skeleton */}
      <div className="aspect-video w-full">
        <Skeleton className="h-full w-full rounded-t-xl" />
      </div>

      {/* Content Skeleton */}
      <div className="p-6">
        {/* Title */}
        <Skeleton className="mb-3 h-6 w-3/4" />

        {/* Excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Author and Date */}
        <div className="mt-4 flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PostGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PostHeroSkeleton() {
  return (
    <div className="mb-12">
      <div className="text-center">
        <Skeleton className="mx-auto mb-4 h-12 w-3/4" />
        <Skeleton className="mx-auto h-6 w-1/2" />
      </div>
    </div>
  );
}
