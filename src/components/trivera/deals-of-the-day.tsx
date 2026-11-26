"use client";

import { useEffect, useState } from "react";
import { Clock, Flame } from "lucide-react";
import { useSanity } from "./use-sanity";
import { queries } from "@/lib/sanity/queries";
import type { ProductCard as ProductCardType } from "@/lib/sanity/types";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./skeletons";

export function DealsOfTheDay() {
  const { data, loading } = useSanity<ProductCardType[]>(queries.dealsOfTheDay);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - Date.now();
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`,
      );
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-cta text-white">
            <Flame className="size-4" />
          </span>
          <h2 className="text-lg font-extrabold text-foreground sm:text-xl">
            Deals of the Day
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-md bg-neutral-900 px-2.5 py-1 text-sm font-semibold text-white tabular-nums">
          <Clock className="size-4 text-cta" />
          {timeLeft}
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data?.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </section>
  );
}
