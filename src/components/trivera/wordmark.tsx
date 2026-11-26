"use client";

import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  swooshClassName?: string;
}

/** TRIVERA wordmark in pink with a small pink swoosh. */
export function Wordmark({ className, swooshClassName }: WordmarkProps) {
  return (
    <div className={cn("flex items-end gap-1 select-none", className)}>
      <span className="font-extrabold tracking-tight text-brand text-2xl leading-none">
        TRIVERA
      </span>
      <svg
        viewBox="0 0 40 12"
        className={cn("w-8 h-3 mb-1", swooshClassName)}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 9C10 4 18 2 38 2"
          stroke="var(--brand-swoosh)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
