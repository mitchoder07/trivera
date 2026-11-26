import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

/**
 * Real Sanity CMS client.
 *
 * Reads from your Sanity project at sanity.io using the GROQ queries
 * in ./queries.ts. The schema is in ./schema.ts (also used by Sanity Studio).
 *
 * Env vars (set in .env.local):
 *   SANITY_PROJECT_ID  — 8-char ID from sanity.io dashboard
 *   SANITY_DATASET     — usually "production"
 */

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET ?? "production",
  apiVersion: "2024-10-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: unknown) {
  return builder.image(source as never);
}

/**
 * Fetch helper that mimics the mock client's signature so existing
 * components (use-sanity.ts) keep working unchanged.
 */
export async function fetch<T = unknown>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  return client.fetch<T>(query, params);
}
