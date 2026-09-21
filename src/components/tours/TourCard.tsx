"use client";

import Link from "next/link";
import { Star, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Tour } from "@/lib/types";
import { useBooking } from "@/contexts/BookingContext";

interface TourCardProps {
  tour: Tour;
  index?: number;
}

const badgeColors: Record<string, string> = {
  Popular: "bg-primary text-primary-foreground",
  New: "bg-success text-success-foreground",
  "Best Seller": "bg-gold text-gold-foreground",
  Trending: "bg-primary text-primary-foreground",
};

const TourCard = ({ tour, index = 0 }: TourCardProps) => {
  const { openBooking } = useBooking();
  const isTop = index < 6;

  return (
    <motion.div
      initial={isTop ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.2) }}
      whileHover={{ y: -6 }}
      className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        <img
          src={tour.image}
          alt={tour.name}
          width="400"
          height="208"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          loading={index < 2 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
        />
        {tour.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[tour.badge] || "bg-primary text-primary-foreground"}`}>
            {tour.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <MapPin className="h-3 w-3" /> {tour.location}
        </p>
        <Link href={`/tours/${tour.slug}`}>
          <h3 className="font-heading font-bold text-lg text-foreground hover:text-primary transition-colors leading-tight">
            {tour.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {tour.rating || 5} ({tour.reviewCount || 0})
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" /> {tour.duration ? tour.duration.split("/")[0].trim() : "Custom"}
          </span>
        </div>
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => openBooking(tour)}
            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            Get Your Best Deal
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
