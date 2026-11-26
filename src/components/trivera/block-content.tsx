"use client";

import type { SanityBlock } from "@/lib/sanity/types";
import { blocksToRendered } from "./format";

/** Minimal Sanity Portable Text renderer for the subset we use. */
export function BlockContent({ blocks }: { blocks: SanityBlock[] | undefined }) {
  const rendered = blocksToRendered(blocks);
  if (!rendered.length) {
    return <p className="text-sm text-muted-foreground">No description available.</p>;
  }
  return (
    <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/90">
      {rendered.map((b) => {
        if (b.style === "h2") {
          return (
            <h2 key={b.key} className="mt-2 text-lg font-bold text-foreground">
              {b.text}
            </h2>
          );
        }
        if (b.style === "h3") {
          return (
            <h3 key={b.key} className="mt-2 text-base font-semibold text-foreground">
              {b.text}
            </h3>
          );
        }
        if (b.style === "blockquote") {
          return (
            <blockquote key={b.key} className="border-l-4 border-cta pl-4 italic text-muted-foreground">
              {b.text}
            </blockquote>
          );
        }
        return (
          <p key={b.key}>{b.text}</p>
        );
      })}
    </div>
  );
}
