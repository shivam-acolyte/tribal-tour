"use client";

import { motion } from "framer-motion";
import { Award, Users, Globe, Shield } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatsStrip from "@/components/home/StatsStrip";
import CTABanner from "@/components/home/CTABanner";
import FAQSection from "@/components/shared/FAQSection";

const whyUs = [
  { icon: Shield, title: "Local Expertise", desc: "Deep roots in Northeast India" },
  { icon: Globe, title: "Curated Experiences", desc: "Beyond typical tourist routes" },
  { icon: Users, title: "Personalized Journeys", desc: "Tailored for every traveler" },
  { icon: Award, title: "Authentic Travel", desc: "Culture-first experiences" },
];

export default function AboutClient() {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative py-20 bg-navy">
          <div className="container-main px-4 md:px-8 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground mb-3">
              About Tribal Discovery
            </h1>
            <p className="text-navy-foreground/60 font-accent text-xl">
              Discover Deeper. Travel Meaningfully.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="section-padding">
          <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange/10 text-orange text-sm font-medium mb-4">
                Our Story
              </span>

              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Rooted in Culture. Driven by Discovery.
              </h2>

              <p className="text-muted-foreground mb-4">
                Tribal Discovery Tours is a locally rooted travel company specializing in immersive journeys across Northeast India. Built by passionate explorers with deep on-ground knowledge, we focus on experiences that go beyond destinations—bringing you closer to cultures, traditions, and untouched landscapes.
              </p>

              <p className="text-muted-foreground">
                From tribal encounters and mountain escapes to spiritual retreats and adventure expeditions, every journey is thoughtfully curated to deliver authenticity, comfort, and unforgettable memories.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80"
                alt="Travel adventure"
                className="rounded-2xl w-full h-80 object-cover"
              />
            </motion.div>
          </div>
        </section>

        <StatsStrip />

        {/* Mission & Vision */}
        <section className="section-padding bg-light-gray">
          <div className="container-main grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Our Mission",
                text: "To create meaningful, immersive travel experiences that connect people with authentic cultures, natural beauty, and the untold stories of every destination we serve—while promoting responsible and sustainable tourism.",
              },
              {
                title: "Our Vision",
                text: "To become a globally recognized experiential travel brand, known for transforming journeys into powerful stories of discovery, connection, and cultural understanding.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-8 card-shadow border-l-4 border-orange"
              >
                <h3 className="font-heading text-2xl font-bold mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-padding bg-light-gray">
          <div className="container-main text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-10">
              Why Choose Tribal Discovery
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {whyUs.map((w, i) => (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-xl p-6 card-shadow"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange/10 text-orange mb-3">
                    <w.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-heading font-bold mb-1">{w.title}</h4>
                  <p className="text-sm text-muted-foreground">{w.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <FAQSection
          title="About Tribal Discovery Tour"
          description="Common questions about our company, mission, and operations"
          faqs={[
            {
              question: "What is Tribal Discovery Tour's mission?",
              answer: "Our mission is to create authentic, sustainable tribal tourism experiences that preserve cultural heritage, support local communities, and provide transformative travel experiences for visitors."
            },
            {
              question: "How long has Tribal Discovery Tour been operating?",
              answer: "Founded by tribal tourism enthusiasts, we've been providing authentic tribal tourism experiences for years. Our expertise comes from deep connections with local tribes and communities."
            },
            {
              question: "What regions do you cover?",
              answer: "We specialize in tribal regions across India including Rajasthan (Bhil, Rabari), Odisha (Kondh, Bonda), Northeast India (Naga, Mishing, Bodo), Gujarat (Adivasi), and Chhattisgarh (Gond)."
            },
            {
              question: "Are your tours sustainable and ethical?",
              answer: "Yes, sustainability is at the core of our operations. We ensure fair compensation for local guides, respect cultural customs, limit group sizes, and reinvest profits back into communities."
            },
            {
              question: "Do you employ local guides?",
              answer: "Absolutely. We exclusively hire local guides from tribal communities. This ensures authentic storytelling and ensures tourism revenue benefits the local economy."
            },
            {
              question: "Can I customize a tour itinerary?",
              answer: "Yes, we offer full customization. Contact our team at contact@tribaldiscoverytour.com with your preferences, and we'll design a personalized itinerary."
            }
          ]}
        />

        <CTABanner />
      </main>

      <Footer />
    </div>
  );
}
