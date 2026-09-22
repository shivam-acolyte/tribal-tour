"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Send, CheckCircle2 } from "lucide-react";
import { BRAND } from "@/lib/seo";

const WelcomePopup = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("North East India Special Tour");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      sessionStorage.removeItem("welcome_dismissed");
    } catch {}

    if (pathname?.startsWith("/admin")) {
      setShow(false);
      return;
    }

    // Auto-detect destination if on a tour detail page
    if (pathname?.startsWith("/tours/") && pathname.split("/").length > 2) {
      const slug = pathname.split("/")[2];
      const formatted = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      setDestination(formatted);
    } else {
      setDestination("North East India Special Tour");
    }

    setShow(false);
    const timer = setTimeout(() => {
      setShow(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  const close = () => {
    setShow(false);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setContact("");
      setEmail("");
      setError("");
    }, 300);
  };

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

    // Format WhatsApp message with all typed lead fields
    const message =
      `🏷 *Special Offer Tour Enquiry (20% OFF)*\n\n` +
      `📍 *Package / Destination:* ${destination.trim()}\n` +
      `👤 *Name:* ${name.trim()}\n` +
      `📞 *Contact / Phone:* ${contact.trim()}\n` +
      `📧 *Email:* ${email.trim()}`;

    const phone = BRAND.phone.replace(/[^0-9]/g, "");
    // Open WhatsApp immediately upon user click to avoid browser popup blockers
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: contact.trim(),
          email: email.trim(),
          destination: destination.trim(),
          source: "Special Offer Welcome Popup",
          subject: `Special Offer Tour Enquiry (20% OFF): ${destination.trim()}`,
          message: `Package / Destination: ${destination.trim()}\nName: ${name.trim()}\nContact: ${contact.trim()}\nEmail: ${email.trim()}`,
        }),
        keepalive: true,
      });
    } catch (err) {
      console.error("Lead save error:", err);
    }

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
          onClick={close}
        >
          <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[395px] bg-card text-card-foreground rounded-2xl shadow-2xl overflow-hidden border border-border/80"
          >
            {/* Top Banner Image with Overlay */}
            <div className="relative h-32 sm:h-36 shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=600&q=80"
                alt="Tribal Discovery Tour"
                width="440"
                height="144"
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

              {/* Close Button */}
              <button
                onClick={close}
                aria-label="Close popup"
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/60 transition-all"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Banner Text */}
              <div className="absolute bottom-3 left-4 right-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider mb-1 shadow-sm">
                  ✨ Special Offer · Flat 20% OFF
                </span>
                <h3 className="font-heading text-xl font-bold text-white leading-tight">
                  Get Your Best Deal
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-1">
                  Exclusive discounted pricing on authentic tribal packages
                </p>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-5">
              {submitted ? (
                <div className="text-center py-6 px-2">
                  <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-2 animate-bounce" />
                  <h4 className="font-heading text-lg font-bold">Enquiry Sent Successfully!</h4>
                  <p className="text-xs text-muted-foreground mt-1 mb-5">
                    Thank you, <span className="font-semibold text-foreground">{name}</span>! We have received your request for{" "}
                    <span className="font-semibold text-primary">{destination}</span> and will send you the exclusive discounted deal shortly.
                  </p>
                  <button
                    onClick={close}
                    className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
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

                  {/* Destination / Package */}
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Destination / Package
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary" />
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-muted/40 border border-border/80 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        placeholder="e.g. North East India Expedition"
                        required
                      />
                    </div>
                  </div>

                  {/* 2-Column: Name & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3 py-2 bg-background border border-border/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                        Contact *
                      </label>
                      <input
                        type="tel"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Phone number"
                        className="w-full px-3 py-2 bg-background border border-border/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-3 py-2 bg-background border border-border/80 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 text-sm mt-1 disabled:opacity-60"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {submitting ? "Sending Request..." : "Get Your Best Deal"}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 px-1">
                    <span>🔒 No spam guaranteed</span>
                    <button
                      type="button"
                      onClick={close}
                      className="hover:text-foreground transition-colors underline underline-offset-2"
                    >
                      No thanks, I'll browse
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;

