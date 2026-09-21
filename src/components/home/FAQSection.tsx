"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const faqs = [
  { q: "What does our travel package include?", a: "Our packages typically include accommodation, airport transfers, guided tours, entry tickets, and select meals. Each tour page lists exact inclusions and exclusions so you know exactly what you're getting." },
  { q: "Can I customize my travel itinerary?", a: "Absolutely! We offer fully customizable itineraries. Contact our travel experts to tailor destinations, duration, accommodation, and activities to your preferences." },
  { q: "What is your cancellation policy?", a: "We offer free cancellation up to 7 days before the trip start date for a full refund. Cancellations within 7 days may incur a partial fee. Travel insurance is recommended." },
  { q: "Is solo travel safe with Tribal Discovery Tour?", a: "Yes! We have extensive experience organizing solo tribal tours with trusted local guides, emergency support, and carefully vetted accommodations to keep every traveler safe." },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-light-gray">
      <div className="container-main max-w-3xl">
        <SectionHeader tag="❓ FAQs" title="Frequently Asked Questions" />
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-xl overflow-hidden card-shadow">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-heading font-semibold text-foreground pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-5 pb-5 text-sm text-muted-foreground">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
