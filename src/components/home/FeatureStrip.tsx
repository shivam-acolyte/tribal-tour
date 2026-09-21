"use client";

import { motion } from "framer-motion";
import { MousePointer, DollarSign, Compass } from "lucide-react";

const features = [
  { icon: MousePointer, title: "One Click Booking", desc: "Book your dream trip instantly" },
  { icon: DollarSign, title: "Costs & Discounts", desc: "Transparent pricing, no hidden fees" },
  { icon: Compass, title: "Local Guidance", desc: "Expert local guides at every stop" },
];

const FeatureStrip = () => (
  <section className="bg-orange py-10">
    <div className="container-main px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 text-orange-foreground"
        >
          <div className="p-3 rounded-xl bg-orange-foreground/15 backdrop-blur-sm">
            <f.icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg">{f.title}</h3>
            <p className="text-sm opacity-80">{f.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FeatureStrip;
