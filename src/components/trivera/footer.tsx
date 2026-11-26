"use client";

import { Link as LinkIcon, Mail, MapPin, Phone } from "lucide-react";
import { Wordmark } from "./wordmark";
import {
  PaystackIcon,
  VerveIcon,
  MastercardIcon,
  VisaIcon,
} from "./payment-icons";

const FOOTER_COLUMNS = [
  {
    title: "Help Center",
    links: ["Track My Order", "Returns & Refunds", "Shipping & Delivery", "Payment Options", "Report a Product", "Contact Us"],
  },
  {
    title: "About Trivera",
    links: ["About Us", "Careers", "Press", "Trivera for Business", "Become a Seller", "Affiliate Program"],
  },
  {
    title: "Make Money",
    links: ["Sell on Trivera", "Vendor Central", "Become a J-Force Agent", "Bulk Buying", "Wholesale Deals", "Advertise with Us"],
  },
  {
    title: "Our Services",
    links: ["Trivera Pay", "Trivera Express", "Trivera Food", "Trivera Health", "Gift Cards", "Black Friday 2025"],
  },
];

const SOCIALS = [
  { name: "Facebook", href: "#", icon: "f" },
  { name: "Twitter", href: "#", icon: "t" },
  { name: "Instagram", href: "#", icon: "ig" },
  { name: "YouTube", href: "#", icon: "yt" },
];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-neutral-900 text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-3">
              <Wordmark className="[&_span]:text-white" swooshClassName="opacity-90" />
            </div>
            <p className="mb-4 max-w-xs text-sm text-neutral-400">
              Trivera is a Nigerian online marketplace connecting buyers with verified sellers across all 36 states. Shop phones, fashion, electronics and home essentials with confidence.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-2">
                <MapPin className="size-4 text-cta" /> Umitili Road, Offa, Kwara State, Nigeria
              </span>
              <span className="flex items-center gap-2">
                <Phone className="size-4 text-cta" /> 0700 TRIVERA (874 8372)
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-4 text-cta" /> help@trivera.ng
              </span>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2 text-sm">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-neutral-400 transition-colors hover:text-cta">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                We Accept
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <PaystackIcon className="h-7 w-auto" />
                <VerveIcon className="h-7 w-auto" />
                <MastercardIcon className="h-7 w-auto" />
                <VisaIcon className="h-7 w-auto" />
                <span className="rounded border border-white/20 px-2 py-1 text-[10px] font-medium text-neutral-300">
                  Bank Transfer
                </span>
                <span className="rounded border border-white/20 px-2 py-1 text-[10px] font-medium text-neutral-300">
                  USSD
                </span>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Follow Us
              </p>
              <div className="flex gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="flex size-9 items-center justify-center rounded-full border border-white/20 text-sm font-bold text-white transition-colors hover:bg-cta hover:border-cta"
                  >
                    {s.icon === "f" && "f"}
                    {s.icon === "t" && "t"}
                    {s.icon === "ig" && "ig"}
                    {s.icon === "yt" && "yt"}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Trivera Marketplace Ltd. RC 2198472. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#" className="hover:text-cta">Privacy Policy</a>
            <a href="#" className="hover:text-cta">Terms &amp; Conditions</a>
            <a href="#" className="hover:text-cta">Cookie Settings</a>
            <span className="flex items-center gap-1 text-neutral-400">
              <LinkIcon className="size-3" /> Powered by Next.js + Sanity CMS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
