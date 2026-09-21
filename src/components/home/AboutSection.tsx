"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const checklist = [
  "Certified & Experienced Local Guides",
  "24/7 Customer Support During Travel",
  "100% Money-Back Guarantee",
  "Eco-Friendly & Responsible Tourism",
];

const AboutSection = () => (
  <section className="bg-navy py-10 md:py-14 px-4 md:px-8">
    <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left: Images */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative"
      >
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&q=75"
          alt="Travel adventure"
          width="500"
          height="320"
          loading="lazy"
          decoding="async"
          className="w-[70%] h-80 object-cover rounded-2xl"
        />
        <img
          src="https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=350&q=75"
          alt="Travel experience"
          width="350"
          height="208"
          loading="lazy"
          decoding="async"
          className="absolute bottom-0 right-0 w-[55%] h-52 object-cover rounded-xl border-4 border-navy shadow-xl"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange text-orange-foreground px-6 py-3 rounded-xl font-heading font-bold text-center shadow-lg">
          <span className="text-2xl">10+</span>
          <br />
          <span className="text-xs">Years of Travel</span>
        </div>
      </motion.div>

      {/* Right: Text */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-orange/20 text-orange text-sm font-medium mb-4">About Us</span>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy-foreground mb-4">
          Authentic Tribal Journeys Across India.
        </h2>
        <p className="text-navy-foreground/70 mb-3">
          Tribal Discovery Tour curates immersive tribal travel experiences in Rajasthan, Odisha, Gujarat and Northeast India, connecting you with local communities and heritage.
        </p>
        <p className="text-navy-foreground/70 mb-6">
          Our expert guides and responsible itineraries are designed for travelers who want to explore culture, tradition and nature with respect.
        </p>
        <div className="space-y-3 mb-8">
          {checklist.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-success/20 text-success">
                <Check className="h-4 w-4" />
              </span>
              <span className="text-navy-foreground/80 text-sm">{item}</span>
            </div>
          ))}
        </div>
        <button className="px-6 py-3 bg-orange text-orange-foreground font-medium rounded-xl hover:opacity-90 transition-opacity">
          Explore Our Story →
        </button>
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
