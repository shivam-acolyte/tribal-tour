"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BlogPost as BlogPostType } from "@/lib/types";
import { BRAND } from "@/lib/seo";
import { blogs as initialBlogs } from "@/lib/data/blogs";

// DOMPurify is browser-only; lazy import to avoid SSR issues
let DOMPurify: typeof import("dompurify").default | null = null;

interface Props {
  slug: string;
}

export default function BlogPostClient({ slug }: Props) {
  const localFallback = initialBlogs.find((b) => b.slug === slug) || null;
  const [blog, setBlog] = useState<BlogPostType | null>(localFallback);
  const [related, setRelated] = useState<BlogPostType[]>(
    initialBlogs.filter((b) => b.slug !== slug && !b.isHidden).slice(0, 3)
  );
  const [loading, setLoading] = useState(!localFallback);
  const [safeHtml, setSafeHtml] = useState(localFallback?.content || "");

  useEffect(() => {
    // Dynamically import DOMPurify on the client
    import("dompurify").then((mod) => {
      DOMPurify = mod.default;
      if (blog?.content) {
        setSafeHtml(mod.default.sanitize(blog.content, { ADD_ATTR: ["target", "loading"] }));
      }
    });
  }, [blog]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        if (res.ok) {
          const blogData = await res.json();
          if (blogData && blogData.slug) {
            setBlog(blogData);
          } else if (localFallback) {
            setBlog(localFallback);
          }
        } else if (localFallback) {
          setBlog(localFallback);
        }

        const allRes = await fetch("/api/blogs");
        if (allRes.ok) {
          const allData = await allRes.json();
          if (Array.isArray(allData) && allData.length > 0) {
            const rel = allData.filter((b: BlogPostType) => b.slug !== slug && !b.isHidden).slice(0, 3);
            setRelated(rel);
          }
        }
      } catch (error) {
        console.error("Error fetching blog, using local fallback:", error);
        if (localFallback) setBlog(localFallback);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug, localFallback]);

  // Sanitize HTML once DOMPurify is loaded and blog content is available
  useEffect(() => {
    if (blog?.content && DOMPurify) {
      setSafeHtml(DOMPurify.sanitize(blog.content, { ADD_ATTR: ["target", "loading"] }));
    } else if (blog?.content) {
      // Fallback: set content as-is (will be sanitized once DOMPurify loads)
      setSafeHtml(blog.content);
    }
  }, [blog]);

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

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-32">
          <h1 className="text-2xl font-bold mb-4 font-heading">Blog not found</h1>
          <Link href="/blog" className="text-primary font-medium hover:underline">Browse other posts</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <main>
        <section className="pt-12 md:pt-16 pb-8 md:pb-10 px-4 md:px-8">
          <div className="container-main max-w-4xl">
            <p className="text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-orange">Home</Link> &gt;{" "}
              <Link href="/blog" className="hover:text-orange">Blog</Link> &gt;{" "}
              <span className="text-foreground">{blog.title}</span>
            </p>
            <img src={blog.image} alt={blog.title} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-6" />
            <div className="mb-4">
              <span className="px-3.5 py-1 bg-orange/10 text-orange text-xs rounded-full font-semibold border border-orange/20">{blog.category}</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{blog.title}</h1>
            <div className="flex items-center gap-3 mb-8 pb-6 border-b">
              <a href="#author-bio" className="flex items-center gap-3 group cursor-pointer" title="Jump to Author's Bio">
                {blog.authorImage ? (
                  <img src={blog.authorImage} alt={blog.author} className="w-11 h-11 rounded-full object-cover border-2 border-primary/20 shrink-0 group-hover:scale-105 group-hover:border-primary transition duration-200" />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base border-2 border-primary/20 shrink-0 group-hover:border-primary transition duration-200">
                    {blog.author ? blog.author.charAt(0) : "A"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-sm text-foreground group-hover:text-primary group-hover:underline transition duration-200">{blog.author || "Admin User"}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>Travel Writer</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{blog.date}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </a>
            </div>
            <div className="space-y-6">
              {blog.excerpt && (
                <p className="text-lg md:text-xl font-medium text-foreground/90 italic border-l-4 border-orange pl-4 py-1 leading-relaxed bg-orange/5 rounded-r-xl">
                  {blog.excerpt}
                </p>
              )}
              <div
                className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 leading-relaxed prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:text-primary prose-h3:mt-6 prose-h3:mb-3 prose-p:leading-relaxed prose-li:my-1 prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: safeHtml }}
              />
            </div>

            {/* Author Bio */}
            <div id="author-bio" className="scroll-mt-24 mt-10 p-6 bg-card rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 card-shadow">
              {blog.authorImage ? (
                <img src={blog.authorImage} alt={blog.author} className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                  {blog.author ? blog.author.charAt(0) : "A"}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading font-bold text-base">{blog.author || "Admin User"}</h4>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">Author</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {(blog as any).authorBio || `${blog.author || "The author"} is a featured travel writer at Tribal Discovery Tour, sharing authentic stories, local culture, and insider travel guides.`}
                </p>
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center gap-3 mt-8 pt-8 border-t">
              <span className="text-sm font-medium">Share:</span>
              <button className="px-4 py-2 bg-success/10 text-success rounded-lg text-sm hover:bg-success/20">WhatsApp</button>
              <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20">Facebook</button>
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm hover:bg-muted/80">Twitter</button>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="pt-8 pb-16 md:pt-10 md:pb-20 px-4 md:px-8 bg-light-gray">
          <div className="container-main">
            <h2 className="font-heading text-2xl font-bold mb-8 text-center">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((b) => (
                <Link key={b.slug} href={`/blog/${b.slug}`} className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow group">
                  <div className="h-40 overflow-hidden">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{b.date}</p>
                    <h3 className="font-heading font-bold text-sm">{b.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
