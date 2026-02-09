import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({
  className,
  variant = "rectangular",
  ...props
}: SkeletonProps) {
  const variants = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded",
  };

  return (
    <div
      data-testid="skeleton"
      className={cn("animate-pulse bg-gray-200", variants[variant], className)}
      {...props}
    />
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-3" data-testid="table-skeleton">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <Skeleton className="mb-4 h-6 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
