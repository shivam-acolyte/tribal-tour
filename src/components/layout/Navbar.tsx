"use client";

import { useState, useEffect, forwardRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.webp";

const indiaDestinations = [
  "North East", "Himachal", "Kerala", "Uttarakhand",
  "Gujarat", "Jammu & Kashmir", "Odisha", "Andaman And Nicobar Island",
];
const seAsiaDestinations = [
  { name: "Thailand", flag: "🇹🇭" }, { name: "Singapore", flag: "🇸🇬" },
  { name: "Sri Lanka", flag: "🇱🇰" }, { name: "Nepal", flag: "🇳🇵" },
];
const internationalDestinations = [
  { name: "Vietnam", flag: "🇻🇳" }, { name: "Indonesia", flag: "🇮🇩" },
  { name: "Malaysia", flag: "🇲🇾" },
];
const tourTypes = ["City Tours", "Adventure Tours", "Cultural Tours", "Wildlife Safari", "Honeymoon Packages", "Group Tours"];
const activityTypes = ["Trekking", "Water Sports", "Camping", "Paragliding", "Scuba Diving", "Rock Climbing"];

const Navbar = forwardRef<HTMLElement>((_, ref) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  return (
    <nav ref={ref}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-background"
      }`}
    >
      <div className="container-main flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Tribal Discovery" width={140} height={48} className="h-12 w-auto" priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Destinations Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("destinations")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              Destinations <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {activeDropdown === "destinations" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[680px] bg-background rounded-2xl shadow-2xl border p-6 grid grid-cols-3 gap-6"
                >
                  <div>
                    <h4 className="font-heading font-bold text-sm mb-3 pb-2 border-b-2 border-primary">🇮🇳 India</h4>
                    <div className="space-y-0.5">
                      {indiaDestinations.map((d) => (
                        <Link key={d} href="/destinations" className="block text-sm py-1.5 px-2 text-muted-foreground hover:text-primary hover:pl-3.5 transition-all duration-200 border-b border-border/50 last:border-0">
                          {d}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-l pl-6">
                    <h4 className="font-heading font-bold text-sm mb-3 pb-2 border-b-2 border-primary">South East Asia 🌏</h4>
                    <div className="space-y-0.5">
                      {seAsiaDestinations.map((d) => (
                        <Link key={d.name} href="/destinations" className="block text-sm py-1.5 px-2 text-muted-foreground hover:text-primary hover:pl-3.5 transition-all duration-200 border-b border-border/50 last:border-0">
                          {d.flag} {d.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-l pl-6">
                    <h4 className="font-heading font-bold text-sm mb-3 pb-2 border-b-2 border-primary">International ✈️</h4>
                    <div className="space-y-0.5">
                      {internationalDestinations.map((d) => (
                        <Link key={d.name} href="/destinations" className="block text-sm py-1.5 px-2 text-muted-foreground hover:text-primary hover:pl-3.5 transition-all duration-200 border-b border-border/50 last:border-0">
                          {d.flag} {d.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tours Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("tours")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link href="/tours" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              Tours <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <AnimatePresence>
              {activeDropdown === "tours" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-1 w-52 bg-background rounded-xl shadow-xl border py-2"
                >
                  {tourTypes.map((t) => (
                    <Link key={t} href="/tours" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors">
                      {t}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Activities Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("activities")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link href="/activities" className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              Activities <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <AnimatePresence>
              {activeDropdown === "activities" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-full mt-1 w-48 bg-background rounded-xl shadow-xl border py-2"
                >
                  {activityTypes.map((a) => (
                    <Link key={a} href="/activities" className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors">
                      {a}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link href="/packages" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">Packages</Link>
          <Link href="/blog" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">Blog</Link>
          <Link href="/gallery" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">Our Clients</Link>
          <Link href="/contact" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">Contact</Link>
        </div>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:+919436045075" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" /> +91 94360 45075
          </a>
          <Link href="/tours" className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Book Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          aria-label="Toggle mobile navigation menu"
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 top-16 bg-background z-40 p-6 overflow-y-auto lg:hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="space-y-4 mt-2">
              <Link href="/destinations" className="block text-lg font-heading font-semibold py-2 border-b">Destinations</Link>
              <Link href="/tours" className="block text-lg font-heading font-semibold py-2 border-b">Tours</Link>
              <Link href="/activities" className="block text-lg font-heading font-semibold py-2 border-b">Activities</Link>
              <Link href="/packages" className="block text-lg font-heading font-semibold py-2 border-b">Packages</Link>
              <Link href="/blog" className="block text-lg font-heading font-semibold py-2 border-b">Blog</Link>
              <Link href="/contact" className="block text-lg font-heading font-semibold py-2 border-b">Contact</Link>
              <Link href="/about" className="block text-lg font-heading font-semibold py-2 border-b">About Us</Link>
              <div className="pt-4 space-y-3">
                <a href="tel:+919436045075" className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> +91 94360 45075
                </a>
                <Link href="/tours" className="block w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium text-center">Book Now</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
