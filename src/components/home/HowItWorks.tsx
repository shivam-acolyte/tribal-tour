"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { Map, CreditCard, Plane } from "lucide-react";

const steps = [
  { icon: Map, title: "Select Your Destination", desc: "Browse our curated collection of destinations worldwide" },
  { icon: CreditCard, title: "Pay Securely", desc: "Safe, encrypted payments with multiple options" },
  { icon: Plane, title: "Start Your Trip", desc: "Pack your bags and enjoy your adventure!" },
];

const HowItWorks = () => (
  <section className="py-10 md:py-14 px-4 md:px-8">
    <div className="container-main">
      <SectionHeader tag="⚡ Simple Process" title="How It Works" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ y: -6 }}
            className="bg-card rounded-2xl p-8 text-center card-shadow transition-shadow hover:card-shadow-hover"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange/10 text-orange mb-4">
              <s.icon className="h-7 w-7" />
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
