"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLineItem, ProductCard, ProductVariant } from "@/lib/sanity/types";

export interface AddToCartInput {
  product: Pick<
    ProductCard,
    "_id" | "slug" | "name" | "price" | "compareAtPrice" | "images" | "freeShipping" | "seller"
  >;
  quantity: number;
  variantLabel: string;
  variants: ProductVariant[];
  selectedOptions: Record<string, string>;
}

interface CartState {
  items: CartLineItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (input: AddToCartInput) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

function computeUnitPrice(product: AddToCartInput["product"], variants: ProductVariant[], selectedOptions: Record<string, string>): number {
  let delta = 0;
  for (const v of variants) {
    const sel = selectedOptions[v.name];
    if (!sel) continue;
    const opt = v.options.find((o) => o.value === sel || o.label === sel);
    if (opt?.priceDelta) delta += opt.priceDelta;
  }
  return product.price + delta;
}

function variantLabelFromSelections(variants: ProductVariant[], selected: Record<string, string>): string {
  if (variants.length === 0) return "Standard";
  const parts: string[] = [];
  for (const v of variants) {
    const val = selected[v.name];
    if (!val) continue;
    const opt = v.options.find((o) => o.value === val || o.label === val);
    if (opt) parts.push(opt.label);
  }
  return parts.length ? parts.join(", ") : "Standard";
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (input) => {
        const unitPrice = computeUnitPrice(input.product, input.variants, input.selectedOptions);
        const label = input.variantLabel || variantLabelFromSelections(input.variants, input.selectedOptions);
        const key = `${input.product._id}::${label}`;
        const image = input.product.images[0]?.url ?? "";
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + input.quantity } : i,
            ),
          });
        } else {
          const item: CartLineItem = {
            key,
            productId: input.product._id,
            slug: input.product.slug,
            name: input.product.name,
            image,
            price: unitPrice,
            compareAtPrice: input.product.compareAtPrice,
            quantity: input.quantity,
            variantLabel: label,
            sellerName: input.product.seller.name,
            freeShipping: input.product.freeShipping,
          };
          set({ items: [...get().items, item] });
        }
      },
      remove: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      setQuantity: (key, quantity) =>
        set({
          items: get()
            .items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i))
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "trivera-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }) as CartState,
    },
  ),
);
