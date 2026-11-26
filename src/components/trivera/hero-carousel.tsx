"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
  bg: string;
  accent: string;
  image: string;
  imageAlt: string;
}

const SLIDES: Slide[] = [
  {
    id: "black-friday",
    eyebrow: "Limited time",
    title: "Black Friday Deals",
    subtitle: "Up to 40% off phones, laptops and home appliances. Stock moves fast.",
    cta: "Shop deals",
    bg: "linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 100%)",
    accent: "#f97316",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Black Friday shopping bags and gift boxes",
  },
  {
    id: "new-tech",
    eyebrow: "Just landed",
    title: "New Arrivals in Tech",
    subtitle: "Fresh smartphones and laptops from Samsung, Tecno, HP and Lenovo.",
    cta: "Explore tech",
    bg: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
    accent: "#db2777",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Laptop and smartphone on a desk",
  },
  {
    id: "fashion-week",
    eyebrow: "Trending now",
    title: "Fashion Week Sale",
    subtitle: "Ankara, Agbada and ready-to-wear from Lagos and Kano tailors.",
    cta: "Shop fashion",
    bg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
    accent: "#db2777",
    image: "https://images.unsplash.com/photo-1583394838336-acd977676fbd?w=900&q=80&auto=format&fit=crop",
    imageAlt: "African wax print fashion on a model",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (dir: number) =>
    setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length);

  const slide = SLIDES[index];

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative grid min-h-[260px] grid-cols-1 sm:min-h-[340px] md:grid-cols-2"
          style={{ background: slide.bg }}
        >
          <div className="flex flex-col justify-center gap-3 p-6 sm:p-10">
            <span
              className="w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
              style={{ background: slide.accent }}
            >
              {slide.eyebrow}
            </span>
            <h2 className="text-3xl font-extrabold leading-tight text-foreground sm:text-5xl">
              {slide.title}
            </h2>
            <p className="max-w-md text-sm text-foreground/80 sm:text-base">
              {slide.subtitle}
            </p>
            <button
              className="mt-2 w-fit rounded-md px-6 py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
              style={{ background: slide.accent }}
            >
              {slide.cta}
            </button>
          </div>
          <div className="relative hidden md:block">
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="absolute inset-0 size-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, ${slide.bg.split(")")[0]} 0%, transparent 60%)`,
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-foreground shadow hover:bg-white sm:block"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-foreground shadow hover:bg-white sm:block"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={
              i === index
                ? "h-2 w-8 rounded-full bg-white"
                : "h-2 w-2 rounded-full bg-white/60"
            }
          />
        ))}
      </div>
    </div>
  );
}
