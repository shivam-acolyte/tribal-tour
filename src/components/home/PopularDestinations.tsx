"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

const destinations = [
  { name: "Goa", tours: 6, image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=75" },
  { name: "Thailand", tours: 15, image: "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=400&q=75" },
  { name: "Kashmir", tours: 7, image: "https://images.unsplash.com/photo-1614056965546-42fbe24eb36c?auto=format&fit=crop&w=400&q=75" },
  { name: "Singapore", tours: 8, image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=75" },
  { name: "Bali", tours: 12, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=75" },
  { name: "Nepal", tours: 10, image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=400&q=75" },
];

const PopularDestinations = () => (
  <section className="pt-8 md:pt-10 pb-10 md:pb-14 px-4 md:px-8 bg-light-gray">
    <div className="container-main">
      <SectionHeader tag="🌍 Explore" title="Popular Destinations" />
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {destinations.map((d, i) => (
          <motion.div
            key={d.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative min-w-[200px] h-[280px] rounded-2xl overflow-hidden group cursor-pointer flex-shrink-0"
          >
            <img
              src={d.image}
              alt={d.name}
              width="200"
              height="280"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <h3 className="font-heading font-bold text-lg text-background">{d.name}</h3>
              <p className="text-sm text-background/70">{d.tours} Tours</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PopularDestinations;
