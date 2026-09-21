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

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: contact.trim(),
          email: email.trim(),
          destination: destination || tour.name,
          source: "Get Your Best Deal Popup",
        }),
      });
    } catch (err) {
      console.log("Lead save notice:", err);
    }

    // Format WhatsApp message as backup/instant notification
    const message = `🏷 *Best Deal Request*%0A%0A` +
      `📍 *Package / Destination:* ${destination || tour.name}%0A` +
      `👤 *Name:* ${name.trim()}%0A` +
      `📞 *Contact:* ${contact.trim()}%0A` +
      `📧 *Email:* ${email.trim()}`;

    const phone = BRAND.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="bg-navy text-navy-foreground p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-1 rounded-full bg-navy-foreground/10 hover:bg-navy-foreground/20 text-navy-foreground transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="inline-block px-3 py-1 rounded-full bg-orange/20 text-orange text-xs font-semibold mb-2">
                🔥 Exclusive Offer
              </span>
              <h3 className="font-heading text-2xl font-bold text-background mb-1">
                Get Your Best Deal
              </h3>
              <p className="text-xs text-navy-foreground/70">
                Submit your details below and our travel experts will send you an exclusive discounted deal!
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-3 animate-bounce" />
                  <h4 className="font-heading text-xl font-bold mb-2">Enquiry Sent Successfully!</h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    Thank you, <span className="font-semibold text-foreground">{name}</span>! We have received your request for <span className="font-semibold text-primary">{destination}</span> and will contact you shortly with the best deal.
                  </p>
                  <button
                    onClick={handleClose}
                    className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive font-medium">
                      {error}
                    </div>
                  )}

                  {/* Destination (Auto-filled from tour) */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Destination / Package
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-muted/50 border border-border rounded-xl text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Destination name"
                        required
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Contact *
                    </label>
                    <input
                      type="tel"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20 mt-2"
                  >
                    <Send className="h-4 w-4" />
                    {submitting ? "Sending Request..." : "Get Your Best Deal"}
                  </button>

                  <p className="text-[11px] text-center text-muted-foreground mt-2">
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
