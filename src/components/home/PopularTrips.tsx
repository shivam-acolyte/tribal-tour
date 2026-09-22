"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import TourCard from "@/components/tours/TourCard";
import { Tour } from "@/lib/types";
import { tours as initialTours } from "@/lib/data/tours";

const PopularTrips = () => {
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
        console.error("Error fetching tours, using local fallback:", error);
      }
    };
    fetchTours();
  }, []);

  return (
    <section className="pt-12 md:pt-16 pb-8 md:pb-10 px-4 md:px-8">
      <div className="container-main">
        <SectionHeader tag="🔥 Top Picks" title="Popular Tour Packages" subtitle="Hand-picked tribal journeys loved by thousands of travelers" />
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours
              .filter((tour) => !tour.isHidden)
              .slice(0, 6)
              .map((tour, i) => (
              <TourCard key={`${tour.slug}-${i}`} tour={tour} index={i} />
            ))}
          </div>
        )}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-6 md:mt-8">
          <Link
            href="/packages"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            Explore All Packages
          </Link>
          <Link
            href="/tours"
            className="inline-block px-8 py-3 border-2 border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View All Tours
          </Link>
        </div>
      </div>
    </section>
);
};

export default PopularTrips;
