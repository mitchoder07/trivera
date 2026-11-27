"use client";

import { useState } from "react";
import {
  ChevronDown,
  Heart,
  ListOrdered,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  User,
  X,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { useViewStore } from "@/store/view-store";
import { useCategories } from "./use-sanity";
import { cn } from "@/lib/utils";
import { Wordmark } from "./wordmark";
import { CategoryIcon } from "./category-icon";
import { SanityStudioModal } from "./sanity-studio-modal";

export function Header() {
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.open);
  const { view, goHome, setSearch, setCategory } = useViewStore();
  const [searchInput, setSearchInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const { data: categories } = useCategories();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setCategory(null);
    goHome();
  };

  const handleCategory = (slug: string | null) => {
    setCategory(slug);
    goHome();
    setCategoriesOpen(false);
    setMobileMenuOpen(false);
  };

  // Toast for not-yet-functional links on the demo
  const comingSoon = (label: string) => {
    toast(`${label} is not part of this demo. This is a portfolio showcase of the Sanity CMS + Next.js architecture.`, {
      position: "top-center",
    });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Utility bar */}
      <div className="hidden border-b border-border bg-neutral-900 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-4 py-1.5">
            <button
              onClick={() => comingSoon("Sell on Trivera")}
              className="flex items-center gap-1 transition-colors hover:text-cta"
            >
              <Truck className="size-3" /> Sell on Trivera
            </button>
            <button
              onClick={() => comingSoon("Customer Care")}
              className="flex items-center gap-1 transition-colors hover:text-cta"
            >
              <Phone className="size-3" /> Customer Care
            </button>
            <button
              onClick={() => comingSoon("Track My Order")}
              className="flex items-center gap-1 transition-colors hover:text-cta"
            >
              <ListOrdered className="size-3" /> Track My Order
            </button>
          </div>
          <div className="flex items-center gap-4 py-1.5">
            <button
              onClick={() => setStudioOpen(true)}
              className="flex items-center gap-1 font-medium text-cta transition-colors hover:text-white"
            >
              <LayoutDashboard className="size-3" /> View Sanity Studio Demo
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => comingSoon("Log In")}
              className="flex items-center gap-1 transition-colors hover:text-cta"
            >
              <User className="size-3" /> Log In
            </button>
            <button
              onClick={() => comingSoon("Sign Up")}
              className="rounded bg-white/10 px-2 py-0.5 font-medium transition-colors hover:bg-white/20"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-6 text-foreground" />
        </button>

        <button onClick={goHome} aria-label="Trivera home" className="shrink-0">
          <Wordmark />
        </button>

        {/* Search */}
        <form onSubmit={submitSearch} className="mx-auto hidden flex-1 max-w-2xl md:flex">
          <div className="flex w-full overflow-hidden rounded-md border border-border">
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products, brands and categories"
              className="flex-1 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search Trivera"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-cta px-4 text-sm font-semibold text-white transition-colors hover:bg-cta-dark"
              aria-label="Search"
            >
              <Search className="size-4" /> SEARCH
            </button>
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => comingSoon("Wishlist")}
            className="hidden rounded-md p-2 text-foreground hover:bg-accent sm:block"
            aria-label="Wishlist"
          >
            <Heart className="size-5" />
          </button>
          <button
            onClick={() => comingSoon("Account")}
            className="hidden rounded-md p-2 text-foreground hover:bg-accent sm:block"
            aria-label="Account"
          >
            <User className="size-5" />
          </button>
          <button
            onClick={openCart}
            className="relative rounded-md p-2 text-foreground hover:bg-accent"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingCart className="size-6" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="px-4 pb-3 md:hidden">
        <form onSubmit={submitSearch} className="flex w-full overflow-hidden rounded-md border border-border">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Trivera"
            className="flex-1 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search Trivera"
          />
          <button type="submit" className="bg-cta px-3 text-white" aria-label="Search">
            <Search className="size-5" />
          </button>
        </form>
      </div>

      {/* Category nav bar */}
      <nav className="border-t border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-2 text-sm">
          <div
            className="relative"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              onClick={() => setCategoriesOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold text-foreground hover:bg-accent"
            >
              <Menu className="size-4" /> Categories <ChevronDown className="size-3.5" />
            </button>
            <AnimatePresence>
              {categoriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-50 w-64 rounded-md border border-border bg-white py-2 shadow-lg"
                >
                  <button
                    onClick={() => handleCategory(null)}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent",
                      !useViewStore.getState().activeCategory && "font-semibold text-cta",
                    )}
                  >
                    All Categories
                  </button>
                  {categories?.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => handleCategory(c.slug)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-accent"
                    >
                      <CategoryIcon name={c.icon} className="size-4 text-cta" />
                      <span>{c.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{c.productCount}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={goHome} className={cn("rounded-md px-3 py-1.5 hover:bg-accent", view === "home" && "font-semibold text-cta")}>
            Home
          </button>
          <button onClick={() => handleCategory("phones-tablets")} className="hidden rounded-md px-3 py-1.5 hover:bg-accent sm:block">
            Phones &amp; Tablets
          </button>
          <button onClick={() => handleCategory("computing-laptops")} className="hidden rounded-md px-3 py-1.5 hover:bg-accent sm:block">
            Computing
          </button>
          <button onClick={() => handleCategory("fashion")} className="hidden rounded-md px-3 py-1.5 hover:bg-accent sm:block">
            Fashion
          </button>
          <button onClick={() => handleCategory("home-appliances")} className="hidden rounded-md px-3 py-1.5 hover:bg-accent sm:block">
            Home &amp; Appliances
          </button>
          <span className="ml-auto hidden items-center gap-1 text-xs font-semibold text-cta lg:flex">
            <Truck className="size-4" /> Free delivery on orders over &#8358;25,000
          </span>
        </div>
      </nav>

      {/* Mobile slide-over menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 z-50 flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <Wordmark />
                <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex flex-col p-2">
                <MobileLink icon={<LayoutDashboard className="size-4" />} label="Sanity Studio Demo" onClick={() => { setMobileMenuOpen(false); setStudioOpen(true); }} />
                <MobileLink icon={<User className="size-4" />} label="Log In" onClick={() => comingSoon("Log In")} />
                <MobileLink icon={<User className="size-4" />} label="Sign Up" onClick={() => comingSoon("Sign Up")} />
                <MobileLink icon={<Truck className="size-4" />} label="Sell on Trivera" onClick={() => comingSoon("Sell on Trivera")} />
                <MobileLink icon={<Phone className="size-4" />} label="Customer Care" onClick={() => comingSoon("Customer Care")} />
                <MobileLink icon={<ListOrdered className="size-4" />} label="Track My Order" onClick={() => comingSoon("Track My Order")} />
              </div>
              <div className="border-t border-border p-2">
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Categories
                </p>
                <button onClick={() => handleCategory(null)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-accent">
                  All Categories
                </button>
                {categories?.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => handleCategory(c.slug)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-accent"
                  >
                    <CategoryIcon name={c.icon} className="size-4 text-cta" />
                    {c.name}
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <SanityStudioModal open={studioOpen} onOpenChange={setStudioOpen} />
    </header>
  );
}

function MobileLink({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium hover:bg-accent"
    >
      <span className="text-cta">{icon}</span>
      {label}
    </button>
  );
}
