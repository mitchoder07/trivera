"use client";

import { useEffect } from "react";
import { Header } from "@/components/trivera/header";
import { Footer } from "@/components/trivera/footer";
import { CartDrawer } from "@/components/trivera/cart-drawer";
import { HomeView } from "@/components/trivera/home-view";
import { ProductDetailView } from "@/components/trivera/product-detail-view";
import { CheckoutView, ConfirmationView } from "@/components/trivera/checkout-view";
import { MobileBottomNav } from "@/components/trivera/mobile-bottom-nav";
import { useViewStore } from "@/store/view-store";

export default function Home() {
  const { view, productSlug, openProduct, goHome } = useViewStore();

  // Sync URL <-> view state for shareable product links (?product=<slug>).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const urlProduct = params.get("product");
    if (urlProduct && view === "home" && !productSlug) {
      openProduct(urlProduct);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (view === "product" && productSlug) {
      url.searchParams.set("product", productSlug);
    } else {
      url.searchParams.delete("product");
    }
    window.history.replaceState({}, "", url.toString());
  }, [view, productSlug]);

  // Back button support: popstate returns to home.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      const urlProduct = params.get("product");
      if (!urlProduct && view !== "checkout" && view !== "confirmation") {
        goHome();
      } else if (urlProduct && urlProduct !== productSlug) {
        openProduct(urlProduct);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [view, productSlug, goHome, openProduct]);

  // Browser back from checkout/confirmation should land on home.
  useEffect(() => {
    if (view === "checkout" || view === "confirmation") {
      window.history.pushState({ trivera: view }, "");
      const onPop = () => goHome();
      window.addEventListener("popstate", onPop);
      return () => window.removeEventListener("popstate", onPop);
    }
  }, [view, goHome]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        {view === "home" && <HomeView />}
        {view === "product" && productSlug && <ProductDetailView key={productSlug} slug={productSlug} />}
        {view === "checkout" && <CheckoutView />}
        {view === "confirmation" && <ConfirmationView />}
      </main>
      <Footer />
      <CartDrawer />
      <MobileBottomNav />
    </div>
  );
}
