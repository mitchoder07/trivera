"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  rounded?: string;
}

export function Shimmer({ className, rounded = "rounded-md" }: SkeletonProps) {
  return <div className={cn("shimmer", rounded, className)} aria-hidden="true" />;
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-2">
      <Shimmer className="aspect-square w-full" rounded="rounded-md" />
      <Shimmer className="h-3 w-1/3" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-2/3" />
      <div className="flex items-center gap-2">
        <Shimmer className="h-5 w-24" />
        <Shimmer className="h-3 w-12" />
      </div>
      <Shimmer className="h-8 w-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SellerCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Shimmer className="size-12 rounded-full" />
        <div className="flex flex-col gap-1">
          <Shimmer className="h-4 w-32" />
          <Shimmer className="h-3 w-24" />
        </div>
      </div>
      <Shimmer className="h-3 w-full" />
      <Shimmer className="h-3 w-5/6" />
    </div>
  );
}
