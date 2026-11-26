"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: QuantityStepperProps) {
  const h = size === "sm" ? "h-8" : "h-10";
  const btn = size === "sm" ? "size-8" : "size-10";
  const text = size === "sm" ? "text-sm w-8" : "text-base w-12";

  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn("inline-flex items-stretch rounded-md border border-border overflow-hidden", className)}
      role="group"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={cn(
          "flex items-center justify-center bg-background hover:bg-accent disabled:opacity-40 disabled:hover:bg-background transition-colors",
          btn,
        )}
      >
        <Minus className="size-4" />
      </button>
      <div
        className={cn(
          "flex items-center justify-center bg-background border-x border-border font-semibold tabular-nums",
          text,
          h,
        )}
        aria-live="polite"
      >
        {value}
      </div>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          "flex items-center justify-center bg-background hover:bg-accent disabled:opacity-40 disabled:hover:bg-background transition-colors",
          btn,
        )}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
