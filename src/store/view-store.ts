"use client";

import { create } from "zustand";

export type View = "home" | "product" | "checkout" | "confirmation";

interface ViewState {
  view: View;
  productSlug: string | null;
  searchQuery: string;
  activeCategory: string | null;
  /** last completed order reference, used by the confirmation view */
  lastOrderRef: string | null;
  lastOrderTotal: number | null;
  goHome: () => void;
  openProduct: (slug: string) => void;
  openCheckout: () => void;
  openConfirmation: (ref: string, total: number) => void;
  setSearch: (q: string) => void;
  setCategory: (slug: string | null) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  view: "home",
  productSlug: null,
  searchQuery: "",
  activeCategory: null,
  lastOrderRef: null,
  lastOrderTotal: null,
  goHome: () => set({ view: "home", productSlug: null }),
  openProduct: (slug) => set({ view: "product", productSlug: slug }),
  openCheckout: () => set({ view: "checkout" }),
  openConfirmation: (ref, total) =>
    set({ view: "confirmation", lastOrderRef: ref, lastOrderTotal: total }),
  setSearch: (q) => set({ searchQuery: q }),
  setCategory: (slug) => set({ activeCategory: slug }),
}));
