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
import { Compass, Footprints, Flame, Camera, Trees, Search } from "lucide-react";

const activityCategories = [
  { id: "All", label: "All Activities", icon: Compass },
  { id: "Cultural", label: "Cultural Immersion", icon: Flame },
  { id: "Adventure", label: "Treks & Adventure", icon: Footprints },
  { id: "Nature", label: "Nature & Wildlife", icon: Trees },
  { id: "Heritage", label: "Living Heritage", icon: Camera },
];

export default function ActivitiesClient() {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [loading, setLoading] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

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
        console.error("Error fetching activities, using fallback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const visibleTours = tours.filter((t) => !t.isHidden);

  const filtered = visibleTours.filter((tour) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = tour.name?.toLowerCase().includes(q);
      const matchLoc = tour.location?.toLowerCase().includes(q);
      const matchDesc = tour.description?.toLowerCase().includes(q);
      const matchHighlights = tour.highlights?.some((h) => h.label?.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchDesc && !matchHighlights) return false;
    }

    if (activeCat !== "All") {
      const cat = (tour.category || "").toLowerCase();
      const desc = (tour.description || "").toLowerCase();
      const highlights = (tour.highlights || []).map((h) => h.label?.toLowerCase()).join(" ");
      const combined = `${cat} ${desc} ${highlights}`;
      if (!combined.includes(activeCat.toLowerCase())) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-navy">
          <div className="container-main px-4 md:px-8 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange/20 text-orange border border-orange/30 rounded-full text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" /> Hands-On Experiences
            </span>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground mb-3">
              Tribal Activities & Experiences
            </h1>
            <p className="text-navy-foreground/70 max-w-xl mx-auto text-sm md:text-base mb-4">
              Participate in authentic village ceremonies, traditional weaving workshops, sacred forest trails, and indigenous culinary lessons.
            </p>
            <p className="text-navy-foreground/60 text-xs md:text-sm">
              <Link href="/" className="hover:text-orange transition-colors">Home</Link> &gt; Activities
            </p>
          </div>
        </section>

        {/* Categories Bar */}
        <section className="py-8 bg-muted/30 border-b">
          <div className="container-main px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Category buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {activityCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCat(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-background text-muted-foreground border hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search activities & trails..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-background border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Activity Tour Cards */}
        <section className="section-padding">
          <div className="container-main">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <strong className="text-foreground">{filtered.length}</strong> experiential activities
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              </div>
            ) : filtered.length > 0 ? (
              <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((tour, i) => (
                    <TourCard key={tour.slug} tour={tour} index={i} />
                  ))}
                </div>
              </AnimatePresence>
            ) : (
              <div className="text-center py-24 bg-card rounded-2xl border">
                <h3 className="text-lg font-heading font-semibold mb-2">No activities match your filters</h3>
                <p className="text-sm text-muted-foreground mb-4">Try choosing a different activity category or clear the search.</p>
                <button
                  onClick={() => {
                    setActiveCat("All");
                    setSearchQuery("");
                  }}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  View All Activities
                </button>
              </div>
            )}
          </div>
        </section>

        <FAQSection
          title="Activities & Experiential Travel FAQ"
          description="Common questions about participating in tribal activities and community tourism"
          faqs={[
            {
              question: "Are these activities suitable for families and beginners?",
              answer: "Yes, most of our cultural workshops, village walks, and cooking sessions are family-friendly and suited for all age groups. Treks and high-altitude trails are clearly tagged with difficulty levels.",
            },
            {
              question: "How do activities support the local tribal communities?",
              answer: "Over 70% of tour proceeds go directly to tribal community guides, homestay hosts, local craftsmen, and cultural preservers, ensuring ethical and sustainable indigenous tourism.",
            },
            {
              question: "Is photography allowed during tribal ceremonies?",
              answer: "Our local guides will advise on local tribal customs and etiquette before each activity. Photography is welcome in most public village events, while sacred ceremonies require prior elder consent.",
            },
          ]}
        />

        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
