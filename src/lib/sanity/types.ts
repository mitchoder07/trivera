/** Trivera storefront types. These mirror the projected shapes returned
 *  by the GROQ queries in src/lib/sanity/queries.ts after the mock client
 *  runs them. In production with a real @sanity/client, the same shapes are
 *  returned (plus `_key` / `_rev` metadata that we strip where unused). */

export interface ProductImage {
  url: string;
  alt: string;
  key: string;
}

export interface ProductVariantOption {
  label: string;
  value: string;
  swatch?: string;
  priceDelta?: number;
}

export interface ProductVariant {
  _key: string;
  name: string;
  options: ProductVariantOption[];
}

export interface ProductCardSeller {
  _id: string;
  name: string;
  slug: string;
  ratingPercent?: number;
  shipOnTimePercent?: number;
  chatResponsePercent?: number;
  verified?: boolean;
}

export interface ProductCardCategory {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductCard {
  _id: string;
  _type: "product";
  slug: string;
  name: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  freeShipping: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  brand?: string;
  tags?: string[];
  images: ProductImage[];
  category: ProductCardCategory;
  seller: ProductCardSeller;
}

export interface SanityBlock {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3" | "blockquote";
  children: { _type: "span"; _key: string; text: string }[];
}

export interface ProductDetail extends Omit<ProductCard, "_type"> {
  _type: "product";
  variants: ProductVariant[];
  body: SanityBlock[];
  seller: ProductDetailSeller;
}

export interface ProductDetailSeller extends ProductCardSeller {
  followerCount?: number;
  location?: string;
  joinedYear?: number;
}

export interface Seller {
  _id: string;
  slug: string;
  name: string;
  logo?: string;
  ratingPercent: number;
  shipOnTimePercent: number;
  chatResponsePercent: number;
  followerCount: number;
  location: string;
  verified: boolean;
  joinedYear: number;
  productCount: number;
}

export interface Category {
  _id: string;
  slug: string;
  name: string;
  icon: string;
  productCount: number;
}

export interface Review {
  _id: string;
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
}

export interface CartLineItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  variantLabel: string;
  sellerName: string;
  freeShipping: boolean;
}
