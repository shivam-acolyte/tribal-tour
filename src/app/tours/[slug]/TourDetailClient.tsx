"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Users, Share2, Check, X as XIcon, MessageCircle } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useBooking } from "@/contexts/BookingContext";
import FAQSection from "@/components/shared/FAQSection";
import { Tour } from "@/lib/types";
import { BRAND } from "@/lib/seo";
import { tours as initialTours } from "@/lib/data/tours";

interface Props {
  slug: string;
}

export default function TourDetailClient({ slug }: Props) {
  const { openBooking } = useBooking();
  const localFallback = initialTours.find((t) => t.slug === slug);
  const [tour, setTour] = useState<Tour | null>(localFallback || null);
  const [loading, setLoading] = useState(!localFallback);
  const [mainImage, setMainImage] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [openDay, setOpenDay] = useState<number | null>(0);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`/api/tours/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.slug) setTour(data);
        }
      } catch (error) {
        console.error("Error fetching tour, using local fallback:", error);
        if (!tour && localFallback) setTour(localFallback);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchTour();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-32">
          <h1 className="text-2xl font-bold mb-4 font-heading">Tour not found</h1>
          <Link href="/tours" className="text-primary font-medium hover:underline">Browse other tours</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = ["Overview", "Itinerary", "Inclusions", "Reviews"];
  const taxes = tour.price * 0.05;

  const handleWhatsAppEnquiry = () => {
    const message = `Hi! I'm interested in the *${tour.name}* tour (₹${tour.price.toLocaleString()}/person, ${tour.duration}). Please share more details.`;
    window.open(`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main className="section-padding">
        <div className="container-main">
          {/* Breadcrumb */}
          <p className="text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link> &gt;{" "}
            <Link href="/tours" className="hover:text-primary">Tours</Link> &gt;{" "}
            <span className="text-foreground">{tour.name}</span>
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              {(() => {
                const tourImages = (tour.images && tour.images.length > 0) ? tour.images : (tour.image ? [tour.image] : ["https://images.unsplash.com/photo-1583147610182-5c1d66a742d3?w=800&q=80"]);
                const currentImg = tourImages[mainImage] || tourImages[0];
                return (
                  <div>
                    <div className="relative rounded-2xl overflow-hidden h-[350px] md:h-[450px]">
                      <img src={currentImg} alt={tour.name} className="w-full h-full object-cover" />
                      {tourImages.length > 1 && (
                        <span className="absolute bottom-4 right-4 bg-foreground/60 text-background px-3 py-1 rounded-full text-sm">
                          {mainImage + 1} / {tourImages.length}
                        </span>
                      )}
                    </div>
                    {tourImages.length > 1 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                        {tourImages.map((img, i) => (
                          <button key={i} onClick={() => setMainImage(i)}
                            className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${i === mainImage ? "border-primary" : "border-transparent"}`}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Header */}
              <div>
                {tour.badge && (
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${tour.badge === "Popular" ? "bg-primary text-primary-foreground" : tour.badge === "Best Seller" ? "bg-gold text-gold-foreground" : "bg-success text-success-foreground"}`}>
                    {tour.badge}
                  </span>
                )}
                <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">{tour.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {tour.location}</span>
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" /> {tour.rating} ({tour.reviewCount} reviews)</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {tour.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {tour.groupSize} people</span>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors">
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>

              {/* Tab Bar */}
              <div className="sticky top-16 z-10 bg-background border-b flex gap-0 overflow-x-auto">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.toLowerCase() ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">{tour.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {tour.highlights?.map((h) => (
                      <div key={h.label} className="flex items-center gap-2 p-3 bg-muted rounded-xl">
                        <span className="text-lg">{h.icon}</span>
                        <span className="text-sm font-medium">{h.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "itinerary" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {tour.itinerary?.map((day) => (
                    <div key={day.day} className="bg-card rounded-xl border overflow-hidden">
                      <button onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                        className="w-full flex items-center justify-between p-4 text-left">
                        <span className="font-heading font-semibold">
                          <span className="text-primary mr-2">DAY {String(day.day).padStart(2, "0")}</span>
                          {day.title}
                        </span>
                        <motion.span animate={{ rotate: openDay === day.day ? 180 : 0 }} className="text-muted-foreground">▼</motion.span>
                      </button>
                      {openDay === day.day && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="px-4 pb-4 space-y-3">
                          <p className="text-sm text-muted-foreground">{day.description}</p>
                          <div className="space-y-1">
                            {day.activities?.map((a) => (
                              <p key={a} className="text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{a}</p>
                            ))}
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Meals: {day.meals?.join(" | ")}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">🏨 {day.accommodation}</p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "inclusions" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-3 text-success">✅ Included</h3>
                    <div className="space-y-2">
                      {tour.included?.map((item) => (
                        <p key={item} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-success shrink-0 mt-0.5" />{item}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg mb-3 text-destructive">❌ Excluded</h3>
                    <div className="space-y-2">
                      {tour.excluded?.map((item) => (
                        <p key={item} className="flex items-start gap-2 text-sm"><XIcon className="h-4 w-4 text-destructive shrink-0 mt-0.5" />{item}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="bg-muted rounded-xl p-6 text-center">
                    <div className="text-4xl font-heading font-bold text-primary mb-1">{tour.rating}</div>
                    <div className="flex justify-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-gold text-gold" />)}
                    </div>
                    <p className="text-sm text-muted-foreground">Based on {tour.reviewCount} reviews</p>
                  </div>
                  <div className="space-y-4">
                    {tour.reviews?.map((r) => (
                      <div key={r.name} className="bg-card rounded-xl p-5 border">
                        <div className="flex items-center gap-3 mb-3">
                          <img src={r.photo} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <p className="font-heading font-semibold text-sm">{r.name}</p>
                            <p className="text-xs text-muted-foreground">{r.city} • {r.date}</p>
                          </div>
                          <div className="ml-auto flex gap-0.5">
                            {[...Array(r.rating)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{r.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-card rounded-2xl p-6 card-shadow space-y-4">
                <div>
                  {tour.originalPrice > 0 && tour.originalPrice > tour.price && (
                    <p className="text-sm text-muted-foreground line-through">₹{tour.originalPrice.toLocaleString()}</p>
                  )}
                  <p className="font-heading text-3xl font-bold text-primary">₹{tour.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/person</span></p>
                  <p className="text-xs text-muted-foreground mt-1">+ ₹{taxes.toLocaleString(undefined, { maximumFractionDigits: 0 })} taxes</p>
                </div>
                <button onClick={() => openBooking(tour)} className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md text-base">
                  Get Your Best Deal
                </button>
                <button onClick={handleWhatsAppEnquiry} className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
                </button>
                <div className="space-y-2 pt-4 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Free cancellation up to 7 days</p>
                  <p className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Instant confirmation</p>
                  <p className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> WhatsApp support</p>
                </div>
                <div className="pt-4 border-t text-center">
                  <p className="text-sm text-muted-foreground mb-1">📞 Need help? Call us</p>
                  <a href={`tel:${BRAND.phone}`} className="font-heading font-bold text-primary text-lg">{BRAND.phone}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
