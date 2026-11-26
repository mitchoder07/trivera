/**
 * Trivera Sanity Schema Definitions
 *
 * These are REAL Sanity schema definitions. Copy this file (or its contents)
 * into your Sanity Studio project's `schemas/` folder and import them in your
 * `sanity.config.ts`.
 *
 * Production swap:
 *   import { defineType, defineField } from "sanity";
 *   export const product = defineType({ ... });
 *
 * The shapes here mirror the mock data in src/data/sanity-mock.json so the
 * GROQ subset interpreter in client.ts can resolve fields identically.
 */

interface ValidationRule {
  required: () => ValidationRule;
  max: (n: number) => ValidationRule;
  min: (n: number) => ValidationRule;
}

export interface SanityField {
  name: string;
  title: string;
  type: string;
  description?: string;
  options?: Record<string, unknown>;
  validation?: (Rule: ValidationRule) => unknown;
  of?: unknown;
  to?: unknown;
}

export interface SanityType {
  name: string;
  title: string;
  type: string;
  description?: string;
  fields: SanityField[];
  preview?: Record<string, unknown>;
}

// Identity helpers that mirror the real Sanity `defineType` / `defineField`
// API. Using generics keeps the inferred shape without falling back to `any`.
export function defineType<T>(type: T): T {
  return type;
}
export function defineField<T>(field: T): T {
  return field;
}

export const product: SanityType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  description: "A sellable product listed on the Trivera marketplace.",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      description: "The full product title shown on cards and detail pages.",
      validation: (Rule: ValidationRule) => Rule.required().max(140),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-safe identifier. Must be unique.",
      options: {
        source: "name",
        maxLength: 96,
        slugify: (input: string) =>
          input.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      },
      validation: (Rule: ValidationRule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      description: "One-liner used on product cards and search results.",
      rows: 2,
      validation: (Rule: ValidationRule) => Rule.required().max(180),
    }),
    defineField({
      name: "price",
      title: "Price (NGN)",
      type: "number",
      description: "Current selling price in Naira. Excluding decimals.",
      validation: (Rule: ValidationRule) => Rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare-at Price (NGN)",
      type: "number",
      description: "Original price before discount. Leave blank if no discount.",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: { list: ["NGN", "USD", "GHS"], layout: "radio" },
      initialValue: "NGN",
    }),
    defineField({
      name: "freeShipping",
      title: "Free Shipping",
      type: "boolean",
      description: "Show the Free Shipping badge and waive delivery fee.",
      initialValue: true,
    }),
    defineField({
      name: "stock",
      title: "Stock Quantity",
      type: "number",
      validation: (Rule: ValidationRule) => Rule.min(0),
    }),
    defineField({
      name: "rating",
      title: "Average Rating",
      type: "number",
      description: "Computed average rating. Updated by a scheduled job.",
      readOnly: true,
    }),
    defineField({
      name: "reviewCount",
      title: "Review Count",
      type: "number",
      readOnly: true,
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule: ValidationRule) => Rule.required(),
    }),
    defineField({
      name: "seller",
      title: "Seller",
      type: "reference",
      to: [{ type: "seller" }],
      validation: (Rule: ValidationRule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [
        defineField({
          name: "image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        }),
      ],
      validation: (Rule: ValidationRule) => Rule.required().min(1),
    }),
    defineField({
      name: "variants",
      title: "Variant Options",
      type: "array",
      description: "Color, Storage, Size, RAM. Each option may carry a price delta.",
      of: [
        defineField({
          name: "variant",
          type: "object",
          fields: [
            defineField({ name: "name", title: "Option Name", type: "string" }),
            defineField({
              name: "options",
              title: "Options",
              type: "array",
              of: [
                defineField({
                  name: "option",
                  type: "object",
                  fields: [
                    defineField({ name: "label", type: "string" }),
                    defineField({ name: "value", type: "string" }),
                    defineField({ name: "swatch", title: "Color Swatch (hex)", type: "string" }),
                    defineField({ name: "priceDelta", title: "Price Delta (NGN)", type: "number" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Marketing Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { list: ["bestseller", "deals-of-the-day", "new-arrival", "flash-sale"] },
    }),
    defineField({
      name: "body",
      title: "Description",
      type: "array",
      of: [
        defineField({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "price", media: "images.0" },
  },
});

export const seller: SanityType = defineType({
  name: "seller",
  title: "Seller",
  type: "document",
  description: "A verified marketplace seller / vendor.",
  fields: [
    defineField({
      name: "name",
      title: "Seller Name",
      type: "string",
      validation: (Rule: ValidationRule) => Rule.required(),
    }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "ratingPercent", title: "Rating (%)", type: "number" }),
    defineField({ name: "shipOnTimePercent", title: "Ship On Time (%)", type: "number" }),
    defineField({ name: "chatResponsePercent", title: "Chat Response (%)", type: "number" }),
    defineField({ name: "followerCount", title: "Followers", type: "number" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "verified", title: "Verified", type: "boolean", initialValue: true }),
    defineField({ name: "joinedYear", title: "Joined Year", type: "number" }),
  ],
  preview: { select: { title: "name", subtitle: "location", media: "logo" } },
});

export const category: SanityType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
      type: "string",
      validation: (Rule: ValidationRule) => Rule.required(),
    }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "icon", title: "Icon (lucide name)", type: "string" }),
    defineField({ name: "productCount", title: "Product Count", type: "number", readOnly: true }),
  ],
  preview: { select: { title: "name" } },
});

export const review: SanityType = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule: ValidationRule) => Rule.required(),
    }),
    defineField({ name: "author", title: "Author", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "rating",
      title: "Rating (1-5)",
      type: "number",
      validation: (Rule: ValidationRule) => Rule.min(1).max(5),
    }),
    defineField({ name: "title", title: "Review Title", type: "string" }),
    defineField({ name: "body", title: "Review Body", type: "text", rows: 4 }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "verified", title: "Verified Purchase", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "title", subtitle: "author", media: "rating" } },
});

export const schemaTypes: SanityType[] = [product, seller, category, review];
