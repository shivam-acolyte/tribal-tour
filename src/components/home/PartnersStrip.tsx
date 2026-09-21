"use client";

import { motion } from "framer-motion";

const partners = ["MakeMyTrip", "Yatra", "Booking.com", "TripAdvisor", "Airbnb", "Goibibo"];

const PartnersStrip = () => (
  <section className="py-12">
    <div className="container-main px-4 md:px-8 text-center">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8">Trusted by leading brands</p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {partners.map((p, i) => (
          <motion.span
            key={p}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-lg font-heading font-bold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
          >
            {p}
          </motion.span>
        ))}
      </div>
    </div>
  </section>
);

export default PartnersStrip;
