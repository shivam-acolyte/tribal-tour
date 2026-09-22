"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TourCard from "@/components/tours/TourCard";
import { useState, useEffect, useRef } from "react";
import { Tour } from "@/lib/types";
import { tours as initialTours } from "@/lib/data/tours";
import { Search, X, Loader2, MapPin, Sparkles } from "lucide-react";

export default function ToursClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState("popularity");
  const [tours, setTours] = useState<Tour[]>(initialTours);

  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setInputValue(q);
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("/api/tours");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setTours(data);
      } catch (error) {
        console.error("Error fetching tours, using local fallback:", error);
      }
    };
    fetchTours();
  }, []);

  useEffect(() => {
    if (inputValue.trim() === searchQuery.trim()) {
      setIsDebouncing(false);
      return;
    }
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      const trimmed = inputValue.trim();
      setSearchQuery(trimmed);
      setIsDebouncing(false);
      const params = new URLSearchParams();
      if (trimmed) params.set("q", trimmed);
      router.push(`/tours${params.toString() ? `?${params.toString()}` : ""}`);
    }, 5000);
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const triggerInstantSearch = (queryToSearch: string) => {
    const trimmed = queryToSearch.trim();
    setInputValue(trimmed);
    setSearchQuery(trimmed);
    setIsDebouncing(false);
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    router.push(`/tours${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const clearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    setIsDebouncing(false);
    setShowSuggestions(false);
    router.push("/tours");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      triggerInstantSearch(inputValue);
    }
  };

  const visibleTours = tours.filter((t) => !t.isHidden);

  const matchingSuggestions = inputValue.trim()
    ? visibleTours.filter((t) => {
        const q = inputValue.toLowerCase();
        return (
          t.name?.toLowerCase().includes(q) ||
          t.location?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
        );
      })
    : [];

  const uniqueDestinations = Array.from(
    new Set(
      visibleTours
        .flatMap((t) => [t.location, t.category])
        .filter((item): item is string => Boolean(item) && item.toLowerCase().includes(inputValue.toLowerCase()))
    )
  ).slice(0, 5);

  const filtered = searchQuery.trim()
    ? visibleTours.filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
          t.name?.toLowerCase().includes(q) ||
          t.location?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q)
        );
      })
    : visibleTours;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviewCount - a.reviewCount;
  });

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="relative py-20 bg-navy">
          <div className="container-main px-4 md:px-8 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground mb-3">Explore All Tours</h1>
            <p className="text-navy-foreground/60 text-sm">
              <Link href="/" className="hover:text-orange">Home</Link> &gt; Tours
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:w-64 shrink-0 space-y-6">
                <div className="bg-card rounded-xl p-5 card-shadow">
                  <h3 className="font-heading font-bold mb-3">Destination</h3>
                  <select className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none">
                    <option>All Destinations</option>
                    <option>Rajasthan</option>
                    <option>Himachal Pradesh</option>
                    <option>Thailand</option>
                    <option>Kerala</option>
                    <option>Nepal</option>
                    <option>Singapore</option>
                  </select>
                </div>
                <div className="bg-card rounded-xl p-5 card-shadow">
                  <h3 className="font-heading font-bold mb-3">Duration</h3>
                  <div className="space-y-2 text-sm">
                    {["1-3 Days", "4-7 Days", "8-14 Days", "15+ Days"].map((d) => (
                      <label key={d} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-orange" /> {d}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-xl p-5 card-shadow">
                  <h3 className="font-heading font-bold mb-3">Category</h3>
                  <div className="space-y-2 text-sm">
                    {["Adventure", "Cultural", "City Tours", "Wildlife", "Honeymoon"].map((c) => (
                      <label key={c} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="accent-orange" /> {c}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-xl p-5 card-shadow">
                  <h3 className="font-heading font-bold mb-3">Rating</h3>
                  <div className="space-y-2 text-sm">
                    {["4★ & above", "3★ & above"].map((r) => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="rating" className="accent-orange" /> {r}
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Tours grid */}
              <div className="flex-1">
                {/* Search bar */}
                <div ref={searchContainerRef} className="relative mb-6">
                  <div className="relative">
                    {isDebouncing ? (
                      <Loader2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
                    ) : (
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    )}
                    <input
                      type="text"
                      placeholder="Search by tour name, destination or category..."
                      value={inputValue}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-10 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-card shadow-sm"
                    />
                    {inputValue && (
                      <button
                        onClick={clearSearch}
                        aria-label="Clear search"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {showSuggestions && inputValue.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-2xl z-50 overflow-hidden divide-y divide-border">
                      {uniqueDestinations.length > 0 && (
                        <div className="p-3 bg-muted/30">
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-primary" /> Suggested Destinations &amp; Categories
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {uniqueDestinations.map((dest) => (
                              <button
                                key={dest}
                                onClick={() => triggerInstantSearch(dest)}
                                className="px-3 py-1 bg-card hover:bg-primary hover:text-primary-foreground border border-border rounded-lg text-xs font-medium transition-colors"
                              >
                                {dest}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="p-2 max-h-80 overflow-y-auto">
                        <p className="px-2 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3 text-primary" /> Matching Tours ({matchingSuggestions.length})
                        </p>
                        {matchingSuggestions.length > 0 ? (
                          <div className="space-y-1">
                            {matchingSuggestions.slice(0, 6).map((tour, idx) => (
                              <div
                                key={`${tour.slug}-${idx}`}
                                onClick={() => triggerInstantSearch(tour.name)}
                                className="flex items-center gap-3 p-2 hover:bg-muted/70 rounded-lg cursor-pointer transition-colors group"
                              >
                                <img src={tour.image} alt={tour.name} className="w-12 h-12 rounded-md object-cover shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                                    {tour.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span>📍 {tour.location}</span>
                                    <span>•</span>
                                    <span>{tour.duration}</span>
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-xs font-semibold text-primary">View Package</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-xs text-muted-foreground">
                            No matching tour suggestions found for &quot;{inputValue}&quot;
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-muted-foreground">
                    {sorted.length} tour{sorted.length !== 1 ? "s" : ""} found
                    {searchQuery && <span className="ml-1 text-primary font-medium">for &quot;{searchQuery}&quot;</span>}
                  </p>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low-High</option>
                    <option value="price-high">Price: High-Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                {sorted.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sorted.map((tour, i) => (
                      <TourCard key={`${tour.slug}-${i}`} tour={tour} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No tours found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
                    {searchQuery && (
                      <button onClick={clearSearch} className="mt-3 text-primary text-sm hover:underline">
                        Clear search
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
