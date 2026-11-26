"use client";

import { HeroCarousel } from "./hero-carousel";
import { DealsOfTheDay } from "./deals-of-the-day";
import { ProductGrid } from "./product-grid";
import { TopSellers } from "./top-sellers";
import { TrustBadges } from "./trust-badges";

export function HomeView() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
      <HeroCarousel />
      <div className="mt-6">
        <TrustBadges />
      </div>
      <div className="mt-6">
        <DealsOfTheDay />
      </div>
      <div className="mt-8">
        <ProductGrid />
      </div>
      <div className="mt-10">
        <TopSellers />
      </div>
    </div>
  );
}
