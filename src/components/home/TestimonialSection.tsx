"use client";

import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";

const testimonials = [
  {
    name: "Priya Sharma",
    city: "Mumbai, India",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80",
    rating: 5,
    text: "My Meghalaya trip with Tribal Discovery was absolutely magical! From the stunning living root bridges to the crystal-clear rivers, every moment was perfectly planned. The guides were knowledgeable and the homestays were authentic. Can't wait for my next trip!",
  },
  {
    name: "Rahul Verma",
    city: "Delhi, India",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    text: "The Nagaland Hornbill Festival tour was a once-in-a-lifetime experience! Tribal Discovery arranged everything perfectly. The tribal dances, local cuisine, and warm hospitality of the Naga people made this trip truly unforgettable.",
  },
  {
    name: "Anita Desai",
    city: "Bangalore, India",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    text: "Explored Assam's tea gardens and Kaziranga National Park with Tribal Discovery. Saw one-horned rhinos up close! The team was professional, responsive, and went above and beyond. Highly recommend for anyone wanting to explore NE India.",
  },
  {
    name: "Vikash Kumar",
    city: "Kolkata, India",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
    rating: 4,
    text: "Arunachal Pradesh trip was breathtaking. The Tawang monastery visit and Sela Pass crossing were highlights. Tribal Discovery's local expertise made all the difference. Everything from transport to food was well taken care of.",
  },
  {
    name: "Sneha Patel",
    city: "Ahmedabad, India",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    rating: 5,
    text: "The Manipur and Mizoram combo tour was amazing! Getting to experience Sangai Festival and meeting local artisans was incredible. Tribal Discovery truly knows the hidden gems of North East India. Already planning my next trip!",
  },
];

const TestimonialSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  const visibleTestimonials = () => {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(testimonials[(current + i) % testimonials.length]);
    }
    return items;
  };

  return (
    <section className="py-10 md:py-14 px-4 md:px-8 bg-light-gray">
      <div className="container-main">
        <SectionHeader tag="💬 Reviews" title="What Our Travelers Say" subtitle="Real experiences from real travelers who explored North East India with us" />

        {/* Featured Review */}
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-card rounded-2xl p-8 md:p-10 card-shadow text-center mb-8 relative"
        >
          <Quote className="h-10 w-10 text-primary/20 mx-auto mb-4" />
          <p className="text-lg italic text-foreground/80 mb-6">
            {testimonials[current].text}
          </p>
          <div className="flex items-center justify-center gap-3">
            <img
              src={testimonials[current].photo}
              alt={testimonials[current].name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-heading font-bold text-sm">{testimonials[current].name}</p>
              <p className="text-xs text-muted-foreground">{testimonials[current].city}</p>
            </div>
            <div className="flex gap-0.5 ml-4">
              {[...Array(testimonials[current].rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
          </div>

          {/* Nav buttons */}
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </motion.div>

        {/* Small review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {visibleTestimonials().map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-5 card-shadow"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-foreground/70 line-clamp-3 mb-4">{t.text}</p>
              <div className="flex items-center gap-2">
                <img src={t.photo} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
