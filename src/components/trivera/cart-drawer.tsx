"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useViewStore } from "@/store/view-store";
import { formatNaira } from "@/lib/paystack/client";
import { PriceTag } from "./price-tag";

export function CartDrawer() {
  const { items, isOpen, close, remove, setQuantity, subtotal } = useCartStore();
  const { openCheckout, goHome } = useViewStore();

  const handleCheckout = () => {
    close();
    openCheckout();
  };

  const handleStartShopping = () => {
    close();
    goHome();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <ShoppingBag className="size-5 text-cta" />
                Your Cart ({items.length})
              </h2>
              <button onClick={close} aria-label="Close cart" className="rounded-md p-1 hover:bg-accent">
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-accent">
                  <ShoppingBag className="size-10 text-cta" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">Your cart is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Browse our deals and add items to get started.
                  </p>
                </div>
                <button
                  onClick={handleStartShopping}
                  className="rounded-md bg-cta px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-cta-dark"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="trivera-scroll flex-1 overflow-y-auto p-4">
                  <ul className="flex flex-col gap-4">
                    {items.map((item) => (
                      <li key={item.key} className="flex gap-3">
                        <div className="size-20 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                          <img src={item.image} alt={item.name} className="size-full object-cover" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                              {item.name}
                            </h3>
                            <button
                              onClick={() => remove(item.key)}
                              aria-label={`Remove ${item.name}`}
                              className="shrink-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.variantLabel} | {item.sellerName}
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <PriceTag
                              price={item.price}
                              compareAtPrice={item.compareAtPrice}
                              size="sm"
                              showDiscount={false}
                            />
                            <div className="flex items-center rounded-md border border-border">
                              <button
                                onClick={() => setQuantity(item.key, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="flex size-7 items-center justify-center hover:bg-accent"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => setQuantity(item.key, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="flex size-7 items-center justify-center hover:bg-accent"
                              >
                                <Plus className="size-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="text-xl font-bold text-foreground">
                      {formatNaira(subtotal())}
                    </span>
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Shipping calculated at checkout. Free shipping on eligible items.
                  </p>
                  <button
                    onClick={handleCheckout}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-cta py-3 text-sm font-bold text-white transition-colors hover:bg-cta-dark"
                  >
                    Proceed to Checkout <ArrowRight className="size-4" />
                  </button>
                  <button
                    onClick={close}
                    className="mt-2 w-full rounded-md border border-border py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    Continue Shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
