"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Lock,
  CheckCircle2,
  Truck,
  ArrowLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useViewStore } from "@/store/view-store";
import {
  initializePayment,
  generateReference,
  formatNaira,
} from "@/lib/paystack/client";
import { NIGERIAN_STATES } from "./format";
import { PaystackIcon, VerveIcon, MastercardIcon, VisaIcon } from "./payment-icons";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShippingForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  lga: string;
}

const EMPTY_FORM: ShippingForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  lga: "",
};

export function CheckoutView() {
  const { items, subtotal, clear } = useCartStore();
  const { goHome, openConfirmation } = useViewStore();
  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM);
  const [paying, setPaying] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});

  const sub = subtotal();
  const shipping = items.some((i) => !i.freeShipping) ? 2500 : 0;
  const total = sub + shipping;

  const validate = (): boolean => {
    const e: Partial<ShippingForm> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/^\+?234[\d\s]{9,}$|^0[\d\s]{9,}$/.test(form.phone.trim())) e.phone = "Enter a valid Nigerian phone";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) e.email = "Enter a valid email";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state) e.state = "Select a state";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) {
      toast.error("Please complete the shipping form");
      return;
    }
    setPaying(true);
    const reference = generateReference();
    try {
      const result = await initializePayment({
        email: form.email,
        amount: total * 100, // kobo
        reference,
      });
      if (result.status === "success") {
        clear();
        openConfirmation(reference, total);
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch {
      toast.error("Payment was cancelled.");
    } finally {
      setPaying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-16 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-accent">
          <Truck className="size-10 text-cta" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add items to your cart before checking out.
          </p>
        </div>
        <button
          onClick={goHome}
          className="rounded-md bg-cta px-6 py-3 text-sm font-bold text-white hover:bg-cta-dark"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <button onClick={goHome} className="hover:text-cta">Home</button>
        <ChevronRight className="size-3" />
        <span className="text-foreground">Checkout</span>
      </nav>

      <button
        onClick={goHome}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-cta"
      >
        <ArrowLeft className="size-4" /> Continue shopping
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
              <span className="flex size-6 items-center justify-center rounded-full bg-cta text-xs font-bold text-white">1</span>
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full Name" error={errors.fullName} required>
                <Input
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Abdullahi Olatunji"
                />
              </Field>
              <Field label="Phone Number" error={errors.phone} required>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 0803 123 4567"
                  inputMode="tel"
                />
              </Field>
              <Field label="Email Address" error={errors.email} required className="sm:col-span-2">
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="for your order confirmation"
                  type="email"
                />
              </Field>
              <Field label="Street Address" error={errors.address} required className="sm:col-span-2">
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="House number, street name"
                />
              </Field>
              <Field label="City / Town" error={errors.city} required>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g. Offa"
                />
              </Field>
              <Field label="LGA (optional)">
                <Input
                  value={form.lga}
                  onChange={(e) => setForm({ ...form, lga: e.target.value })}
                  placeholder="Local Government Area"
                />
              </Field>
              <Field label="State" error={errors.state} required className="sm:col-span-2">
                <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {NIGERIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
              <span className="flex size-6 items-center justify-center rounded-full bg-cta text-xs font-bold text-white">2</span>
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-cta bg-cta/5 p-4">
                <input type="radio" name="payment" defaultChecked className="accent-[var(--cta)]" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Pay with Paystack (Card, Bank, USSD)</p>
                  <p className="text-xs text-muted-foreground">
                    Visa, Verve, Mastercard, bank transfer or USSD. Secured by Paystack.
                  </p>
                </div>
                <div className="flex gap-1">
                  <PaystackIcon className="h-6 w-auto" />
                  <VerveIcon className="h-6 w-auto" />
                  <MastercardIcon className="h-6 w-auto" />
                  <VisaIcon className="h-6 w-auto" />
                </div>
              </label>
              <label className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-border p-4 opacity-60">
                <input type="radio" name="payment" disabled className="accent-[var(--cta)]" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground">Not available for this order.</p>
                </div>
              </label>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5 text-deal" />
              Your payment is encrypted and processed on Paystack's secure servers.
            </div>
          </section>
        </div>

        {/* Order summary */}
        <aside className="lg:col-span-1">
          <div className="sticky top-32 rounded-xl border border-border bg-card p-5">
            <h2 className="mb-4 text-base font-bold text-foreground">Order Summary</h2>
            <ul className="trivera-scroll mb-4 max-h-64 flex flex-col gap-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.key} className="flex gap-2">
                  <div className="size-12 shrink-0 overflow-hidden rounded border border-border bg-muted">
                    <img src={item.image} alt={item.name} className="size-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-medium text-foreground">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.variantLabel} | Qty {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {formatNaira(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-border pt-3 text-sm">
              <Row label="Subtotal" value={formatNaira(sub)} />
              <Row label="Shipping" value={shipping === 0 ? "FREE" : formatNaira(shipping)} highlight={shipping === 0} />
              <div className="flex items-center justify-between border-t border-border pt-2 text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatNaira(total)}</span>
              </div>
            </div>
            <button
              onClick={handlePay}
              disabled={paying}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-cta py-3.5 text-sm font-bold text-white transition-colors hover:bg-cta-dark disabled:opacity-70"
            >
              {paying ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Processing payment...
                </>
              ) : (
                <>
                  <Lock className="size-4" /> Pay {formatNaira(total)}
                </>
              )}
            </button>
            <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3 text-deal" /> Buyer Protection on every order
            </p>
          </div>
        </aside>
      </div>

      {/* Mock Paystack modal */}
      <AnimatePresence>
        {paying && <PaystackMockModal total={total} email={form.email} />}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 text-xs font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "font-semibold text-deal" : "font-medium text-foreground"}>{value}</span>
    </div>
  );
}

function PaystackMockModal({ total, email }: { total: number; email: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between bg-[#0A1F44] px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="rounded bg-[#00C3F7] px-2 py-0.5 text-xs font-bold text-[#0A1F44]">
              Paystack
            </div>
            <span className="text-xs">Checkout</span>
          </div>
          <Lock className="size-4" />
        </div>
        <div className="p-6">
          <p className="text-xs text-neutral-500">Pay</p>
          <p className="text-3xl font-bold text-neutral-900">{formatNaira(total)}</p>
          <p className="mt-1 text-xs text-neutral-500">to Trivera Marketplace</p>
          <div className="mt-5 space-y-3">
            <div className="rounded-md border border-neutral-200 p-3">
              <p className="text-xs text-neutral-500">Card Number</p>
              <p className="font-mono text-sm text-neutral-700">4084 0840 8408 4081</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-neutral-200 p-3">
                <p className="text-xs text-neutral-500">Expiry</p>
                <p className="font-mono text-sm text-neutral-700">12 / 30</p>
              </div>
              <div className="rounded-md border border-neutral-200 p-3">
                <p className="text-xs text-neutral-500">CVV</p>
                <p className="font-mono text-sm text-neutral-700">***</p>
              </div>
            </div>
            <p className="text-center text-xs text-neutral-400">
              Test card. No real charge. Email: {email || "demo@trivera.ng"}
            </p>
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-neutral-600">
            <Loader2 className="size-4 animate-spin text-[#00C3F7]" />
            Authorizing transaction...
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ConfirmationView() {
  const { lastOrderRef, lastOrderTotal, goHome } = useViewStore();
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-4 py-12 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex size-20 items-center justify-center rounded-full bg-deal/10"
      >
        <CheckCircle2 className="size-12 text-deal" />
      </motion.div>
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Order Confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for shopping with Trivera. Your payment of{" "}
          <span className="font-semibold text-foreground">
            {lastOrderTotal != null ? formatNaira(lastOrderTotal) : ""}
          </span>{" "}
          was received successfully.
        </p>
      </div>
      <div className="w-full rounded-xl border border-border bg-card p-5 text-left">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-sm text-muted-foreground">Order Reference</span>
          <span className="font-mono text-sm font-bold text-foreground">{lastOrderRef}</span>
        </div>
        <div className="flex items-center justify-between pt-3">
          <span className="text-sm text-muted-foreground">Estimated Delivery</span>
          <span className="text-sm font-semibold text-foreground">2 to 5 business days</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        A confirmation email is on its way. Track your order anytime from your account.
      </p>
      <button
        onClick={goHome}
        className="rounded-md bg-cta px-6 py-3 text-sm font-bold text-white hover:bg-cta-dark"
      >
        Continue Shopping
      </button>
    </div>
  );
}
