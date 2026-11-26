import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trivera | Online Shopping in Nigeria - Phones, Fashion, Electronics, Home & Beauty",
  description:
    "Trivera Nigeria: shop smartphones, laptops, fashion, home appliances and beauty. Pay on delivery options, fast shipping, Black Friday deals and everyday low prices in Naira.",
  keywords: [
    "Trivera",
    "Nigeria online shopping",
    "Jumia alternative",
    "Konga",
    "buy phones Nigeria",
    "Ankara fashion",
    "Paystack checkout",
  ],
  authors: [{ name: "Trivera Marketplace" }],
  openGraph: {
    title: "Trivera | Online Shopping in Nigeria",
    description: "Phones, Fashion, Electronics, Home & Beauty. Low prices, fast shipping.",
    siteName: "Trivera",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trivera | Online Shopping in Nigeria",
    description: "Phones, Fashion, Electronics, Home & Beauty.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
