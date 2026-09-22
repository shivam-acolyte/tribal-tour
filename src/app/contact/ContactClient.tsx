"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQSection from "@/components/shared/FAQSection";
import { BRAND } from "@/lib/seo";

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const whatsappMessage =
      `🏷 *New Contact Enquiry*\n\n` +
      `👤 *Name:* ${form.name.trim()}\n` +
      `📞 *Phone:* ${form.phone.trim()}\n` +
      `📧 *Email:* ${form.email.trim()}\n` +
      `📝 *Subject:* ${form.subject.trim() || "General Inquiry"}\n` +
      `💬 *Message:* ${form.message.trim()}`;

    const phone = BRAND.phone.replace(/[^0-9]/g, "");
    // Open WhatsApp immediately upon user click to avoid popup blocker
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`, "_blank");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || "Contact Form Inquiry",
          message: form.message.trim(),
          source: "Contact Us Page",
        }),
        keepalive: true,
      });

      if (!res.ok) {
        throw new Error("Failed to submit lead");
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="relative py-20 bg-navy">
          <div className="container-main px-4 md:px-8 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground mb-3">Contact Us</h1>
            <p className="text-navy-foreground/60 text-sm">
              <Link href="/" className="hover:text-orange">Home</Link> &gt; Contact
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-3xl font-bold mb-6">Get In Touch</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange/10 rounded-lg"><MapPin className="h-5 w-5 text-orange" /></div>
                  <div><p className="font-medium">Address</p><p className="text-sm text-muted-foreground">Arunachal Pradesh, Meghalaya, Assam, Nagaland, Manipur, Mizoram, Sikkim and Tripura</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange/10 rounded-lg"><Phone className="h-5 w-5 text-orange" /></div>
                  <div><p className="font-medium">Phone</p><p className="text-sm text-muted-foreground">{BRAND.phone}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange/10 rounded-lg"><Mail className="h-5 w-5 text-orange" /></div>
                  <div><p className="font-medium">Email</p><p className="text-sm text-muted-foreground">{BRAND.email}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange/10 rounded-lg"><Clock className="h-5 w-5 text-orange" /></div>
                  <div><p className="font-medium">Hours</p><p className="text-sm text-muted-foreground">Mon-Sat 9AM-7PM IST</p></div>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden h-64 bg-muted flex items-center justify-center">
                <p className="text-muted-foreground text-sm">📍 Map — Jaipur, Rajasthan</p>
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 card-shadow space-y-4">
                <input placeholder="Full Name" required className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/50" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Email" type="email" required className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/50" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <input placeholder="Phone" className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/50" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <select required className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/50 text-muted-foreground" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  <option value="">Select Subject</option>
                  <option>General Inquiry</option>
                  <option>Booking Help</option>
                  <option>Custom Tour Request</option>
                  <option>Complaint</option>
                </select>
                <textarea placeholder="Your Message" rows={5} required className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-orange/50 resize-none" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <button type="submit" className="w-full py-3 bg-orange text-orange-foreground font-medium rounded-xl hover:opacity-90 transition-opacity">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        <FAQSection
          title="Contact & Booking FAQ"
          description="Answers to common questions about contacting us and booking tours"
          faqs={[
            { question: "What are your customer service hours?", answer: "We're available Monday-Sunday, 8:00 AM - 8:00 PM IST. For urgent inquiries, reach out on WhatsApp at +919436045075." },
            { question: "How quickly will you respond to my inquiry?", answer: "We aim to respond to all inquiries within 24 hours. During peak seasons, responses may take up to 48 hours." },
            { question: "What's the best way to reach you?", answer: "WhatsApp is fastest: +919436045075. Email: contact@tribaldiscoverytour.com. Phone: +919436045075. Contact form on this page." },
            { question: "Do you offer group discounts?", answer: "Yes! Groups of 8+ get special discounts. Contact us with your group details for a custom quote." },
            { question: "What is your cancellation policy?", answer: "Cancellations made 30+ days before tour: full refund. 15-29 days: 50% refund. Less than 15 days: no refund unless rescheduled." },
            { question: "Do you accept corporate bookings?", answer: "Absolutely! We offer team-building and corporate retreat packages. Contact us for customized corporate tour options." }
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
