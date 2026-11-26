"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity/client";
import { queries } from "@/lib/sanity/queries";
import type {
  ProductCard,
  ProductDetail,
  Seller,
  Category,
  Review,
} from "@/lib/sanity/types";

/** Generic fetch hook wrapping the mock Sanity client with loading state. */
export function useSanity<T>(
  query: string,
  params: Record<string, unknown> = {},
  enabled = true,
): { data: T | undefined; loading: boolean; error: Error | undefined } {
  // Initialise loading from `enabled` so disabled hooks never show a spinner
  // without needing a synchronous setState inside the effect.
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | undefined>(undefined);

  // Serialise params into the dependency key.
  const key = JSON.stringify(params);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const promise = client.fetch<T>(query, params);
    promise
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, key, enabled]);

  return { data, loading, error };
}

export function useProducts(): {
  data: ProductCard[] | undefined;
  loading: boolean;
} {
  const { data, loading } = useSanity<ProductCard[]>(queries.allProducts);
  return { data, loading };
}

export function useProduct(slug: string | null): {
  data: ProductDetail | undefined;
  loading: boolean;
} {
  const { data, loading } = useSanity<ProductDetail | null>(
    queries.productBySlug,
    { slug: slug ?? "" },
    slug !== null,
  );
  return { data: data ?? undefined, loading };
}

export function useSellers(): {
  data: Seller[] | undefined;
  loading: boolean;
} {
  const { data, loading } = useSanity<Seller[]>(queries.allSellers);
  return { data, loading };
}

export function useCategories(): {
  data: Category[] | undefined;
  loading: boolean;
} {
  const { data, loading } = useSanity<Category[]>(queries.allCategories);
  return { data, loading };
}

export function useReviews(slug: string | null): {
  data: Review[] | undefined;
  loading: boolean;
} {
  const { data, loading } = useSanity<Review[]>(
    queries.reviewsForProduct,
    { slug: slug ?? "" },
    slug !== null,
  );
  return { data, loading };
}

export function useRelatedProducts(slug: string | null): {
  data: ProductCard[] | undefined;
  loading: boolean;
} {
  const { data, loading } = useSanity<ProductCard[]>(
    queries.relatedProducts,
    { slug: slug ?? "" },
    slug !== null,
  );
  return { data, loading };
}
