"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { BRAND } from "@/lib/seo";

const WelcomePopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("welcome_dismissed");
      if (!dismissed) setShow(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setShow(false);
    sessionStorage.setItem("welcome_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={close}
        >
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Top Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=450&q=75"
                alt="North East India"
                width="448"
                height="176"
                decoding="async"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-background">
                <p className="text-sm font-medium opacity-80">Welcome to</p>
                <h3 className="font-heading text-2xl font-bold">Tribal Discovery</h3>
              </div>
              <button
                onClick={close}
                aria-label="Close special offer popup"
                className="absolute top-3 right-3 p-1.5 rounded-full bg-background/20 backdrop-blur-sm text-background hover:bg-background/40 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <h4 className="font-heading text-lg font-bold mb-2">🎉 Special Offer!</h4>
              <p className="text-sm text-muted-foreground mb-1">
                Get <span className="font-bold text-primary">Flat 20% OFF</span> on all North East India packages!
              </p>
              <p className="text-xs text-muted-foreground mb-5">
                Use code: <span className="font-bold text-primary">TRIBAL20</span>
              </p>

              <div className="space-y-3">
                <Link
                  href="/tours"
                  onClick={close}
                  className="block w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  <MapPin className="inline h-4 w-4 mr-1" /> Explore Tours
                </Link>
                <a
                  href={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, "")}?text=Hi! I'm interested in your tour packages.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Phone className="inline h-4 w-4 mr-1" /> Chat on WhatsApp
                </a>
              </div>

              <button onClick={close} className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors">
                No thanks, I'll browse on my own
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
