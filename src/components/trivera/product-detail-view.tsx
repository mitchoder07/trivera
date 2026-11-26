"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  MessageSquare,
  MapPin,
  Wallet,
  ShoppingCart,
  Zap,
  Store,
} from "lucide-react";
import { useProduct, useReviews, useRelatedProducts } from "./use-sanity";
import { useViewStore } from "@/store/view-store";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PriceTag } from "./price-tag";
import { StarRating } from "./star-rating";
import { QuantityStepper } from "./quantity-stepper";
import { BlockContent } from "./block-content";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./skeletons";
import type { ProductVariant } from "@/lib/sanity/types";

interface ProductDetailViewProps {
  slug: string;
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const { data: product, loading } = useProduct(slug);
  const { goHome, openProduct, openCheckout } = useViewStore();
  const add = useCartStore((s) => s.add);
  const openCart = useCartStore((s) => s.open);

  const [activeImage, setActiveImage] = useState(0);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"description" | "reviews" | "related">("description");

  // Scroll to top when switching to a product view.
  // (Selection/image/quantity reset happens via `key={slug}` remount on the parent.)
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (loading || !product) {
    return <ProductDetailSkeleton />;
  }

  const variants = (product.variants ?? []) as ProductVariant[];

  const computeUnitPrice = (): number => {
    let delta = 0;
    for (const v of variants) {
      const val = selected[v.name];
      if (!val) continue;
      const opt = v.options.find((o) => o.value === val || o.label === val);
      if (opt?.priceDelta) delta += opt.priceDelta;
    }
    return product.price + delta;
  };

  const unitPrice = computeUnitPrice();
  const variantLabel = variants.length
    ? variants
        .map((v) => {
          const val = selected[v.name];
          const opt = v.options.find((o) => o.value === val || o.label === val);
          return opt?.label;
        })
        .filter(Boolean)
        .join(", ")
    : "Standard";

  const handleAddToCart = () => {
    add({
      product,
      quantity,
      variantLabel,
      variants,
      selectedOptions: selected,
    });
    toast.success("Added to cart", { description: `${quantity} x ${product.name}` });
    openCart();
  };

  const handleBuyNow = () => {
    add({
      product,
      quantity,
      variantLabel,
      variants,
      selectedOptions: selected,
    });
    openCheckout();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
        <button onClick={goHome} className="hover:text-cta">Home</button>
        <ChevronRight className="size-3" />
        <button onClick={goHome} className="hover:text-cta">{product.category.name}</button>
        <ChevronRight className="size-3" />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-square">
              <img
                src={product.images[activeImage]?.url}
                alt={product.images[activeImage]?.alt ?? product.name}
                className="size-full object-cover"
              />
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="mt-2 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.key}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "size-16 overflow-hidden rounded-md border-2 bg-muted",
                    i === activeImage ? "border-cta" : "border-border",
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img.url} alt={img.alt} className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main info */}
        <div className="lg:col-span-5">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
              {product.brand}
            </span>
            {product.tags?.includes("bestseller") && (
              <span className="rounded bg-cta px-2 py-0.5 text-xs font-bold uppercase text-white">
                Bestseller
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold leading-tight text-foreground sm:text-2xl">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={product.rating} size={16} showValue reviewCount={product.reviewCount} />
            <span className="text-sm text-muted-foreground">
              {product.reviewCount} verified reviews
            </span>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-card p-4">
            <PriceTag
              price={unitPrice}
              compareAtPrice={product.compareAtPrice}
              currency={product.currency}
              size="xl"
            />
            {product.freeShipping && (
              <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-deal">
                <Truck className="size-4" /> Free Shipping
              </div>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              In stock: {product.stock} units available
            </p>
          </div>

          {variants.length > 0 && (
            <div className="mt-4 space-y-4">
              {variants.map((v) => (
                <div key={v._key}>
                  <p className="mb-2 text-sm font-semibold text-foreground">
                    {v.name}: <span className="font-normal text-muted-foreground">{selected[v.name] ? v.options.find((o) => o.value === selected[v.name] || o.label === selected[v.name])?.label : "Select"}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((o) => {
                      const isSelected = selected[v.name] === o.value || selected[v.name] === o.label;
                      return (
                        <button
                          key={o.value}
                          onClick={() => setSelected((s) => ({ ...s, [v.name]: o.value }))}
                          className={cn(
                            "flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                            isSelected
                              ? "border-cta bg-cta/5 text-cta"
                              : "border-border bg-white text-foreground hover:border-cta",
                          )}
                        >
                          {o.swatch && (
                            <span
                              className="size-4 rounded-full border border-border"
                              style={{ background: o.swatch }}
                              aria-hidden="true"
                            />
                          )}
                          {o.label}
                          {typeof o.priceDelta === "number" && o.priceDelta !== 0 && (
                            <span className="text-xs text-muted-foreground">
                              {o.priceDelta > 0 ? `+₦${o.priceDelta.toLocaleString("en-NG")}` : `-₦${Math.abs(o.priceDelta).toLocaleString("en-NG")}`}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">Quantity</span>
            <QuantityStepper value={quantity} onChange={setQuantity} min={1} max={product.stock} />
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleBuyNow}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-cta py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-cta-dark"
            >
              <Zap className="size-4" /> Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-cta py-3.5 text-sm font-bold text-cta transition-colors hover:bg-cta hover:text-white"
            >
              <ShoppingCart className="size-4" /> Add to Cart
            </button>
          </div>
        </div>

        {/* Sidebar: delivery, warranty, seller */}
        <div className="space-y-4 lg:col-span-4">
          <SidebarCard title="Delivery Options" icon={<Truck className="size-4 text-cta" />}>
            <div className="mb-3 flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Umitili Road, Offa, Kwara State, 42213 Nigeria</p>
                <button className="text-xs font-semibold text-cta hover:underline">CHANGE</button>
              </div>
            </div>
            <DeliveryRow
              icon={<Truck className="size-4 text-deal" />}
              title="Priority Delivery"
              detail="Estimated Mon, Nov 24 - Tue, Nov 25"
              badge="FREE"
              badgeClass="bg-deal text-white"
            />
            <DeliveryRow
              icon={<Wallet className="size-4 text-muted-foreground" />}
              title="Cash on Delivery"
              detail="Not available for this item"
              badge="N/A"
              badgeClass="bg-muted text-muted-foreground"
            />
          </SidebarCard>

          <SidebarCard title="Return & Warranty" icon={<ShieldCheck className="size-4 text-cta" />}>
            <WarrantyRow icon={<BadgeCheck className="size-4 text-deal" />} title="Authentic Product" detail="Verified by Trivera" />
            <WarrantyRow icon={<RotateCcw className="size-4 text-cta" />} title="Change of Mind" detail="10 days return window" />
            <WarrantyRow icon={<ShieldCheck className="size-4 text-deal" />} title="Manufacturer Warranty" detail="2 years coverage" />
          </SidebarCard>

          <SidebarCard title="Sold by" icon={<Store className="size-4 text-cta" />}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-bold text-foreground">{product.seller.name}</p>
                  {product.seller.verified && <BadgeCheck className="size-4 text-cta" />}
                </div>
                {product.seller.location && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {product.seller.location}
                  </p>
                )}
              </div>
              <button className="rounded-md border border-cta px-3 py-1.5 text-xs font-semibold text-cta hover:bg-cta hover:text-white">
                Visit Store
              </button>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
              <SellerMetric value={`${product.seller.ratingPercent ?? 0}%`} label="Ratings" />
              <SellerMetric value={`${product.seller.shipOnTimePercent ?? 0}%`} label="Ship on time" />
              <SellerMetric value={`${product.seller.chatResponsePercent ?? 0}%`} label="Chat reply" />
            </div>
            <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-border py-2 text-xs font-semibold hover:bg-accent">
              <MessageSquare className="size-3.5" /> Chat with seller
            </button>
          </SidebarCard>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="flex gap-1 border-b border-border">
          <TabButton active={tab === "description"} onClick={() => setTab("description")}>
            Description
          </TabButton>
          <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")}>
            Reviews ({product.reviewCount})
          </TabButton>
          <TabButton active={tab === "related"} onClick={() => setTab("related")}>
            Related Products
          </TabButton>
        </div>

        <div className="py-5">
          {tab === "description" && (
            <div className="max-w-3xl">
              <BlockContent blocks={product.body} />
            </div>
          )}
          {tab === "reviews" && <ReviewsPanel slug={slug} />}
          {tab === "related" && <RelatedProductsPanel slug={slug} onSelect={openProduct} />}
        </div>
      </div>
    </div>
  );
}

function SidebarCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-foreground">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function DeliveryRow({
  icon,
  title,
  detail,
  badge,
  badgeClass,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  badge: string;
  badgeClass: string;
}) {
  return (
    <div className="mb-2 flex items-start gap-2 rounded-md bg-muted/50 p-2.5 text-sm last:mb-0">
      <span className="mt-0.5">{icon}</span>
      <div className="flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", badgeClass)}>{badge}</span>
    </div>
  );
}

function WarrantyRow({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return (
    <div className="mb-2.5 flex items-start gap-2 text-sm last:mb-0">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function SellerMetric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-sm font-bold text-foreground">{value}</p>
      <p className="text-[10px] leading-tight text-muted-foreground">{label}</p>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
        active ? "border-cta text-cta" : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function ReviewsPanel({ slug }: { slug: string }) {
  const { data: reviews, loading } = useReviews(slug);
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="shimmer h-24 rounded-lg" />
        ))}
      </div>
    );
  }
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-4xl font-extrabold text-foreground">
            {reviews.length > 0
              ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
              : "0.0"}
          </p>
          <StarRating
            rating={reviews.reduce((s, r) => s + r.rating, 0) / Math.max(reviews.length, 1)}
            size={16}
            className="mt-2 justify-center"
          />
          <p className="mt-1 text-xs text-muted-foreground">{reviews.length} reviews</p>
        </div>
      </div>
      <ul className="flex flex-col gap-3 lg:col-span-2">
        {reviews.map((r) => (
          <li key={r._id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-cta">
                  {r.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.author}</p>
                  <p className="text-xs text-muted-foreground">{r.location}</p>
                </div>
              </div>
              {r.verified && (
                <span className="rounded bg-deal/10 px-1.5 py-0.5 text-[10px] font-semibold text-deal">
                  Verified Purchase
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={r.rating} size={13} />
              <span className="text-xs text-muted-foreground">{r.date}</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-foreground">{r.title}</p>
            <p className="mt-1 text-sm text-foreground/80">{r.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RelatedProductsPanel({ slug, onSelect }: { slug: string; onSelect: (slug: string) => void }) {
  const { data, loading } = useRelatedProducts(slug);
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (!data || data.length === 0) {
    return <p className="text-sm text-muted-foreground">No related products found.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {data.map((p) => (
        <ProductCard key={p._id} product={p} onClick={() => onSelect(p.slug)} />
      ))}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <div className="shimmer aspect-square rounded-xl" />
        </div>
        <div className="space-y-3 lg:col-span-5">
          <div className="shimmer h-8 w-3/4 rounded" />
          <div className="shimmer h-4 w-1/3 rounded" />
          <div className="shimmer h-24 w-full rounded-lg" />
          <div className="shimmer h-12 w-full rounded-lg" />
        </div>
        <div className="space-y-3 lg:col-span-4">
          <div className="shimmer h-32 w-full rounded-xl" />
          <div className="shimmer h-32 w-full rounded-xl" />
          <div className="shimmer h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
