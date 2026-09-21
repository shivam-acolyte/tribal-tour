"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, CalendarDays, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1280&q=75",
    alt: "Taj Mahal at sunrise",
    title: "Discover the Magic of",
    highlight: "North East India",
  },
  {
    image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1280&q=75",
    alt: "Misty mountains of Meghalaya",
    title: "Explore Untouched",
    highlight: "Tribal Cultures",
  },
  {
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1280&q=75",
    alt: "Living root bridges",
    title: "Experience Nature's",
    highlight: "Hidden Wonders",
  },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HeroSection = () => {
  const [destination, setDestination] = useState("");
  const [travelers, setTravelers] = useState("3-5 Travelers");
  const [current, setCurrent] = useState(0);
  const dateRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const next = useCallback(() => setCurrent((p) => (p + 1) % heroSlides.length), []);
  const prev = () => setCurrent((p) => (p - 1 + heroSlides.length) % heroSlides.length);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (destination.trim()) params.set("q", destination.trim());
    router.push(`/tours${params.toString() ? `?${params.toString()}` : ""}`);
  }, [destination, router]);

  // 5-second Debounce for Hero search input
  useEffect(() => {
    if (!destination.trim()) return;
    const timer = setTimeout(() => {
      handleSearch();
    }, 5000);
    return () => clearTimeout(timer);
  }, [destination, handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const openDatePicker = () => {
    const input = dateRef.current;
    if (!input) return;
    if (typeof (input as any).showPicker === "function") {
      (input as any).showPicker();
    } else {
      input.focus();
    }
  };

  const slide = heroSlides[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            srcSet={`${slide.image.replace("w=1280", "w=640")} 640w, ${slide.image} 1280w`}
            sizes="100vw"
            alt={slide.alt}
            width="1280"
            height="800"
            fetchPriority={current === 0 ? "high" : "auto"}
            decoding="async"
            loading="eager"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Slider Controls */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/20 backdrop-blur-sm text-background hover:bg-background/40 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/20 backdrop-blur-sm text-background hover:bg-background/40 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-primary w-8" : "bg-background/50"}`}
          />
        ))}
      </div>

      <div className="relative container-main px-4 md:px-8 py-20 md:py-0 text-center">
        <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-2xl">
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary-foreground text-sm font-semibold backdrop-blur-sm border border-primary/30">
              🏆 Your Guide to North East India
            </span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.h1
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-6 font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-background"
            >
              {slide.title}{" "}
              <span className="font-accent text-gold text-5xl md:text-7xl lg:text-8xl">{slide.highlight}</span>
            </motion.h1>
          </AnimatePresence>

          <motion.p variants={fadeUp} className="mt-4 text-background/70 text-lg max-w-lg text-center mx-auto">
            Explore breathtaking destinations, curated tours, and unforgettable tribal experiences with Tribal Discovery.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={fadeUp} className="mt-8 bg-background rounded-2xl p-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

              {/* Destination */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <input
                  type="text"
                  placeholder="Destination"
                  aria-label="Search destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-sm w-full focus:outline-none placeholder:text-muted-foreground"
                />
              </div>

              {/* Date — clicking the row or icon opens the picker */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted cursor-pointer"
                onClick={openDatePicker}
              >
                <CalendarDays className="h-4 w-4 text-primary shrink-0" />
                <input
                  ref={dateRef}
                  type="date"
                  aria-label="Select tour date"
                  className="bg-transparent text-sm w-full focus:outline-none text-muted-foreground cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Travelers */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted">
                <Users className="h-4 w-4 text-primary shrink-0" />
                <select
                  value={travelers}
                  aria-label="Number of travelers"
                  onChange={(e) => setTravelers(e.target.value)}
                  className="bg-transparent text-sm w-full focus:outline-none text-muted-foreground"
                >
                  <option>1 Traveler</option>
                  <option>2 Travelers</option>
                  <option>3-5 Travelers</option>
                  <option>6+ Travelers</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                aria-label="Search tours"
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
              >
                <Search className="h-4 w-4" /> Search Tours
              </button>

            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="mt-6 flex items-center gap-6 text-background/80 text-sm text-center justify-center">
            <span className="font-bold">5K+ <span className="font-normal opacity-70">Happy Travelers</span></span>
            <span className="w-px h-4 bg-background/30" />
            <span className="font-bold">120+ <span className="font-normal opacity-70">Destinations</span></span>
            <span className="w-px h-4 bg-background/30 hidden sm:block" />
            <span className="hidden sm:inline font-bold">4.9★ <span className="font-normal opacity-70">Avg Rating</span></span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
