"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone } from "lucide-react";

const CTABanner = () => (
  <section className="relative overflow-hidden bg-orange py-16 md:py-20">
    <span className="absolute right-10 top-1/2 -translate-y-1/2 text-[200px] opacity-10 leading-none select-none">✈</span>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative container-main px-4 md:px-8 text-center"
    >
      <h2 className="font-heading text-3xl md:text-5xl font-bold text-orange-foreground mb-4">
        Ready for Your Next Adventure?
      </h2>
      <p className="text-orange-foreground/80 mb-8 max-w-lg mx-auto">
        Let us plan your perfect trip. Browse our packages or talk to a travel expert today.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/tours"
          className="px-8 py-3 bg-background text-orange font-medium rounded-xl hover:shadow-lg transition-shadow"
        >
          Explore All Packages
        </Link>
        <a
          href="tel:+919928559575"
          className="flex items-center gap-2 px-8 py-3 border-2 border-orange-foreground text-orange-foreground font-medium rounded-xl hover:bg-orange-foreground/10 transition-colors"
        >
          <Phone className="h-4 w-4" /> Call Us Now
        </a>
      </div>
    </motion.div>
  </section>
);

export default CTABanner;
