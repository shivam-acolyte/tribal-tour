"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Plus, Minus } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.webp";
import { BRAND } from "@/lib/seo";
import { toast } from "sonner";

const quickLinks = ["Home", "About", "Tours", "Destinations", "Blog", "Contact"];
const destinationLinks = ["North East India", "Meghalaya", "Assam", "Nagaland", "Arunachal Pradesh", "Manipur", "Mizoram"];
const tourTypeLinks = ["Cultural Tours", "Adventure", "Trekking", "Wildlife", "Tribal Tours", "Group Tours"];

const accordionSections = [
  {
    id: "quick-links",
    title: "Quick Links",
    links: quickLinks.map((link) => ({
      label: link,
      href: link === "Home" ? "/" : `/${link.toLowerCase()}`,
    })),
  },
  {
    id: "destinations",
    title: "Destinations",
    links: destinationLinks.map((d) => ({
      label: d,
      href: "/destinations",
    })),
  },
  {
    id: "tour-types",
    title: "Tour Types",
    links: tourTypeLinks.map((t) => ({
      label: t,
      href: "/tours",
    })),
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubscribing(true);

    const whatsappMessage =
      `🏷 *Newsletter Subscription*\n\n` +
      `📧 *Email:* ${email.trim()}\n` +
      `💬 *Message:* Hi, I would like to subscribe to newsletter updates and travel deals!`;

    const phone = BRAND.phone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email: email.trim(),
          phone: "",
          subject: "Newsletter Subscription",
          message: `Newsletter subscriber: ${email.trim()}`,
          source: "Footer Newsletter",
        }),
        keepalive: true,
      });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (err) {
      console.error("Newsletter lead save notice:", err);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="container-main py-10 md:py-14 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Brand - Desktop 4 cols, Mobile bottom (order-3) */}
          <div className="order-3 md:order-1 md:col-span-2 lg:col-span-4 pt-2 md:pt-0">
            <Link href="/" className="inline-block mb-3.5">
              <Image src={logo} alt="Tribal Discovery" width={160} height={48} className="h-12 w-auto brightness-200" loading="lazy" />
            </Link>
            <p className="text-sm opacity-80 mb-5 leading-relaxed max-w-sm">
              Your guide to the North East of India. Discover tribal cultures, pristine landscapes, and unforgettable adventures.
            </p>
            <div className="space-y-3 text-sm opacity-80">
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" /> 
                <span>
                  <a href="tel:9436045075" className="hover:text-primary transition-colors">9436045075</a> / <a href="tel:8135955584" className="hover:text-primary transition-colors">8135955584</a>
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" /> 
                <a href="mailto:tribaldiscovery@yahoo.co.in" className="hover:text-primary transition-colors">tribaldiscovery@yahoo.co.in</a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" /> 
                <a href="mailto:davidsangtam2015@gmail.com" className="hover:text-primary transition-colors">davidsangtam2015@gmail.com</a>
              </p>
              <p className="flex items-start gap-2.5 pt-0.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                <span>Arunachal Pradesh, Meghalaya, Assam, Nagaland, Manipur, Mizoram, Sikkim &amp; Tripura</span>
              </p>
            </div>
          </div>

          {/* Mobile Accordion - Positioned at top on mobile (order-1) */}
          <div className="order-1 block md:hidden border-t border-navy-foreground/15">
            {accordionSections.map((section) => {
              const isOpen = openAccordion === section.id;
              return (
                <div key={section.id} className="border-b border-navy-foreground/15">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(section.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between py-3.5 text-left font-body font-semibold text-[17px] text-navy-foreground hover:text-primary transition-colors focus:outline-none"
                  >
                    <span>{section.title}</span>
                    <span className="shrink-0 ml-3 text-navy-foreground/85">
                      {isOpen ? (
                        <Minus className="h-5 w-5 text-primary" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2 text-sm opacity-80 pb-4 pt-1 pl-1">
                          {section.links.map((link) => (
                            <li key={link.label}>
                              <Link
                                href={link.href}
                                className="hover:opacity-100 hover:text-primary transition-all block py-1"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Quick Links - Desktop */}
          <div className="hidden md:block md:order-2 lg:col-span-2">
            <h4 className="font-heading font-bold text-base mb-4 text-navy-foreground tracking-wide">Quick Links</h4>
            <ul className="space-y-2.5 text-sm opacity-75">
              {quickLinks.map((link) => {
                const target = link === "Home" ? "/" : `/${link.toLowerCase()}`;
                return (
                  <li key={link}>
                    <Link href={target} className="hover:opacity-100 hover:text-primary transition-all block">
                      {link}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Destinations - Desktop */}
          <div className="hidden md:block md:order-3 lg:col-span-2">
            <h4 className="font-heading font-bold text-base mb-4 text-navy-foreground tracking-wide">Destinations</h4>
            <ul className="space-y-2.5 text-sm opacity-75">
              {destinationLinks.map((d) => (
                <li key={d}>
                  <Link href="/destinations" className="hover:opacity-100 hover:text-primary transition-all block">
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tour Types - Desktop */}
          <div className="hidden md:block md:order-4 lg:col-span-2">
            <h4 className="font-heading font-bold text-base mb-4 text-navy-foreground tracking-wide">Tour Types</h4>
            <ul className="space-y-2.5 text-sm opacity-75">
              {tourTypeLinks.map((t) => (
                <li key={t}>
                  <Link href="/tours" className="hover:opacity-100 hover:text-primary transition-all block">
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter - Mobile order-2 (below accordions, above brand logo), Desktop order-5 (right) */}
          <div className="order-2 md:order-5 md:col-span-1 lg:col-span-2 min-w-0 pt-6 pb-6 border-b border-navy-foreground/15 md:border-b-0 md:pt-0 md:pb-0">
            <h4 className="font-heading font-bold text-base mb-4 text-navy-foreground tracking-wide">Newsletter</h4>
            <p className="text-sm opacity-75 mb-3 leading-relaxed">Subscribe for travel deals &amp; tips</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Your email address for newsletter"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-foreground/10 border border-navy-foreground/20 text-sm text-navy-foreground placeholder:text-navy-foreground/40 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={subscribing}
                aria-label="Subscribe to newsletter"
                className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <p className="text-xs opacity-50 mt-2.5">We respect your privacy.</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-foreground/10">
        <div className="container-main px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-75">
          <p>© 2026 Tribal Discovery. All rights reserved.</p>
          <p>
            Designed &amp; Developed by{" "}
            <a href="https://startupflora.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              StartupFlora
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
