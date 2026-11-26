"use client";

import { Star, MapPin, BadgeCheck, MessageSquare, Truck, Users } from "lucide-react";
import { useSellers } from "./use-sanity";
import { SellerCardSkeleton } from "./skeletons";
import type { Seller } from "@/lib/sanity/types";

export function TopSellers() {
  const { data, loading } = useSellers();

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-extrabold text-foreground sm:text-xl">
          Top Sellers
        </h2>
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
          Verified
        </span>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SellerCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data?.map((s) => (
            <SellerCard key={s._id} seller={s} />
          ))}
        </div>
      )}
    </section>
  );
}

function SellerCard({ seller }: { seller: Seller }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
          {seller.logo ? (
            <img src={seller.logo} alt={seller.name} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-lg font-bold text-muted-foreground">
              {seller.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="truncate font-semibold text-foreground">{seller.name}</h3>
            {seller.verified && (
              <BadgeCheck className="size-4 shrink-0 text-cta" aria-label="Verified seller" />
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            <span className="truncate">{seller.location}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3" />
            {seller.followerCount.toLocaleString("en-NG")} followers
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
        <Metric value={`${seller.ratingPercent}%`} label="Ratings" icon={<Star className="size-3 text-amber-500" />} />
        <Metric value={`${seller.shipOnTimePercent}%`} label="Ship on time" icon={<Truck className="size-3 text-cta" />} />
        <Metric value={`${seller.chatResponsePercent}%`} label="Chat reply" icon={<MessageSquare className="size-3 text-deal" />} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Joined {seller.joinedYear}
        </span>
        <button className="rounded-md border border-cta px-3 py-1.5 text-xs font-semibold text-cta transition-colors hover:bg-cta hover:text-white">
          Visit Store
        </button>
      </div>
    </article>
  );
}

function Metric({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-0.5">
        {icon}
        <span className="text-sm font-bold text-foreground">{value}</span>
      </div>
      <span className="text-[10px] leading-tight text-muted-foreground">{label}</span>
    </div>
  );
}
