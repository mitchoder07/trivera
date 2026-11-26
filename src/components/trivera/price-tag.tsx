"use client";

import { cn } from "@/lib/utils";
import { discountPercent, formatPrice } from "./format";

interface PriceTagProps {
  price: number;
  compareAtPrice?: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showDiscount?: boolean;
  className?: string;
}

const priceSize: Record<NonNullable<PriceTagProps["size"]>, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
  xl: "text-3xl",
};

export function PriceTag({
  price,
  compareAtPrice,
  currency = "NGN",
  size = "md",
  showDiscount = true,
  className,
}: PriceTagProps) {
  const discount = discountPercent(price, compareAtPrice);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-bold text-foreground", priceSize[size])}>
        {formatPrice(price, currency)}
      </span>
      {discount && (
        <span className="text-sm text-muted-foreground line-through">
          {formatPrice(compareAtPrice ?? 0, currency)}
        </span>
      )}
      {showDiscount && discount && (
        <span className="rounded bg-deal px-1.5 py-0.5 text-xs font-bold text-white">
          -{discount}%
        </span>
      )}
    </div>
  );
}
