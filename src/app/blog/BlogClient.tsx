"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQSection from "@/components/shared/FAQSection";
import { BlogPost } from "@/lib/types";
import { blogs as initialBlogs } from "@/lib/data/blogs";

const categories = ["All", "Travel Tips", "Destinations", "Adventure", "Food", "Culture"];

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>(initialBlogs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      } catch (err) {
        console.error("Error fetching blogs, using local fallback:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const visible = posts.filter((b) => !b.isHidden);
  const filtered = activeCategory === "All" ? visible : visible.filter((b) => b.category === activeCategory);

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="relative py-20 bg-navy">
          <div className="container-main px-4 md:px-8 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy-foreground mb-3">Travel Blog</h1>
            <p className="text-navy-foreground/60 text-sm">
              <Link href="/" className="hover:text-orange">Home</Link> &gt; Blog
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main">
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-orange text-orange-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((blog, i) => (
                  <motion.div
                    key={blog.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow group"
                  >
                    <div className="h-48 overflow-hidden">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-orange/10 text-orange text-xs rounded-full font-medium">{blog.category}</span>
                      </div>
                      <Link href={`/blog/${blog.slug}`}>
                        <h3 className="font-heading font-bold text-foreground hover:text-orange transition-colors mb-2 leading-tight">{blog.title}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{blog.excerpt}</p>
                      <div className="flex items-center gap-2 border-t pt-3 mt-3 text-xs text-muted-foreground overflow-hidden">
                        {blog.authorImage ? (
                          <img src={blog.authorImage} alt={blog.author} className="w-6 h-6 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                            {blog.author ? blog.author.charAt(0) : "A"}
                          </div>
                        )}
                        <span className="font-medium text-foreground/90 shrink-0">{blog.author}</span>
                        <span className="text-muted-foreground/40 shrink-0">•</span>
                        <span className="truncate">{blog.date}</span>
                        <span className="text-muted-foreground/40 shrink-0">•</span>
                        <span className="shrink-0">{blog.readTime}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground">No posts found.</div>
            )}
          </div>
        </section>

        <FAQSection
          title="Blog FAQ"
          description="Common questions about our travel blog and tribal tourism content"
          faqs={[
            { question: "How often do you publish new blog posts?", answer: "We publish 4 new blog posts every month covering tribal destinations, travel tips, cultural insights, and adventure guides. Subscribe to stay updated with the latest content." },
            { question: "Can I request a topic for the blog?", answer: "Absolutely! We love hearing from our readers. Contact us at contact@tribaldiscoverytour.com with your blog topic suggestions." },
            { question: "Do you offer guest posting opportunities?", answer: "Yes, we accept guest posts from travel writers and cultural experts. Email us with your article idea and we'll review it for potential publication." },
            { question: "Is the blog content based on personal experiences?", answer: "Yes, all our blog posts are based on our team's personal experiences, field research, and interactions with local tribes. We prioritize authentic, verified information." },
            { question: "Can I use blog images for my own website?", answer: "Blog images are copyrighted. For usage rights, please contact us directly. Some images may be available under Creative Commons license." },
            { question: "How do I stay updated with new blog posts?", answer: "Subscribe to our newsletter at the bottom of this page to receive weekly digests of new blog posts delivered to your inbox." }
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
