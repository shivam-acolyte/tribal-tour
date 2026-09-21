"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import type { StaticImageData } from "next/image";

// Static image imports — Next.js handles these as StaticImageData
import p1 from "@/assets/gallery/p1.webp";
import p2 from "@/assets/gallery/p2.webp";
import p3 from "@/assets/gallery/p3.webp";
import p4 from "@/assets/gallery/p4.webp";
import p5 from "@/assets/gallery/p5.webp";
import p6 from "@/assets/gallery/p6.webp";
import p7 from "@/assets/gallery/p7.webp";
import p8 from "@/assets/gallery/p8.webp";
import p9 from "@/assets/gallery/p9.webp";
import p10 from "@/assets/gallery/p10.webp";
import p11 from "@/assets/gallery/p11.webp";
import p12 from "@/assets/gallery/p12.webp";
import p13 from "@/assets/gallery/p13.webp";
import p14 from "@/assets/gallery/p14.webp";
import p15 from "@/assets/gallery/p15.webp";
import p16 from "@/assets/gallery/p16.webp";
import p17 from "@/assets/gallery/p17.webp";
import p18 from "@/assets/gallery/p18.webp";
import p19 from "@/assets/gallery/p19.webp";
import p20 from "@/assets/gallery/p20.webp";
import p21 from "@/assets/gallery/p21.webp";
import p22 from "@/assets/gallery/p22.webp";
import p23 from "@/assets/gallery/p23.webp";
import p24 from "@/assets/gallery/p24.webp";
import p25 from "@/assets/gallery/p25.webp";
import p26 from "@/assets/gallery/p26.webp";
import p27 from "@/assets/gallery/p27.webp";
import p28 from "@/assets/gallery/p28.webp";
import p29 from "@/assets/gallery/p29.webp";
import p30 from "@/assets/gallery/p30.webp";
import p31 from "@/assets/gallery/p31.webp";
import p32 from "@/assets/gallery/p32.webp";
import p33 from "@/assets/gallery/p33.webp";
import p34 from "@/assets/gallery/p34.webp";
import p35 from "@/assets/gallery/p35.webp";
import p36 from "@/assets/gallery/p36.webp";
import p37 from "@/assets/gallery/p37.webp";
import p38 from "@/assets/gallery/p38.webp";
import p39 from "@/assets/gallery/p39.webp";
import p40 from "@/assets/gallery/p40.webp";
import p41 from "@/assets/gallery/p41.webp";
import p42 from "@/assets/gallery/p42.webp";
import p43 from "@/assets/gallery/p43.webp";
import p44 from "@/assets/gallery/p44.webp";
import p45 from "@/assets/gallery/p45.webp";
import p47 from "@/assets/gallery/p47.webp";
import p48 from "@/assets/gallery/p48.webp";
import p49 from "@/assets/gallery/p49.webp";

const galleryImages: { src: StaticImageData; title: string }[] = [
  { src: p1, title: "Tribal Discovery" },
  { src: p2, title: "Tribal Discovery" },
  { src: p3, title: "Tribal Discovery" },
  { src: p4, title: "Tribal Discovery" },
  { src: p5, title: "Tribal Discovery" },
  { src: p6, title: "Tribal Discovery" },
  { src: p7, title: "Tribal Discovery" },
  { src: p8, title: "Tribal Discovery" },
  { src: p9, title: "Tribal Discovery" },
  { src: p10, title: "Tribal Discovery" },
  { src: p11, title: "Tribal Discovery" },
  { src: p12, title: "Tribal Discovery" },
  { src: p13, title: "Tribal Discovery" },
  { src: p14, title: "Tribal Discovery" },
  { src: p15, title: "Tribal Discovery" },
  { src: p16, title: "Tribal Discovery" },
  { src: p17, title: "Tribal Discovery" },
  { src: p18, title: "Tribal Discovery" },
  { src: p19, title: "Tribal Discovery" },
  { src: p20, title: "Tribal Discovery" },
  { src: p21, title: "Tribal Discovery" },
  { src: p22, title: "Tribal Discovery" },
  { src: p23, title: "Tribal Discovery" },
  { src: p24, title: "Tribal Discovery" },
  { src: p25, title: "Tribal Discovery" },
  { src: p26, title: "Tribal Discovery" },
  { src: p27, title: "Tribal Discovery" },
  { src: p28, title: "Tribal Discovery" },
  { src: p29, title: "Tribal Discovery" },
  { src: p30, title: "Tribal Discovery" },
  { src: p31, title: "Tribal Discovery" },
  { src: p32, title: "Tribal Discovery" },
  { src: p33, title: "Tribal Discovery" },
  { src: p34, title: "Tribal Discovery" },
  { src: p35, title: "Tribal Discovery" },
  { src: p36, title: "Tribal Discovery" },
  { src: p37, title: "Tribal Discovery" },
  { src: p38, title: "Tribal Discovery" },
  { src: p39, title: "Tribal Discovery" },
  { src: p40, title: "Tribal Discovery" },
  { src: p41, title: "Tribal Discovery" },
  { src: p42, title: "Tribal Discovery" },
  { src: p43, title: "Tribal Discovery" },
  { src: p44, title: "Tribal Discovery" },
  { src: p45, title: "Tribal Discovery" },
  { src: p47, title: "Tribal Discovery" },
  { src: p48, title: "Tribal Discovery" },
  { src: p49, title: "Tribal Discovery" },
];

export default function GalleryClient() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const prev = () =>
    setSelectedIndex((i) => (i === null ? 0 : i === 0 ? galleryImages.length - 1 : i - 1));
  const next = () =>
    setSelectedIndex((i) => (i === null ? 0 : i === galleryImages.length - 1 ? 0 : i + 1));

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />

      <main>
        <section className="relative py-20 bg-navy">
          <div className="container-main px-4 md:px-8 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground mb-3">Gallery</h1>
            <p className="text-navy-foreground/60 text-xl">Explore Our Travel Moments</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                onClick={() => setSelectedIndex(i)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
              >
                <Image
                  src={img.src}
                  alt={img.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                  width={400}
                  height={256}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <p className="text-white font-semibold">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Fullscreen Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button onClick={() => setSelectedIndex(null)} className="absolute top-6 right-6 text-white hover:text-orange transition-colors">
            <X size={32} />
          </button>
          <button onClick={prev} className="absolute left-6 text-white hover:text-orange transition-colors">
            <ChevronLeft size={40} />
          </button>
          <div className="relative max-h-[80vh] max-w-[90vw]">
            <Image
              src={galleryImages[selectedIndex].src}
              alt={galleryImages[selectedIndex].title}
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg"
              width={1200}
              height={800}
              priority
            />
          </div>
          <button onClick={next} className="absolute right-6 text-white hover:text-orange transition-colors">
            <ChevronRight size={40} />
          </button>
          <p className="absolute bottom-6 text-white/70 text-sm">
            {selectedIndex + 1} / {galleryImages.length}
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
}
