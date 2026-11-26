/**
 * Trivera GROQ Queries
 *
 * These are REAL GROQ query strings. When you swap the mock client for a real
 * @sanity/client + groq setup, these exact strings work unchanged against a
 * production Sanity dataset whose schema matches src/lib/sanity/schema.ts.
 *
 * Documented query catalog:
 *   - allProducts        : every product, projected to card shape
 *   - productBySlug      : single product by slug.current, references resolved
 *   - allSellers         : every seller, with live product counts
 *   - allCategories      : every category
 *   - reviewsForProduct  : reviews joined to a product by slug
 *   - dealsOfTheDay      : products tagged "deals-of-the-day"
 *   - bestSellers        : products tagged "bestseller"
 *   - relatedProducts    : same-category siblings, excluding current slug
 */

export const allProducts = `*[_type == "product"] | order(_createdAt desc) {
  _id,
  _type,
  "slug": slug.current,
  name,
  shortDescription,
  price,
  compareAtPrice,
  currency,
  freeShipping,
  stock,
  rating,
  reviewCount,
  brand,
  tags,
  "images": images[]{ "url": asset->url, alt, "key": _key },
  "category": category->{ _id, name, "slug": slug.current },
  "seller": seller->{ _id, name, "slug": slug.current, ratingPercent, shipOnTimePercent, chatResponsePercent, verified }
}`;

export const productBySlug = `*[_type == "product" && slug.current == $slug][0] {
  _id,
  _type,
  "slug": slug.current,
  name,
  shortDescription,
  price,
  compareAtPrice,
  currency,
  freeShipping,
  stock,
  rating,
  reviewCount,
  brand,
  tags,
  variants,
  body,
  "images": images[]{ "url": asset->url, alt, "key": _key },
  "category": category->{ _id, name, "slug": slug.current },
  "seller": seller->{ _id, name, "slug": slug.current, ratingPercent, shipOnTimePercent, chatResponsePercent, followerCount, location, verified, joinedYear }
}`;

export const allSellers = `*[_type == "seller"] | order(ratingPercent desc) {
  _id,
  "slug": slug.current,
  name,
  "logo": logo.asset->url,
  ratingPercent,
  shipOnTimePercent,
  chatResponsePercent,
  followerCount,
  location,
  verified,
  joinedYear,
  "productCount": count(*[_type == "product" && seller._ref == ^._id])
}`;

export const allCategories = `*[_type == "category"] | order(name asc) {
  _id,
  "slug": slug.current,
  name,
  icon,
  "productCount": count(*[_type == "product" && category._ref == ^._id])
}`;

export const reviewsForProduct = `*[_type == "review" && product->slug.current == $slug] | order(date desc) {
  _id,
  author,
  location,
  rating,
  title,
  body,
  date,
  verified
}`;

export const dealsOfTheDay = `*[_type == "product" && "deals-of-the-day" in tags] | order(reviewCount desc) {
  _id,
  "slug": slug.current,
  name,
  shortDescription,
  price,
  compareAtPrice,
  currency,
  freeShipping,
  rating,
  reviewCount,
  brand,
  "images": images[]{ "url": asset->url, alt, "key": _key },
  "seller": seller->{ name }
}`;

export const bestSellers = `*[_type == "product" && "bestseller" in tags] | order(rating desc) {
  _id,
  "slug": slug.current,
  name,
  price,
  compareAtPrice,
  "images": images[]{ "url": asset->url, alt, "key": _key },
  "seller": seller->{ name }
}`;

export const relatedProducts = `*[_type == "product" && slug.current != $slug && category._ref == *[_type == "product" && slug.current == $slug][0].category._ref][0..3] {
  _id,
  "slug": slug.current,
  name,
  price,
  compareAtPrice,
  "images": images[]{ "url": asset->url, alt, "key": _key },
  "seller": seller->{ name }
}`;

export const queries = {
  allProducts,
  productBySlug,
  allSellers,
  allCategories,
  reviewsForProduct,
  dealsOfTheDay,
  bestSellers,
  relatedProducts,
} as const;

export type QueryName = keyof typeof queries;
