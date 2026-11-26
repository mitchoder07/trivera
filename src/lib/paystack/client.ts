/**
 * Trivera Paystack client (mock).
 *
 * This file is structurally identical to a real Paystack integration. The
 * `initializePayment(email, amount, reference)` function returns a Promise
 * that resolves to a Paystack-style transaction response. In this demo the
 * promise resolves after 2 seconds with `{ status: "success", reference }`.
 *
 * ---- Production swap ----
 * 1. npm i @paystack/inline
 * 2. Add PAYSTACK_PUBLIC_KEY to .env.local (test key starts with pk_test_)
 * 3. Replace `initializePayment` body with:
 *
 *      import Paystack from "@paystack/inline";
 *
 *      export function initializePayment(opts: PaystackOptions): Promise<PaystackResult> {
 *        return new Promise((resolve, reject) => {
 *          const handler = new Paystack();
 *          handler.setup({
 *            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
 *            email: opts.email,
 *            amount: opts.amount,            // in kobo (NGN * 100)
 *            ref: opts.reference,
 *            currency: "NGN",
 *            callback: (response) => resolve({
 *              status: response.status as "success",
 *              reference: response.reference,
 *            }),
 *            onClose: () => reject(new Error("Paystack checkout closed")),
 *          });
 *        });
 *      }
 *
 *    For server-side verification (recommended) add a route handler that
 *    POSTs the reference to https://api.paystack.co/transaction/verify
 *    with the secret key `Bearer sk_test_...` before fulfilling the order.
 *    ---------------------------------
 */

export interface PaystackOptions {
  email: string;
  amount: number; // in kobo (Naira * 100)
  reference: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackResult {
  status: "success" | "failed" | "cancelled";
  reference: string;
  message: string;
  gatewayResponse?: string;
}

/** Generate a Paystack-style transaction reference. */
export function generateReference(prefix = "TRV"): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}_${ts}${rand}`;
}

/**
 * Mock Paystack checkout. Resolves after 2 seconds with a success response.
 * Swap with the real @paystack/inline handler (see comment at top of file)
 * when the test keys are available.
 */
export function initializePayment(opts: PaystackOptions): Promise<PaystackResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: "success",
        reference: opts.reference,
        message: "Approved",
        gatewayResponse: "Successful",
      });
    }, 2000);
  });
}

/** Format an amount in kobo as a Naira display string. */
export function formatNairaFromKobo(kobo: number): string {
  return formatNaira(Math.round(kobo / 100));
}

export function formatNaira(naira: number): string {
  return "\u20A6" + naira.toLocaleString("en-NG");
}
