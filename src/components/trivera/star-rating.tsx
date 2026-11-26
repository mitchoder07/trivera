"use client";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  reviewCount?: number;
}

/** Partial-fill star rating rendered with SVG. Supports fractional fill. */
export function StarRating({
  rating,
  size = 16,
  className,
  showValue = false,
  reviewCount,
}: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clamped);
  const hasHalf = clamped - fullStars >= 0.25 && clamped - fullStars < 0.75;
  const roundedUp = clamped - fullStars >= 0.75;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      aria-label={`Rating ${clamped.toFixed(1)} out of 5${reviewCount ? `, ${reviewCount} reviews` : ""}`}
    >
      <div className="flex" style={{ gap: 1 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const isFull = i < fullStars || (i === fullStars && roundedUp);
          const isHalf = i === fullStars && hasHalf;
          return (
            <Star
              key={i}
              size={size}
              fillPercent={isFull ? 100 : isHalf ? 50 : 0}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-foreground/70">
          {clamped.toFixed(1)}
          {typeof reviewCount === "number" && (
            <span className="text-muted-foreground"> ({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}

function Star({ size, fillPercent }: { size: number; fillPercent: number }) {
  const id = `star-grad-${size}-${fillPercent}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={id}>
          <stop offset={`${fillPercent}%`} stopColor="#f59e0b" />
          <stop offset={`${fillPercent}%`} stopColor="#d4d4d8" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        stroke="#d4d4d8"
        strokeWidth="0.5"
        d="M12 2.5l2.9 6.06 6.6.79-4.86 4.51 1.32 6.54L12 17.7l-5.96 3.2 1.32-6.54L2.5 9.35l6.6-.79L12 2.5z"
      />
    </svg>
  );
}
