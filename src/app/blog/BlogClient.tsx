"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQSection from "@/components/shared/FAQSection";
import { BlogPost } from "@/lib/types";
import { blogs as initialBlogs } from "@/lib/data/blogs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = ["All", "Travel Tips", "Destinations", "Adventure", "Food", "Culture"];
const POSTS_PER_PAGE = 9;

export default function BlogClient({ initialPosts }: { initialPosts?: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts && initialPosts.length > 0 ? initialPosts : initialBlogs);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const gridTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) return;
    const fetchBlogs = async () => {
      try {
        setLoading(true);
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
  }, [initialPosts]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const visible = posts.filter((b) => !b.isHidden);
  const filtered = activeCategory === "All" ? visible : visible.filter((b) => b.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = filtered.slice(startIndex, startIndex + POSTS_PER_PAGE);

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

        <section className="section-padding" ref={gridTopRef}>
          <div className="container-main">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-orange text-orange-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Post Count Indicator */}
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-6">
              <span>
                Showing {filtered.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + POSTS_PER_PAGE, filtered.length)} of {filtered.length} stories
              </span>
              {totalPages > 1 && (
                <span>Page {currentPage} of {totalPages}</span>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : paginatedPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPosts.map((blog, i) => (
                    <motion.div
                      key={blog.slug}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.2) }}
                      whileHover={{ y: -6 }}
                      className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow group flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-48 overflow-hidden bg-muted relative">
                          <img
                            src={blog.image || "/uploads/tours/nagaland-aoling-festival-tour-main.jpg"}
                            alt={blog.title}
                            width="450"
                            height="240"
                            decoding="async"
                            loading={i < 3 ? "eager" : "lazy"}
                            fetchPriority={i === 0 ? "high" : "auto"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (target.src !== "/uploads/tours/nagaland-aoling-festival-tour-main.jpg") {
                                target.src = "/uploads/tours/nagaland-aoling-festival-tour-main.jpg";
                              }
                            }}
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-orange/10 text-orange text-xs rounded-full font-medium">
                              {blog.category}
                            </span>
                          </div>
                          <Link href={`/blog/${blog.slug}`}>
                            <h3 className="font-heading font-bold text-foreground hover:text-orange transition-colors mb-2 leading-tight">
                              {blog.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{blog.excerpt}</p>
                        </div>
                      </div>
                      <div className="px-5 pb-5">
                        <div className="flex items-center gap-2 border-t pt-3 text-xs text-muted-foreground overflow-hidden">
                          {blog.authorImage ? (
                            <img
                              src={blog.authorImage}
                              alt={blog.author}
                              width="24"
                              height="24"
                              className="w-6 h-6 rounded-full object-cover shrink-0"
                              loading="lazy"
                            />
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

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pt-6 border-t border-border/40">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border border-border/60 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    <div className="flex items-center gap-1 px-2">
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-orange text-orange-foreground shadow-sm font-semibold"
                              : "hover:bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border border-border/60 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next Page"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground">No posts found in this category.</div>
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
