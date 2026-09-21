"use client";

import { motion } from "framer-motion";

const AwardBanner = () => (
  <section className="relative py-20 overflow-hidden">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
        alt="Travel landscape"
        className="w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-navy" style={{ mixBlendMode: "multiply" }} />
    </div>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative container-main px-4 md:px-8 text-center"
    >
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold/20 border-2 border-gold mb-6">
        <span className="text-2xl">🏆</span>
      </div>
      <p className="text-gold font-medium mb-2">Condé Nast Traveller 2025</p>
      <h2 className="font-heading text-4xl md:text-6xl font-bold text-background mb-4">Best Tour Operator</h2>
      <p className="text-background/70 max-w-xl mx-auto mb-8">
        Recognized for exceptional service, curated experiences, and commitment to responsible tourism across 120+ destinations.
      </p>
      <button className="px-8 py-3 bg-orange text-orange-foreground font-medium rounded-xl hover:opacity-90 transition-opacity">
        View Our Awards
      </button>
    </motion.div>
  </section>
);

export default AwardBanner;
