"use client";

import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import logo from "@/assets/logo.webp";

const quickLinks = ["Home", "About", "Tours", "Destinations", "Blog", "Contact"];
const destinationLinks = ["North East India", "Meghalaya", "Assam", "Nagaland", "Arunachal Pradesh", "Manipur", "Mizoram"];
const tourTypeLinks = ["Cultural Tours", "Adventure", "Trekking", "Wildlife", "Tribal Tours", "Group Tours"];

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="container-main py-10 md:py-14 px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Brand - 4 cols */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-4">
              <Image src={logo} alt="Tribal Discovery" width={160} height={48} className="h-12 w-auto brightness-200" loading="lazy" />
            </Link>
            <p className="text-sm opacity-75 mb-5 leading-relaxed max-w-sm">
              Your guide to the North East of India. Discover tribal cultures, pristine landscapes, and unforgettable adventures.
            </p>
            <div className="space-y-2.5 text-sm opacity-75">
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" /> 
                <span>9436045075 / 8135955584</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" /> 
                <span>tribaldiscovery@yahoo.co.in</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" /> 
                <span>davidsangtam2015@gmail.com</span>
              </p>
              <p className="flex items-start gap-2.5 pt-0.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" /> 
                <span>Arunachal Pradesh, Meghalaya, Assam, Nagaland, Manipur, Mizoram, Sikkim &amp; Tripura</span>
              </p>
            </div>
          </div>

          {/* Quick Links - 2 cols */}
          <div className="lg:col-span-2">
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

          {/* Destinations - 2 cols */}
          <div className="lg:col-span-2">
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

          {/* Tour Types - 2 cols */}
          <div className="lg:col-span-2">
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

          {/* Newsletter - 2 cols */}
          <div className="lg:col-span-2 min-w-0">
            <h4 className="font-heading font-bold text-base mb-4 text-navy-foreground tracking-wide">Newsletter</h4>
            <p className="text-sm opacity-75 mb-3 leading-relaxed">Subscribe for travel deals &amp; tips</p>
            <div className="flex flex-col gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                aria-label="Your email address for newsletter"
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy-foreground/10 border border-navy-foreground/20 text-sm text-navy-foreground placeholder:text-navy-foreground/40 focus:outline-none focus:border-primary"
              />
              <button
                aria-label="Subscribe to newsletter"
                className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </div>
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
