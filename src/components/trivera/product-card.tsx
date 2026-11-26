"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Truck } from "lucide-react";
import type { ProductCard as ProductCardType } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useViewStore } from "@/store/view-store";
import { toast } from "sonner";
import { PriceTag } from "./price-tag";
import { StarRating } from "./star-rating";
import { discountPercent } from "./format";

interface ProductCardProps {
  product: ProductCardType;
  className?: string;
  onClick?: () => void;
}

export function ProductCard({ product, className, onClick }: ProductCardProps) {
  const storeOpenProduct = useViewStore((s) => s.openProduct);
  const openProduct = onClick ?? (() => storeOpenProduct(product.slug));
  const add = useCartStore((s) => s.add);
  const openCart = useCartStore((s) => s.open);
  const discount = discountPercent(product.price, product.compareAtPrice);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    add({
      product,
      quantity: 1,
      variantLabel: "Standard",
      variants: [],
      selectedOptions: {},
    });
    toast.success("Added to cart", {
      description: product.name,
    });
    openCart();
  };

  const image = product.images[0];

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={openProduct}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted/40">
        {image ? (
          <img
            src={image.url}
            alt={image.alt}
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
        {discount && (
          <span className="absolute left-2 top-2 rounded bg-deal px-1.5 py-0.5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.tags?.includes("bestseller") && (
          <span className="absolute right-2 top-2 rounded bg-cta px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Bestseller
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating} size={13} />
          <span className="text-[11px] text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-medium text-foreground leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>
        <PriceTag
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          currency={product.currency}
          size="md"
          showDiscount={false}
        />
        {product.freeShipping && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-deal">
            <Truck className="size-3" />
            Free Shipping
          </div>
        )}
        <button
          type="button"
          onClick={handleAdd}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-md bg-cta py-2 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="size-3.5" />
          Add to Cart
        </button>
      </div>
    </motion.article>
  );
}
