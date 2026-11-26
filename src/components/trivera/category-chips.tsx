"use client";

import { useViewStore } from "@/store/view-store";
import { useCategories } from "./use-sanity";
import { CategoryIcon } from "./category-icon";
import { cn } from "@/lib/utils";

export function CategoryChips() {
  const { data: categories } = useCategories();
  const { activeCategory, setCategory, goHome } = useViewStore();

  const handleClick = (slug: string | null) => {
    setCategory(slug);
    goHome();
    if (typeof window !== "undefined") {
      const el = document.getElementById("product-grid-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      <Chip
        active={activeCategory === null}
        onClick={() => handleClick(null)}
      >
        All
      </Chip>
      {categories?.map((c) => (
        <Chip
          key={c._id}
          active={activeCategory === c.slug}
          onClick={() => handleClick(c.slug)}
        >
          <CategoryIcon name={c.icon} className="size-4" />
          {c.name}
          <span className="ml-1 text-xs text-muted-foreground">({c.productCount})</span>
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
        active
          ? "border-cta bg-cta text-white"
          : "border-border bg-white text-foreground hover:border-cta hover:text-cta",
      )}
    >
      {children}
    </button>
  );
}
