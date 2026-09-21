"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TourCard from "@/components/tours/TourCard";
import CTABanner from "@/components/home/CTABanner";
import FAQSection from "@/components/shared/FAQSection";
import { Tour } from "@/lib/types";
import { tours as initialTours } from "@/lib/data/tours";
import { Search, Sparkles, Filter } from "lucide-react";

const durationFilters = ["All", "3-5 Days", "6-8 Days", "9+ Days"];
const categoryFilters = ["All", "Cultural", "Adventure", "Nature", "Expedition"];

export default function PackagesClient() {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("/api/tours");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTours(data);
          }
        }
      } catch (error) {
        console.error("Error fetching tours for packages, using fallback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const visibleTours = tours.filter((t) => !t.isHidden);

  const filteredTours = visibleTours.filter((tour) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tour.name?.toLowerCase().includes(q);
      const matchLoc = tour.location?.toLowerCase().includes(q);
      const matchDesc = tour.description?.toLowerCase().includes(q);
      const matchCat = tour.category?.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchDesc && !matchCat) return false;
    }

    // Category filter
    if (selectedCategory !== "All") {
      const cat = (tour.category || "").toLowerCase();
      if (!cat.includes(selectedCategory.toLowerCase())) return false;
    }

    // Duration filter
    if (selectedDuration !== "All") {
      const dur = tour.duration || "";
      const daysMatch = dur.match(/(\d+)\s*Days?/i);
      const days = daysMatch ? parseInt(daysMatch[1], 10) : 0;
      if (selectedDuration === "3-5 Days" && (days < 3 || days > 5)) return false;
      if (selectedDuration === "6-8 Days" && (days < 6 || days > 8)) return false;
      if (selectedDuration === "9+ Days" && days < 9) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* Hero Banner */}
        <section className="relative py-20 bg-navy">
          <div className="container-main px-4 md:px-8 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange/20 text-orange border border-orange/30 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Curated Itineraries
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground mb-3">
              Travel Packages
            </h1>
            <p className="text-navy-foreground/70 max-w-xl mx-auto text-sm md:text-base mb-4">
              Explore our hand-crafted, all-inclusive tribal tour packages covering authentic cultural immersions, village homestays, and scenic expeditions.
            </p>
            <p className="text-navy-foreground/60 text-xs md:text-sm">
              <Link href="/" className="hover:text-orange transition-colors">Home</Link> &gt; Packages
            </p>
          </div>
        </section>

        {/* Filter and Search Bar */}
        <section className="py-8 bg-muted/40 border-b">
          <div className="container-main px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search packages by destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                <span className="text-xs text-muted-foreground font-medium mr-1 hidden sm:inline flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Category:
                </span>
                {categoryFilters.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-background text-muted-foreground border hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Duration Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {durationFilters.map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setSelectedDuration(dur)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedDuration === dur
                        ? "bg-orange text-orange-foreground shadow-sm"
                        : "bg-background text-muted-foreground border hover:text-foreground"
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tour Cards Grid */}
        <section className="section-padding">
          <div className="container-main">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <strong className="text-foreground">{filteredTours.length}</strong> travel packages
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              </div>
            ) : filteredTours.length > 0 ? (
              <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTours.map((tour, i) => (
                    <TourCard key={tour.slug} tour={tour} index={i} />
                  ))}
                </div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-24 bg-card rounded-2xl border">
                <h3 className="text-lg font-heading font-semibold mb-2">No packages match your filters</h3>
                <p className="text-sm text-muted-foreground mb-4">Try clearing some of your search filters or browse all packages.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedDuration("All");
                  }}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        <FAQSection
          title="Frequently Asked Questions about Packages"
          description="Everything you need to know about our tribal travel packages and bookings"
          faqs={[
            {
              question: "What is included in your tribal tour packages?",
              answer: "All our packages include verified tribal guides, homestay/hotel accommodation, daily meals as specified, local private transportation, inner-line permits where required, and curated cultural experiences.",
            },
            {
              question: "Can I customize an existing package?",
              answer: "Yes! We specialize in bespoke tribal itineraries. Simply get in touch with our travel team to adjust dates, group sizes, destinations, or specific tribal festival requests.",
            },
            {
              question: "Are inner-line permits handled by Tribal Discovery Tour?",
              answer: "Yes, for protected regions like Nagaland, Arunachal Pradesh, Mizoram, and parts of Ladakh, we manage all necessary permit applications on your behalf.",
            },
            {
              question: "What is the cancellation and refund policy?",
              answer: "We offer flexible booking policies. Cancellations made 15+ days prior to departure receive a full refund minus nominal processing fees. Please contact us for detailed terms.",
            },
          ]}
        />

        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
