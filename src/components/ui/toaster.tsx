"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Stub toaster. Uses sonner directly. If you want the full shadcn toaster
 * later, run `npx shadcn@latest add sonner` and replace this file.
 */
export function Toaster() {
  return <SonnerToaster position="top-center" richColors closeButton />;
}
