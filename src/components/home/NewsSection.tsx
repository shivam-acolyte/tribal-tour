"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";

const fallbackNews = [
  { title: "New Rajasthan Tribal Tour Packages Launched", date: "May 10, 2026", excerpt: "Explore Bhil and Rabari tribe villages with our newest Rajasthan tribal adventure itinerary.", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=500&q=75", slug: "#" },
  { title: "Hornbill Festival 2026 Tribal Itinerary Released", date: "Apr 20, 2026", excerpt: "Book early for Nagaland's Hornbill Festival and enjoy curated cultural events and village visits.", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=500&q=75", slug: "#" },
  { title: "Tribal Discovery Tour Expands to Northeast India", date: "Mar 18, 2026", excerpt: "New tours now include Meghalaya, Arunachal Pradesh and Assam tribal experiences.", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=500&q=75", slug: "#" },
];

const NewsSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const res = await fetch("/api/blogs?limit=3");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const visible = data.filter((b: any) => !b.isHidden).slice(0, 3);
          setPosts(visible.length > 0 ? visible : fallbackNews);
        } else {
          setPosts(fallbackNews);
        }
      } catch (err) {
        console.error("Error fetching latest blogs:", err);
        setPosts(fallbackNews);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBlogs();
  }, []);

  return (
    <section className="section-padding">
      <div className="container-main">
        <SectionHeader tag="📰 News & Events" title="Latest Updates" />
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((n, i) => (
              <motion.div
                key={n.slug || n.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="bg-card rounded-2xl overflow-hidden card-shadow transition-shadow hover:card-shadow-hover cursor-pointer"
              >
                <div className="w-full h-48 bg-muted overflow-hidden">
                  {n.slug && n.slug !== "#" ? (
                    <Link href={`/blog/${n.slug}`}>
                      <img
                        src={n.image || "/uploads/tours/nagaland-aoling-festival-tour-main.jpg"}
                        alt={n.title}
                        width="400"
                        height="192"
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : "auto"}
                        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                        loading={i < 2 ? "eager" : "lazy"}
                      />
                    </Link>
                  ) : (
                    <img
                      src={n.image || "/uploads/tours/nagaland-aoling-festival-tour-main.jpg"}
                      alt={n.title}
                      width="400"
                      height="192"
                      decoding="async"
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-muted-foreground mb-2">{n.date}</p>
                  {n.slug && n.slug !== "#" ? (
                    <Link href={`/blog/${n.slug}`}>
                      <h3 className="font-heading font-bold text-foreground hover:text-orange transition-colors mb-2 leading-snug">{n.title}</h3>
                    </Link>
                  ) : (
                    <h3 className="font-heading font-bold text-foreground mb-2 leading-snug">{n.title}</h3>
                  )}
                  <p className="text-sm text-muted-foreground">{n.excerpt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
