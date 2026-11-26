"use client";

import {
  Smartphone,
  Laptop,
  Shirt,
  Sofa,
  Sparkles,
  Tv,
  Package,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  laptop: Laptop,
  shirt: Shirt,
  sofa: Sofa,
  sparkles: Sparkles,
  tv: Tv,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Package;
  return <Icon className={className} />;
}
