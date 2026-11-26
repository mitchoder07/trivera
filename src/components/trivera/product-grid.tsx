"use client";

import { useMemo } from "react";
import { useViewStore } from "@/store/view-store";
import { useProducts } from "./use-sanity";
import { productMatchesSearch, productInCategory } from "./format";
import { ProductCard } from "./product-card";
import { ProductGridSkeleton } from "./skeletons";
import { CategoryChips } from "./category-chips";
import { SlidersHorizontal } from "lucide-react";

export function ProductGrid() {
  const { data, loading } = useProducts();
  const { searchQuery, activeCategory } = useViewStore();

  const filtered = useMemo(() => {
    if (!data) return [];
    return data
      .filter((p) => productInCategory(p, activeCategory))
      .filter((p) => productMatchesSearch(p, searchQuery));
  }, [data, activeCategory, searchQuery]);

  return (
    <section id="product-grid-section" className="scroll-mt-32">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-foreground sm:text-xl">
            {activeCategory || searchQuery
              ? "Filtered Products"
              : "All Products"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
            {searchQuery && (
              <> for &quot;<span className="font-medium text-foreground">{searchQuery}</span>&quot;</>
            )}
          </p>
        </div>
        <button className="flex w-fit items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent">
          <SlidersHorizontal className="size-4" /> Sort: Popularity
        </button>
      </div>

      <div className="mb-4">
        <CategoryChips />
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-base font-semibold text-foreground">No products found</p>
          <p className="text-sm text-muted-foreground">
            Try a different search term or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
