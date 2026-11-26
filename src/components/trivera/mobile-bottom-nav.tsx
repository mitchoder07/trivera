"use client";

import { Home, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useViewStore } from "@/store/view-store";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const { view, goHome } = useViewStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.open);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t border-border bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.05)] md:hidden">
      <NavButton
        active={view === "home"}
        onClick={goHome}
        icon={<Home className="size-5" />}
        label="Home"
      />
      <NavButton
        onClick={() => {
          goHome();
          setTimeout(() => {
            const el = document.getElementById("product-grid-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }, 50);
        }}
        icon={<LayoutGrid className="size-5" />}
        label="Categories"
      />
      <NavButton
        onClick={openCart}
        icon={
          <span className="relative">
            <ShoppingCart className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </span>
        }
        label="Cart"
      />
      <NavButton icon={<User className="size-5" />} label="Account" />
    </nav>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
        active ? "text-cta" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
