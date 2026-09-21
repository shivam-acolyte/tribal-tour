"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PAGE_DEFAULTS } from "@/lib/seo";
import { destinations } from "@/lib/data/destinations";

const tabs = ["All", "India", "South East Asia", "International"];

export default function DestinationsClient() {
  const [activeTab, setActiveTab] = useState("All");
  const filtered = activeTab === "All" ? destinations : destinations.filter((d) => d.region === activeTab);

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="relative py-20 bg-navy">
          <div className="container-main px-4 md:px-8 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground mb-3">Explore Our Destinations</h1>
            <p className="text-navy-foreground/60 text-sm">
              <Link href="/" className="hover:text-orange">Home</Link> &gt; Destinations
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main">
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab ? "bg-orange text-orange-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((d, i) => (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow group"
                >
                  <div className="h-60 overflow-hidden">
                    <img src={d.image} alt={d.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{d.flag}</span>
                      <h3 className="font-heading font-bold text-lg">{d.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{d.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{d.tourCount} Tours Available</span>
                      <Link href="/tours" className="text-sm font-medium text-orange hover:underline">Explore Tours →</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
