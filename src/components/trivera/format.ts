import type { ProductCard, SanityBlock } from "@/lib/sanity/types";
import { formatNaira } from "@/lib/paystack/client";

export function discountPercent(price: number, compareAtPrice?: number): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function formatPrice(price: number, _currency = "NGN"): string {
  return formatNaira(price);
}

/** Render Sanity block content (subset) to React-friendly tokens. */
export interface RenderedBlock {
  key: string;
  style: SanityBlock["style"];
  text: string;
}

export function blocksToRendered(blocks: SanityBlock[] | undefined): RenderedBlock[] {
  if (!blocks || !Array.isArray(blocks)) return [];
  return blocks.map((b) => ({
    key: b._key,
    style: b.style,
    text: (b.children ?? []).map((c) => c.text).join(""),
  }));
}

export function productMatchesSearch(p: ProductCard, q: string): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  const haystack = [p.name, p.shortDescription, p.brand ?? "", p.category.name, p.seller.name]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function productInCategory(p: ProductCard, categorySlug: string | null): boolean {
  if (!categorySlug) return true;
  return p.category.slug === categorySlug;
}

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;
