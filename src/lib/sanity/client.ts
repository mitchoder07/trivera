import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import mockData from "@/data/sanity-mock.json";

/**
 * Trivera Sanity CMS client.
 *
 * WHY NEXT_PUBLIC_ prefix:
 *   This module is imported by client components (use-sanity.ts is "use client").
 *   Next.js only exposes env vars to the browser if they start with NEXT_PUBLIC_.
 *   Without the prefix, process.env.SANITY_PROJECT_ID is undefined in the browser,
 *   createClient() throws, and the page shows "client-side exception".
 *
 * ENV VARS (set these on Vercel, same names, no quotes):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID  = 0ax9v9qq
 *   NEXT_PUBLIC_SANITY_DATASET     = production
 *
 * If env vars are missing or Sanity init fails, we fall back to the mock
 * dataset so the site always renders instead of crashing. This is what
 * makes the difference between a "client-side exception" page and a
 * working storefront.
 */

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "";

const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_DATASET ||
  "production";

// Try to construct the real Sanity client. If env vars are missing or
// construction throws, we keep realClient as null and route all fetch
// calls through the mock fetcher instead. The site never crashes.
let realClient: ReturnType<typeof createClient> | null = null;
let builder: ReturnType<typeof imageUrlBuilder> | null = null;

if (projectId) {
  try {
    realClient = createClient({
      projectId,
      dataset,
      apiVersion: "2024-10-01",
      useCdn: true,
    });
    builder = imageUrlBuilder(realClient);
  } catch (err) {
    console.error("[trivera] Sanity client init failed, falling back to mock:", err);
    realClient = null;
    builder = null;
  }
} else {
  console.warn(
    "[trivera] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Falling back to mock data."
  );
}

/**
 * Public client object. Always non-null so consumers (use-sanity.ts)
 * can call client.fetch(...) without TypeScript complaining about null.
 * Internally routes to the real Sanity client if available, otherwise
 * falls back to the mock dataset.
 */
export const client = {
  fetch<T = unknown>(
    query: string,
    params: Record<string, unknown> = {}
  ): Promise<T> {
    if (realClient) {
      return realClient.fetch<T>(query, params);
    }
    return mockFetch<T>(query, params);
  },
};

export function urlFor(source: unknown) {
  if (!builder) {
    return { url: () => String((source as { url?: unknown })?.url ?? "") } as never;
  }
  return builder.image(source as never);
}

/**
 * Fetch helper (same as client.fetch, exported as a convenience).
 */
export async function fetch<T = unknown>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return client.fetch<T>(query, params);
}

/**
 * Minimal mock fetcher. Reads from src/data/sanity-mock.json and runs a
 * tiny GROQ subset interpreter. Enough for the storefront to render when
 * Sanity env vars aren't set, so Vercel preview never shows a blank page.
 */
function mockFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const data = mockData as {
    products: unknown[];
    sellers: unknown[];
    categories: unknown[];
    reviews: unknown[];
  };

  let result: unknown;

  if (query.includes('_type == "product"') && query.includes("slug.current == $slug")) {
    const slug = params.slug as string;
    result =
      (data.products as Array<{ slug?: { current?: string } }>).find(
        (p) => p.slug?.current === slug
      ) ?? null;
  } else if (
    query.includes('_type == "product"') &&
    query.includes('"deals-of-the-day" in tags')
  ) {
    result = (data.products as Array<{ tags?: string[] }>).filter((p) =>
      p.tags?.includes("deals-of-the-day")
    );
  } else if (
    query.includes('_type == "product"') &&
    query.includes('"bestseller" in tags')
  ) {
    result = (data.products as Array<{ tags?: string[] }>).filter((p) =>
      p.tags?.includes("bestseller")
    );
  } else if (
    query.includes('_type == "product"') &&
    query.includes("slug.current != $slug")
  ) {
    const slug = params.slug as string;
    result = (
      data.products as Array<{ slug?: { current?: string }; category?: { _ref?: string } }>
    )
      .filter((p) => p.slug?.current !== slug)
      .slice(0, 4);
  } else if (query.includes('_type == "product"')) {
    result = data.products;
  } else if (query.includes('_type == "seller"')) {
    result = data.sellers;
  } else if (query.includes('_type == "category"')) {
    result = data.categories;
  } else if (
    query.includes('_type == "review"') &&
    query.includes("product->slug.current == $slug")
  ) {
    const slug = params.slug as string;
    result = (data.reviews as Array<{ product?: { _ref?: string } }>).filter((r) => {
      const product = (
        data.products as Array<{ _id?: string; slug?: { current?: string } }>
      ).find((p) => p._id === r.product?._ref);
      return product?.slug?.current === slug;
    });
  } else {
    result = [];
  }

  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(result as T), 150);
  });
}
