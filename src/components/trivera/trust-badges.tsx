"use client";

import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const BADGES = [
  { icon: Truck, title: "Nationwide Delivery", subtitle: "All 36 states + FCT" },
  { icon: ShieldCheck, title: "Authentic Products", subtitle: "Verified sellers only" },
  { icon: RotateCcw, title: "10-Day Returns", subtitle: "Change of mind accepted" },
  { icon: Headphones, title: "24/7 Customer Care", subtitle: "Real humans, anytime" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {BADGES.map((b) => (
        <div
          key={b.title}
          className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-3"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-cta">
            <b.icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{b.title}</p>
            <p className="truncate text-xs text-muted-foreground">{b.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
