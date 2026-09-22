"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import TourCard from "@/components/tours/TourCard";
import { Tour } from "@/lib/types";
import { tours as initialTours } from "@/lib/data/tours";

const tabs = ["All", "Cultural", "Adventure", "Nature", "Expedition", "Heritage"];

const TopActivities = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch("/api/tours");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTours(data);
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const visibleTours = tours.filter((t) => !t.isHidden);
  const filtered = activeTab === "All"
    ? visibleTours.slice(0, 6)
    : visibleTours.filter((t) => {
        const cat = (t.category || "").toLowerCase();
        const desc = (t.description || "").toLowerCase();
        const name = (t.name || "").toLowerCase();
        return cat.includes(activeTab.toLowerCase()) || desc.includes(activeTab.toLowerCase()) || name.includes(activeTab.toLowerCase());
      }).slice(0, 6);
  const display = filtered.length > 0 ? filtered : visibleTours.slice(0, 6);

  return (
    <section className="py-10 md:py-14 px-4 md:px-8" style={{ backgroundColor: "#FFF8F5" }}>
      <div className="container-main">
        <SectionHeader tag="🎯 Activities" title="Top Tribal Activities & Experiences" subtitle="Immerse yourself in authentic traditions, nature trails, and cultural celebrations" />
        <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-orange text-orange-foreground" : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-orange rounded-full" style={{ zIndex: -1 }} />
              )}
              {tab}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {display.map((tour, i) => (
                  <TourCard key={`${tour.slug}-${i}`} tour={tour} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
            <div className="text-center mt-8">
              <Link
                href="/activities"
                className="inline-block px-8 py-3 border-2 border-orange text-orange font-medium rounded-xl hover:bg-orange hover:text-orange-foreground transition-colors"
              >
                Explore All Activities
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default TopActivities;
