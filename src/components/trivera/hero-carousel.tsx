"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Slide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  discount?: string;
  bg: string;
  accent: string;
  textColor: string;
  image: string;
  imageAlt: string;
  align: "left" | "right";
}

const SLIDES: Slide[] = [
  {
    id: "black-friday",
    badge: "Limited time",
    title: "Black Friday Deals",
    subtitle: "Up to 40% off phones, laptops and home appliances. Stock moves fast.",
    cta: "Shop deals",
    discount: "40% OFF",
    bg: "linear-gradient(120deg, #0f0f0f 0%, #2d1b2e 60%, #1a1a1a 100%)",
    accent: "#f97316",
    textColor: "#ffffff",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Black Friday shopping bags and gift boxes",
    align: "left",
  },
  {
    id: "new-tech",
    badge: "Just landed",
    title: "New Tech, Fresh Prices",
    subtitle: "Samsung, Tecno, HP and Lenovo. Latest smartphones and laptops in stock.",
    cta: "Explore tech",
    discount: "From ₦124,500",
    bg: "linear-gradient(120deg, #1e1b4b 0%, #4c1d95 50%, #1a1a2e 100%)",
    accent: "#fbbf24",
    textColor: "#ffffff",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "Laptop and smartphone on a desk",
    align: "right",
  },
  {
    id: "fashion-week",
    badge: "Trending now",
    title: "Fashion Week Sale",
    subtitle: "Ankara, Agbada and ready-to-wear from Lagos and Kano tailors.",
    cta: "Shop fashion",
    discount: "UP TO 30% OFF",
    bg: "linear-gradient(120deg, #831843 0%, #be185d 50%, #4a044e 100%)",
    accent: "#fde047",
    textColor: "#ffffff",
    image: "https://images.unsplash.com/photo-1583394838336-acd977676fbd?w=1200&q=80&auto=format&fit=crop",
    imageAlt: "African wax print fashion on a model",
    align: "left",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(t);
  }, [paused]);

  const go = (dir: number) =>
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  const slide = SLIDES[index];

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative min-h-[300px] sm:min-h-[380px] md:min-h-[440px]"
        >
          {/* Background image, full bleed */}
          <img
            src={slide.image}
            alt={slide.imageAlt}
            className="absolute inset-0 size-full object-cover"
            loading="eager"
          />
          {/* Gradient overlay for text legibility */}
          <div
            className="absolute inset-0"
            style={{ background: slide.bg }}
          />
          {/* Subtle pattern overlay for texture */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)",
            }}
          />

          {/* Content */}
          <div
            className={`relative flex h-full items-center ${
              slide.align === "right" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xl p-6 sm:p-10 md:p-14">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                  style={{ background: slide.accent, color: "#1a1a1a" }}
                >
                  {slide.badge}
                </span>
                {slide.discount && (
                  <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                    {slide.discount}
                  </span>
                )}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="mt-3 text-3xl font-extrabold leading-[1.05] sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ color: slide.textColor }}
              >
                {slide.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="mt-3 max-w-md text-sm sm:text-base md:text-lg"
                style={{ color: slide.textColor, opacity: 0.9 }}
              >
                {slide.subtitle}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="group mt-5 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl sm:text-base"
                style={{ background: slide.accent, color: "#1a1a1a" }}
              >
                {slide.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next arrows (desktop) */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/40 sm:block"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/40 sm:block"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={
              i === index
                ? "h-2 w-8 rounded-full bg-white transition-all"
                : "h-2 w-2 rounded-full bg-white/50 transition-all hover:bg-white/80"
            }
          />
        ))}
      </div>
    </div>
  );
}
