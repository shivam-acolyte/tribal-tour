"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MapPin, CheckCircle2 } from "lucide-react";
import { Tour } from "@/lib/types";
import { BRAND } from "@/lib/seo";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  tour: Tour | null;
}

export const Popup = ({ isOpen, onClose, tour }: PopupProps) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tour) {
      setDestination(tour.name ? `${tour.name} (${tour.location})` : tour.location || "");
    }
  }, [tour]);

  if (!isOpen || !tour) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!contact.trim() || contact.length < 10) {
      setError("Please enter a valid contact number.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const dest = (destination || tour?.name || "Tribal Discovery Tour").trim();

    // Format WhatsApp message with all typed lead fields
    const message =
      `🏷 *Tour Booking Enquiry*\n\n` +
      `📍 *Package / Destination:* ${dest}\n` +
      `👤 *Name:* ${name.trim()}\n` +
      `📞 *Contact / Phone:* ${contact.trim()}\n` +
      `📧 *Email:* ${email.trim()}`;

    const phone = BRAND.phone.replace(/[^0-9]/g, "");
    // Open WhatsApp immediately upon user click to prevent browser popup blockers
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: contact.trim(),
          email: email.trim(),
          destination: dest,
          source: "Booking Form Popup",
          subject: `Tour Booking Enquiry: ${dest}`,
          message: `Package / Destination: ${dest}\nName: ${name.trim()}\nContact: ${contact.trim()}\nEmail: ${email.trim()}`,
        }),
        keepalive: true,
      });
    } catch (err) {
      console.log("Lead save notice:", err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setContact("");
      setEmail("");
      setError("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[395px] bg-background rounded-2xl shadow-2xl overflow-hidden border border-border/80"
          >
            {/* Header */}
            <div className="bg-navy text-navy-foreground p-4 sm:p-5 relative border-b border-white/10">
              <button
                onClick={handleClose}
                className="absolute top-3.5 right-3.5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-navy-foreground transition-all"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange/20 text-orange text-[10px] font-bold uppercase tracking-wider mb-1.5 border border-orange/20">
                🔥 Exclusive Offer
              </span>
              <h3 className="font-heading text-xl font-bold text-background leading-tight">
                Get Your Best Deal
              </h3>
              <p className="text-[11px] text-navy-foreground/75 leading-relaxed mt-0.5">
                Submit your details below and our travel experts will send you an exclusive discounted deal!
              </p>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5">
              {submitted ? (
                <div className="text-center py-6 px-2">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2 animate-bounce" />
                  <h4 className="font-heading text-lg font-bold mb-1">Enquiry Sent Successfully!</h4>
                  <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                    Thank you, <span className="font-semibold text-foreground">{name}</span>! We have received your request for <span className="font-semibold text-primary">{destination}</span> and will contact you shortly with the best deal.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-xs sm:text-sm"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {error && (
                    <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive font-medium">
                      {error}
                    </div>
                  )}

                  {/* Destination (Auto-filled from tour) */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Destination / Package
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary" />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-muted/40 border border-border/80 rounded-xl text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="Destination name"
                        required
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2 bg-background border border-border/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Contact *
                    </label>
                    <input
                      type="tel"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2 bg-background border border-border/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2 bg-background border border-border/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 mt-1 text-xs sm:text-sm disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {submitting ? "Sending Request..." : "Get Your Best Deal"}
                  </button>

                  <p className="text-[10px] text-center text-muted-foreground/70 pt-0.5">
                    🔒 We respect your privacy. No spam guaranteed.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup;
