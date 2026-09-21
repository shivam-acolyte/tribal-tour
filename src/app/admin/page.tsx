"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Plus, Trash, Save, LogOut, Copy, Image as ImageIcon, Search,
  Menu, X, Eye, EyeOff, LayoutDashboard, FileText, MessageCircle,
  Mail, Phone, Calendar, Shield, RefreshCw, ExternalLink, Clock,
  User, Star, MapPin, Sparkles, Check, Globe,
} from "lucide-react";
import { Tour, BlogPost, Lead } from "@/lib/types";
import { tours as localTours } from "@/lib/data/tours";
import { blogs as localBlogs } from "@/lib/data/blogs";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// ─── Constants ────────────────────────────────────────────────────────────────

const emptyTour: Tour = {
  slug: "", name: "", location: "", duration: "", price: 0, originalPrice: 0,
  rating: 4.5, reviewCount: 0, isHidden: false, image: "", images: [], badge: "New",
  category: "", groupSize: "", description: "", highlights: [], included: [],
  excluded: [], itinerary: [], reviews: [], seoTitle: "", seoDescription: "", seoKeywords: "",
};

const emptyBlog: BlogPost = {
  slug: "", title: "", excerpt: "", content: "", image: "", category: "Destinations",
  author: "Admin User", authorImage: "", authorBio: "",
  date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  readTime: "5 min read", isHidden: false, seoTitle: "", seoDescription: "", seoKeywords: "",
};

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ align: [] }],
    ["clean"],
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getToken() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("admin_auth_token");
    if (!raw) return null;
    const token = JSON.parse(raw);
    if (Date.now() < token.expiry) return token;
    localStorage.removeItem("admin_auth_token");
  } catch {}
  return null;
}

async function apiUpload(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[10px] font-bold mb-1 text-muted-foreground uppercase tracking-wider">{children}</label>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}</div>;
}
const inputCls = "w-full p-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-background text-sm";
const textareaCls = `${inputCls} resize-none`;

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (user: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      localStorage.setItem("admin_auth_token", JSON.stringify({
        expiry: Date.now() + 60 * 60 * 1000,
        username: data.username,
      }));
      onLogin(data.username);
    } catch {
      setError("Network error. Is your DATABASE_URL set in .env.local?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy/80 to-background p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/50 text-sm mt-1">Tribal Discovery Tour</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-2xl space-y-4">
          <div><Label>Username</Label><input type="text" className={inputCls} placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} required /></div>
          <div><Label>Password</Label><input type="password" className={inputCls} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required /></div>
          {error && <p className="text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-xs text-muted-foreground">Default: admin / tribal2024</p>
        </form>
      </div>
    </div>
  );
}

// ─── Blog Live Preview Modal ──────────────────────────────────────────────────

function BlogPreviewModal({ blog, onClose }: { blog: BlogPost; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"page" | "seo">("page");

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in">
      <div className="bg-background border border-border rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-primary/10 text-primary rounded-xl">
              <Eye size={18} />
            </span>
            <div>
              <h3 className="font-heading font-bold text-sm md:text-base">Blog Live Preview</h3>
              <p className="text-[11px] text-muted-foreground truncate max-w-xs md:max-w-md">{blog.title || "Untitled Blog Post"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("page")}
                className={`px-3 py-1 rounded-md transition font-medium text-xs ${activeTab === "page" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Article View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("seo")}
                className={`px-3 py-1 rounded-md transition font-medium text-xs ${activeTab === "seo" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Google Search (SEO)
              </button>
            </div>
            {blog.slug && (
              <a
                href={`/blog/${blog.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs rounded-lg font-medium transition"
              >
                <ExternalLink size={12} /> View Live URL
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-background">
          {activeTab === "page" ? (
            <article className="max-w-2xl mx-auto space-y-6">
              {/* Category & Date */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                  {blog.category || "Destinations"}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock size={12} /> {blog.readTime || "5 min read"}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} /> {blog.date || new Date().toLocaleDateString()}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-2xl md:text-4xl font-bold leading-tight text-foreground">
                {blog.title || "Blog Title Will Appear Here"}
              </h1>

              {/* Author */}
              <div className="flex items-center gap-3 py-3 border-y border-border">
                {blog.authorImage ? (
                  <img src={blog.authorImage} alt="" className="w-10 h-10 rounded-full object-cover border" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {(blog.author || "A")[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{blog.author || "Admin User"}</p>
                  <p className="text-xs text-muted-foreground">Travel Writer & Explorer</p>
                </div>
              </div>

              {/* Cover Image */}
              {blog.image && (
                <div className="rounded-2xl overflow-hidden border shadow-sm">
                  <img src={blog.image} alt="" className="w-full h-72 md:h-96 object-cover" />
                </div>
              )}

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-sm md:text-base font-medium text-foreground/80 italic border-l-4 border-primary pl-4 py-1">
                  {blog.excerpt}
                </p>
              )}

              {/* Rich Content HTML */}
              <div
                className="prose prose-neutral dark:prose-invert max-w-none text-sm md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content || "<p class='text-muted-foreground italic'>No content written yet...</p>" }}
              />

              {/* Author Bio Box */}
              {(blog as any).authorBio && (
                <div className="p-5 bg-muted/40 rounded-2xl border flex gap-4 items-start mt-8">
                  {blog.authorImage && (
                    <img src={blog.authorImage} alt="" className="w-12 h-12 rounded-full object-cover shrink-0 border" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm mb-1">About {blog.author}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{(blog as any).authorBio}</p>
                  </div>
                </div>
              )}
            </article>
          ) : (
            <div className="max-w-xl mx-auto space-y-6 py-6">
              <div>
                <h4 className="font-heading font-bold text-lg">Google Search (SERP) Preview</h4>
                <p className="text-xs text-muted-foreground">How this blog will appear on search engine results pages:</p>
              </div>

              <div className="p-5 bg-card border rounded-2xl space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-[10px] flex items-center justify-center font-bold">T</span>
                  <span>https://tribaldiscoverytour.com › blog › {blog.slug || "post-slug"}</span>
                </div>
                <h3 className="text-blue-600 dark:text-blue-400 font-medium text-lg hover:underline cursor-pointer">
                  {blog.seoTitle || blog.title || "Untitled Blog Post - Tribal Discovery Tour"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {blog.seoDescription || blog.excerpt || "Explore authentic travel experiences, cultural heritage, and itineraries."}
                </p>
              </div>

              {blog.seoKeywords && (
                <div className="p-4 bg-muted/30 border rounded-xl">
                  <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Keywords</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {blog.seoKeywords.split(",").map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-background border rounded-lg text-xs font-medium">
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tour Live Preview Modal ──────────────────────────────────────────────────

function TourPreviewModal({ tour, onClose }: { tour: Tour; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in">
      <div className="bg-background border border-border rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="px-6 py-3.5 border-b flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-primary/10 text-primary rounded-xl">
              <Eye size={18} />
            </span>
            <div>
              <h3 className="font-heading font-bold text-sm md:text-base">Tour Package Preview</h3>
              <p className="text-[11px] text-muted-foreground truncate max-w-xs md:max-w-md">{tour.name || "Untitled Tour"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tour.slug && (
              <a
                href={`/tours/${tour.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 text-xs rounded-lg font-medium transition"
              >
                <ExternalLink size={12} /> View Live URL
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-orange/10 text-orange font-bold">
                {tour.badge || "Featured"}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                {tour.category || "General"}
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin size={12} className="text-orange" /> {tour.location}
              </span>
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock size={12} /> {tour.duration}
              </span>
            </div>

            <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              {tour.name || "Tour Name"}
            </h1>

            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary font-heading">₹{(tour.price || 0).toLocaleString()}</span>
                {tour.originalPrice ? (
                  <span className="text-sm text-muted-foreground line-through">₹{tour.originalPrice.toLocaleString()}</span>
                ) : null}
                <span className="text-xs text-muted-foreground">/ person</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-yellow-500">
                <Star size={16} fill="currentColor" /> {tour.rating || 4.8} ({tour.reviewCount || 0} reviews)
              </div>
            </div>

            {tour.image && (
              <div className="rounded-2xl overflow-hidden border shadow-sm">
                <img src={tour.image} alt="" className="w-full h-72 md:h-96 object-cover" />
              </div>
            )}

            <div>
              <h3 className="font-heading font-bold text-lg mb-2">Description</h3>
              <p className="text-sm md:text-base leading-relaxed text-muted-foreground">{tour.description || "No description provided."}</p>
            </div>

            {tour.highlights && tour.highlights.length > 0 && (
              <div>
                <h3 className="font-heading font-bold text-lg mb-3">Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tour.highlights.map((h: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-card border text-xs font-medium">
                      <span>{h.icon || "✨"}</span>
                      <span>{h.label || h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tour.itinerary && tour.itinerary.length > 0 && (
              <div>
                <h3 className="font-heading font-bold text-lg mb-3">Day-by-Day Itinerary ({tour.itinerary.length} Days)</h3>
                <div className="space-y-3">
                  {tour.itinerary.map((day: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border bg-card space-y-1">
                      <p className="text-xs font-bold text-primary">Day {day.day || idx + 1}: {day.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{day.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tours Panel ──────────────────────────────────────────────────────────────

function ToursPanel() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [form, setForm] = useState<Tour>({ ...emptyTour });
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch("/api/tours")
      .then(r => r.json())
      .then(data => { setTours(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setTours([]); setLoading(false); });
  }, []);

  const hc = (field: keyof Tour, value: any) => setForm(p => ({ ...p, [field]: value }));
  const handleSelect = (i: number) => { setSelected(i); setForm({ ...tours[i] }); };
  const handleAddNew = () => { setSelected(null); setForm({ ...emptyTour }); };

  const handleSave = async () => {
    if (!form.name || !form.slug) return alert("Name and Slug are required!");
    try {
      const res = await fetch("/api/tours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const updated = [...tours];
      if (selected !== null) { updated[selected] = form; } else { updated.push(form); setSelected(updated.length - 1); }
      setTours(updated);
      alert("✅ Tour saved!");
    } catch (e: any) { alert("❌ " + e.message); }
  };

  const handleDelete = async (i: number) => {
    if (!confirm("Delete this tour?")) return;
    try {
      await fetch(`/api/tours/${tours[i].slug}`, { method: "DELETE" });
      const updated = tours.filter((_, idx) => idx !== i);
      setTours(updated);
      if (selected === i) handleAddNew();
    } catch { alert("❌ Delete failed."); }
  };

  const handleToggle = async (i: number) => {
    const t = { ...tours[i], isHidden: !tours[i].isHidden };
    await fetch(`/api/tours/${t.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: t.isHidden }),
    });
    const updated = [...tours]; updated[i] = t; setTours(updated);
    if (selected === i) setForm(t);
  };

  const handleMigrate = async () => {
    if (!confirm("Upload all local tours.ts data to PostgreSQL?")) return;
    try {
      for (const tour of localTours) {
        await fetch("/api/tours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tour),
        });
      }
      const res = await fetch("/api/tours");
      setTours(await res.json());
      alert("✅ All local tours migrated to PostgreSQL!");
    } catch { alert("❌ Migration failed."); }
  };

  const handleExport = () => {
    navigator.clipboard.writeText(`import { Tour } from "../types";\n\nexport const tours: Tour[] = ${JSON.stringify(tours, null, 2)};\n`);
    alert("Code copied to clipboard!");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading("image");
    try { hc("image", await apiUpload(file, "tours")); alert("✅ Image uploaded!"); }
    catch { alert("❌ Upload failed."); } finally { setUploading(null); }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files?.length) return;
    setUploading("gallery");
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) urls.push(await apiUpload(f, "tours"));
      hc("images", [...(form.images || []), ...urls]);
      alert("✅ Gallery uploaded!");
    } catch { alert("❌ Upload failed."); } finally { setUploading(null); }
  };

  const filtered = tours.filter(t =>
    (t.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (t.location || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-72 shrink-0 border-r flex flex-col bg-card">
        <div className="p-4 border-b space-y-3">
          <button onClick={handleAddNew} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground p-2.5 rounded-xl hover:opacity-90 transition font-medium text-sm"><Plus size={16} /> Add New Tour</button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input type="text" placeholder="Search tours..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-muted/30" />
          </div>
          <p className="text-xs text-muted-foreground">{loading ? "Loading..." : `${tours.length} tours in database`}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading && <div className="p-6 text-center text-xs text-muted-foreground">Fetching from database…</div>}
          {filtered.map((tour, i) => {
            const realIdx = tours.indexOf(tour);
            return (
              <div key={i} onClick={() => handleSelect(realIdx)} className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition group ${selected === realIdx ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"} ${tour.isHidden ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {tour.image ? <img src={tour.image} alt="" className="w-9 h-9 rounded-lg object-cover border shrink-0" /> : <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center shrink-0"><ImageIcon size={14} className="text-muted-foreground" /></div>}
                  <div className="truncate"><p className="text-xs font-semibold truncate">{tour.name || "Untitled"}</p><p className="text-[10px] text-muted-foreground truncate">{tour.location}</p></div>
                </div>
                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={e => { e.stopPropagation(); handleToggle(realIdx); }} className="p-1 hover:bg-muted rounded-md">{tour.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(realIdx); }} className="p-1 text-destructive hover:bg-destructive/10 rounded-md"><Trash size={12} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b bg-card shrink-0">
          <h2 className="font-heading font-bold text-base">{selected !== null ? "Edit Tour" : "Create New Tour"}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-purple-700 transition shadow-sm"
              title="Preview Tour"
            >
              <Eye size={14} /> Preview
            </button>
            <button onClick={handleMigrate} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition"><Save size={14} /> Migrate Local Data</button>
            <button onClick={handleExport} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition"><Copy size={14} /> Export Code</button>
            <button onClick={handleSave} className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition"><Save size={14} /> Save to DB</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <section className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-heading font-bold border-b pb-2">Basic Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name *"><input type="text" className={inputCls} value={form.name} onChange={e => hc("name", e.target.value)} /></Field>
                <Field label="Slug *"><input type="text" className={inputCls} value={form.slug} onChange={e => hc("slug", e.target.value)} /></Field>
                <Field label="Location"><input type="text" className={inputCls} value={form.location} onChange={e => hc("location", e.target.value)} /></Field>
                <Field label="Duration"><input type="text" className={inputCls} value={form.duration} onChange={e => hc("duration", e.target.value)} placeholder="e.g. 5 Days 4 Nights" /></Field>
                <Field label="Price (₹)"><input type="number" className={inputCls} value={form.price} onChange={e => hc("price", Number(e.target.value))} /></Field>
                <Field label="Original Price (₹)"><input type="number" className={inputCls} value={form.originalPrice} onChange={e => hc("originalPrice", Number(e.target.value))} /></Field>
                <Field label="Badge">
                  <select className={inputCls} value={form.badge} onChange={e => hc("badge", e.target.value)}>
                    {["Popular","New","Best Seller","Trending","Adventure & Cultural","Adventure Trek"].map(b => <option key={b}>{b}</option>)}
                  </select>
                </Field>
                <Field label="Group Size"><input type="text" className={inputCls} value={form.groupSize} onChange={e => hc("groupSize", e.target.value)} placeholder="e.g. 4-15" /></Field>
                <Field label="Rating"><input type="number" step="0.1" min="1" max="5" className={inputCls} value={form.rating} onChange={e => hc("rating", Number(e.target.value))} /></Field>
                <Field label="Category"><input type="text" className={inputCls} value={form.category} onChange={e => hc("category", e.target.value)} /></Field>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="tourHidden" checked={!!form.isHidden} onChange={e => hc("isHidden", e.target.checked)} className="w-4 h-4 accent-primary" />
                <label htmlFor="tourHidden" className="text-sm cursor-pointer">Hide this tour from public</label>
              </div>
              <Field label="Main Cover Image (Uploaded to Server)">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input type="text" className={inputCls} placeholder="/uploads/tours/..." value={form.image} onChange={e => hc("image", e.target.value)} />
                    <label className="shrink-0 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-medium hover:opacity-90 transition cursor-pointer flex items-center gap-1.5 text-sm shadow-sm">
                      {uploading === "image" ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" /> : <><ImageIcon size={14} /> Upload from Device</>}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={!!uploading} />
                    </label>
                    {form.image && (
                      <button type="button" onClick={() => hc("image", "")} className="px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-xl border transition">
                        Remove
                      </button>
                    )}
                  </div>
                  {form.image && (
                    <div className="relative w-32 h-20 rounded-xl overflow-hidden border shadow-sm group">
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">Server</span>
                    </div>
                  )}
                </div>
              </Field>
              <Field label="Description"><textarea className={`${textareaCls} h-24`} value={form.description} onChange={e => hc("description", e.target.value)} /></Field>
            </section>

            <section className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-heading font-bold border-b pb-2">Gallery & Media (Stored on Server)</h3>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Tour Gallery ({form.images?.length || 0} Images)</Label>
                  <label className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-xl font-medium hover:opacity-90 transition cursor-pointer flex items-center gap-1.5 text-xs shadow-sm">
                    {uploading === "gallery" ? <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent" /> : <><Plus size={13} /> Add Gallery Images</>}
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={!!uploading} />
                  </label>
                </div>

                {form.images && form.images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 p-3 bg-muted/20 border rounded-2xl">
                    {form.images.map((imgUrl, gIdx) => (
                      <div key={gIdx} className="relative group aspect-square rounded-xl overflow-hidden border bg-background shadow-xs">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = form.images?.filter((_, idx) => idx !== gIdx) || [];
                            hc("images", updated);
                          }}
                          className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition shadow-sm"
                          title="Remove from gallery"
                        >
                          <Trash size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed rounded-2xl text-center text-xs text-muted-foreground">
                    No gallery images added yet. Click &quot;Add Gallery Images&quot; to upload photos from your device.
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Included (Comma separated)"><textarea className={`${textareaCls} h-28`} value={form.included?.join(",\n")} onChange={e => hc("included", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} /></Field>
                <Field label="Excluded (Comma separated)"><textarea className={`${textareaCls} h-28`} value={form.excluded?.join(",\n")} onChange={e => hc("excluded", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} /></Field>
              </div>
            </section>

            <section className="bg-card border rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-heading font-bold">Itinerary</h3>
                <button onClick={() => hc("itinerary", [...(form.itinerary || []), { day: (form.itinerary?.length || 0) + 1, title: "", description: "", activities: [], meals: [], accommodation: "" }])} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold hover:bg-primary/20 transition">+ Add Day</button>
              </div>
              <div className="space-y-3">
                {form.itinerary?.map((day, idx) => (
                  <div key={idx} className="bg-muted/30 border rounded-xl p-4 relative">
                    <button onClick={() => { const n = [...form.itinerary]; n.splice(idx, 1); hc("itinerary", n); }} className="absolute top-3 right-3 text-destructive hover:bg-destructive/10 p-1 rounded-md"><Trash size={14} /></button>
                    <div className="grid grid-cols-6 gap-3 mb-3">
                      <div className="col-span-1"><Label>Day</Label><input type="number" className={inputCls} value={day.day} onChange={e => { const n = [...form.itinerary]; n[idx].day = Number(e.target.value); hc("itinerary", n); }} /></div>
                      <div className="col-span-5"><Label>Title</Label><input type="text" className={inputCls} value={day.title} onChange={e => { const n = [...form.itinerary]; n[idx].title = e.target.value; hc("itinerary", n); }} /></div>
                    </div>
                    <Label>Description</Label>
                    <textarea className={`${textareaCls} h-16 mb-3`} value={day.description} onChange={e => { const n = [...form.itinerary]; n[idx].description = e.target.value; hc("itinerary", n); }} />
                    <div className="grid grid-cols-3 gap-3">
                      <div><Label>Activities (comma)</Label><input type="text" className={inputCls} value={day.activities?.join(", ")} onChange={e => { const n = [...form.itinerary]; n[idx].activities = e.target.value.split(",").map(s => s.trim()); hc("itinerary", n); }} /></div>
                      <div><Label>Meals (comma)</Label><input type="text" className={inputCls} value={day.meals?.join(", ")} onChange={e => { const n = [...form.itinerary]; n[idx].meals = e.target.value.split(",").map(s => s.trim()); hc("itinerary", n); }} /></div>
                      <div><Label>Accommodation</Label><input type="text" className={inputCls} value={day.accommodation} onChange={e => { const n = [...form.itinerary]; n[idx].accommodation = e.target.value; hc("itinerary", n); }} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-heading font-bold border-b pb-2">SEO Details</h3>
              <Field label="SEO Title"><input type="text" className={inputCls} value={form.seoTitle || ""} onChange={e => hc("seoTitle", e.target.value)} /></Field>
              <Field label="SEO Meta Description"><textarea className={`${textareaCls} h-20`} value={form.seoDescription || ""} onChange={e => hc("seoDescription", e.target.value)} /></Field>
              <Field label="SEO Keywords (comma separated)"><input type="text" className={inputCls} value={form.seoKeywords || ""} onChange={e => hc("seoKeywords", e.target.value)} /></Field>
            </section>

            <section className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-heading font-bold border-b pb-2">Advanced (Raw JSON)</h3>
              <p className="text-xs text-muted-foreground">Edit Highlights and Reviews as JSON arrays.</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Highlights (JSON)"><textarea className={`${textareaCls} h-48 font-mono text-xs bg-muted/20`} value={JSON.stringify(form.highlights, null, 2)} onChange={e => { try { hc("highlights", JSON.parse(e.target.value)); } catch {} }} /></Field>
                <Field label="Reviews (JSON)"><textarea className={`${textareaCls} h-48 font-mono text-xs bg-muted/20`} value={JSON.stringify(form.reviews, null, 2)} onChange={e => { try { hc("reviews", JSON.parse(e.target.value)); } catch {} }} /></Field>
              </div>
            </section>
          </div>
        </div>
      </div>
      {showPreview && (
        <TourPreviewModal tour={form} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

// ─── Blogs Panel ──────────────────────────────────────────────────────────────

function BlogsPanel() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [form, setForm] = useState<BlogPost>({ ...emptyBlog });
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetch("/api/blogs")
      .then(r => r.json())
      .then(data => { setBlogs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setBlogs([]); setLoading(false); });
  }, []);

  const hc = (field: keyof BlogPost, value: any) => setForm(p => ({ ...p, [field]: value }));
  const handleSelect = (i: number) => { setSelected(i); setForm({ ...blogs[i] }); };
  const handleAddNew = () => { setSelected(null); setForm({ ...emptyBlog }); };

  const handleSave = async () => {
    if (!form.title || !form.slug) return alert("Title and Slug are required!");
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const updated = [...blogs];
      if (selected !== null) { updated[selected] = form; } else { updated.push(form); setSelected(updated.length - 1); }
      setBlogs(updated);
      alert("✅ Blog saved!");
    } catch (e: any) { alert("❌ " + e.message); }
  };

  const handleDelete = async (i: number) => {
    if (!confirm("Delete this blog?")) return;
    await fetch(`/api/blogs/${blogs[i].slug}`, { method: "DELETE" });
    const updated = blogs.filter((_, idx) => idx !== i);
    setBlogs(updated);
    if (selected === i) handleAddNew();
  };

  const handleToggle = async (i: number) => {
    const b = { ...blogs[i], isHidden: !blogs[i].isHidden };
    await fetch(`/api/blogs/${b.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isHidden: b.isHidden }),
    });
    const updated = [...blogs]; updated[i] = b; setBlogs(updated);
    if (selected === i) setForm(b);
  };

  const handleMigrate = async () => {
    if (!confirm("Upload all local blogs.ts data to PostgreSQL?")) return;
    for (const blog of localBlogs) {
      await fetch("/api/blogs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blog) });
    }
    const res = await fetch("/api/blogs");
    setBlogs(await res.json());
    alert("✅ All local blogs migrated!");
  };

  const handleExport = () => {
    navigator.clipboard.writeText(`import { BlogPost } from "../types";\n\nexport const blogs: BlogPost[] = ${JSON.stringify(blogs, null, 2)};\n`);
    alert("Code copied!");
  };

  const handleImgUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "authorImage") => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(field);
    try { hc(field, await apiUpload(file, "blogs")); alert("✅ Image uploaded!"); }
    catch { alert("❌ Upload failed."); } finally { setUploading(null); }
  };

  const filtered = blogs.filter(b => (b.title || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-72 shrink-0 border-r flex flex-col bg-card">
        <div className="p-4 border-b space-y-3">
          <button onClick={handleAddNew} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground p-2.5 rounded-xl hover:opacity-90 transition font-medium text-sm"><Plus size={16} /> Add New Blog</button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input type="text" placeholder="Search blogs..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-muted/30" />
          </div>
          <p className="text-xs text-muted-foreground">{loading ? "Loading..." : `${blogs.length} blogs in database`}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading && <div className="p-6 text-center text-xs text-muted-foreground">Fetching from database…</div>}
          {filtered.map((blog, i) => {
            const realIdx = blogs.indexOf(blog);
            return (
              <div key={i} onClick={() => handleSelect(realIdx)} className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition group ${selected === realIdx ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"} ${blog.isHidden ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {blog.image ? <img src={blog.image} alt="" className="w-9 h-9 rounded-lg object-cover border shrink-0" /> : <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center shrink-0"><FileText size={14} className="text-muted-foreground" /></div>}
                  <div className="truncate"><p className="text-xs font-semibold truncate">{blog.title || "Untitled"}</p><p className="text-[10px] text-muted-foreground truncate">{blog.category} • {blog.date}</p></div>
                </div>
                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={e => { e.stopPropagation(); handleToggle(realIdx); }} className="p-1 hover:bg-muted rounded-md">{blog.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(realIdx); }} className="p-1 text-destructive hover:bg-destructive/10 rounded-md"><Trash size={12} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b bg-card shrink-0">
          <h2 className="font-heading font-bold text-base">{selected !== null ? "Edit Blog" : "Create New Blog"}</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 bg-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-purple-700 transition shadow-sm"
              title="Preview Blog Article"
            >
              <Eye size={14} /> Preview Blog
            </button>
            <button onClick={handleMigrate} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition"><Save size={14} /> Migrate Local Data</button>
            <button onClick={handleExport} className="flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition"><Copy size={14} /> Export Code</button>
            <button onClick={handleSave} className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition"><Save size={14} /> Save to DB</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <section className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-heading font-bold border-b pb-2">Basic Information</h3>
              <Field label="Title *"><input type="text" className={inputCls} value={form.title} onChange={e => hc("title", e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Slug *"><input type="text" className={inputCls} value={form.slug} onChange={e => hc("slug", e.target.value)} /></Field>
                <Field label="Category">
                  <select className={inputCls} value={form.category} onChange={e => hc("category", e.target.value)}>
                    {["Destinations","Travel Tips","Food","Adventure","Culture"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Date"><input type="text" className={inputCls} value={form.date} onChange={e => hc("date", e.target.value)} /></Field>
                <Field label="Read Time"><input type="text" className={inputCls} value={form.readTime} onChange={e => hc("readTime", e.target.value)} /></Field>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="blogHidden" checked={!!form.isHidden} onChange={e => hc("isHidden", e.target.checked)} className="w-4 h-4 accent-primary" />
                <label htmlFor="blogHidden" className="text-sm cursor-pointer">Hide this blog from public</label>
              </div>
            </section>

            <section className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-heading font-bold border-b pb-2">Cover Image & Author (Stored on Server)</h3>
              <Field label="Cover Image">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input type="text" className={inputCls} placeholder="/uploads/blogs/..." value={form.image} onChange={e => hc("image", e.target.value)} />
                    <label className="shrink-0 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-medium cursor-pointer flex items-center gap-1.5 text-sm hover:opacity-90 transition shadow-sm">
                      {uploading === "image" ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" /> : <><ImageIcon size={14} /> Upload from Device</>}
                      <input type="file" accept="image/*" className="hidden" onChange={e => handleImgUpload(e, "image")} disabled={!!uploading} />
                    </label>
                    {form.image && (
                      <button type="button" onClick={() => hc("image", "")} className="px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-xl border transition">
                        Remove
                      </button>
                    )}
                  </div>
                  {form.image && (
                    <div className="relative w-36 h-24 rounded-xl overflow-hidden border shadow-sm">
                      <img src={form.image} alt="Cover Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">Server</span>
                    </div>
                  )}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Author Name"><input type="text" className={inputCls} value={form.author} onChange={e => hc("author", e.target.value)} /></Field>
                <Field label="Author Profile Image">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input type="text" className={inputCls} placeholder="/uploads/blogs/..." value={form.authorImage} onChange={e => hc("authorImage", e.target.value)} />
                      <label className="shrink-0 bg-primary text-primary-foreground px-3.5 py-2.5 rounded-xl font-medium cursor-pointer flex items-center gap-1.5 text-sm hover:opacity-90 transition shadow-sm">
                        {uploading === "authorImage" ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" /> : <ImageIcon size={14} />}
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleImgUpload(e, "authorImage")} disabled={!!uploading} />
                      </label>
                      {form.authorImage && (
                        <button type="button" onClick={() => hc("authorImage", "")} className="px-2.5 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-xl border transition">
                          Remove
                        </button>
                      )}
                    </div>
                    {form.authorImage && (
                      <div className="w-12 h-12 rounded-full overflow-hidden border shadow-xs">
                        <img src={form.authorImage} alt="Author" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </Field>
              </div>
              <Field label="Author Bio"><textarea className={`${textareaCls} h-16`} value={(form as any).authorBio || ""} onChange={e => hc("authorBio" as any, e.target.value)} /></Field>
            </section>

            <section className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-heading font-bold border-b pb-2">Content</h3>
              <Field label="Excerpt (Short Summary)"><textarea className={`${textareaCls} h-16`} value={form.excerpt} onChange={e => hc("excerpt", e.target.value)} /></Field>
              <div>
                <Label>Full Content (Rich HTML)</Label>
                <div className="border rounded-xl overflow-hidden">
                  <ReactQuill theme="snow" value={form.content} onChange={val => hc("content", val)} modules={quillModules} placeholder="Write your blog content here..." style={{ height: 320 }} />
                </div>
                <p className="text-xs text-muted-foreground mt-10">Saved as sanitized HTML.</p>
              </div>
            </section>

            <section className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-heading font-bold border-b pb-2">SEO Details</h3>
              <Field label="SEO Title"><input type="text" className={inputCls} value={form.seoTitle || ""} onChange={e => hc("seoTitle", e.target.value)} /></Field>
              <Field label="SEO Meta Description"><textarea className={`${textareaCls} h-20`} value={form.seoDescription || ""} onChange={e => hc("seoDescription", e.target.value)} /></Field>
              <Field label="SEO Keywords"><input type="text" className={inputCls} value={form.seoKeywords || ""} onChange={e => hc("seoKeywords", e.target.value)} /></Field>
            </section>
          </div>
        </div>
      </div>
      {showPreview && (
        <BlogPreviewModal blog={form} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

// ─── Leads Panel ──────────────────────────────────────────────────────────────

function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLeads = () => {
    setLoading(true);
    fetch("/api/leads")
      .then(r => r.json())
      .then(data => { setLeads(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setLeads([]); setLoading(false); });
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setLeads(leads.filter(l => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = leads.map(l => l.id === id ? { ...l, status: status as any } : l);
    setLeads(updated);
    if (selected?.id === id) setSelected({ ...selected, status: status as any });
  };

  const filtered = leads.filter(l =>
    (l.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.phone || "").includes(search)
  );

  const statusColors: Record<string, string> = {
    New: "bg-blue-100 text-blue-700",
    Contacted: "bg-orange/20 text-orange",
    Closed: "bg-green-100 text-green-700",
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-80 shrink-0 border-r flex flex-col bg-card">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold">Leads ({leads.length})</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchLeads}
                title="Refresh leads"
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {leads.filter(l => l.status === "New").length} New
              </span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-8 pr-3 py-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-muted/30" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading && <div className="p-6 text-center text-xs text-muted-foreground">Fetching from database…</div>}
          {filtered.map(lead => (
            <div key={lead.id} onClick={() => setSelected(lead)} className={`flex items-start justify-between p-3 rounded-xl cursor-pointer transition group ${selected?.id === lead.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"}`}>
              <div className="overflow-hidden pr-2">
                <p className="font-semibold text-xs truncate">{lead.name}</p>
                <p className="text-[10px] text-muted-foreground truncate mb-1">{lead.subject}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[lead.status] || ""}`}>{lead.status}</span>
              </div>
              <button onClick={e => { e.stopPropagation(); handleDelete(lead.id!); }} className="p-1 text-destructive hover:bg-destructive/10 rounded-md opacity-0 group-hover:opacity-100 transition shrink-0"><Trash size={12} /></button>
            </div>
          ))}
          {!loading && filtered.length === 0 && <div className="p-6 text-center text-xs text-muted-foreground">No leads found.</div>}
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-3 border-b bg-card shrink-0">
          <h2 className="font-heading font-bold text-base">Lead Details</h2>
          {selected && (
            <select value={selected.status} onChange={e => updateStatus(selected.id!, e.target.value)} className="px-3 py-1.5 border rounded-lg bg-card text-xs font-medium outline-none focus:ring-2 focus:ring-primary">
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
            </select>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {selected ? (
            <div className="max-w-2xl mx-auto bg-card border rounded-2xl p-6 space-y-5">
              <div className="border-b pb-4">
                <h3 className="text-xl font-bold font-heading">{selected.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Calendar size={12} /> {selected.created_at ? new Date(selected.created_at).toLocaleString() : "—"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Email</p><a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-primary hover:underline text-sm font-medium"><Mail size={14} /> {selected.email}</a></div>
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Phone</p><a href={`https://wa.me/${selected.phone}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline text-sm font-medium"><Phone size={14} /> {selected.phone || "Not provided"}</a></div>
              </div>
              <div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Subject</p><p className="font-medium text-sm">{selected.subject}</p></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 border-t pt-4">Message</p>
                <div className="bg-muted/30 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</div>
              </div>
              <div className="flex gap-3 pt-2">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-xl text-sm font-medium hover:bg-muted transition"><Mail size={14} /> Reply Email</a>
                <a href={`https://wa.me/${selected.phone?.replace(/\D/g, "")}?text=Hi ${selected.name}, regarding your inquiry...`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition"><MessageCircle size={14} /> WhatsApp</a>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
              <MessageCircle size={40} className="opacity-20" />
              <p className="text-sm">Select a lead to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Media Library Panel ──────────────────────────────────────────────────────

function MediaPanel() {
  const [images, setImages] = useState<{ id: number; url: string; folder: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchImages = () => {
    setLoading(true);
    fetch(selectedFolder === "all" ? "/api/upload" : `/api/upload?folder=${selectedFolder}`)
      .then(r => r.json())
      .then(data => { setImages(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setImages([]); setLoading(false); });
  };

  useEffect(() => {
    fetchImages();
  }, [selectedFolder]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await apiUpload(file, selectedFolder === "all" ? "misc" : selectedFolder);
      }
      fetchImages();
      alert("✅ Images uploaded successfully to server!");
    } catch {
      alert("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-card flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-heading font-bold text-lg">Server Media Library</h2>
          <p className="text-xs text-muted-foreground">All images uploaded directly to server filesystem (/public/uploads/)</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-xl p-1 text-xs">
            {["all", "tours", "blogs", "misc"].map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFolder(f)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${selectedFolder === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>

          <label className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-2 hover:opacity-90 transition shadow-sm">
            {uploading ? <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary-foreground border-t-transparent" /> : <Plus size={14} />}
            <span>Upload Images</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>

          <button
            type="button"
            onClick={fetchImages}
            title="Refresh"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition border"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
            <span className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            <p className="text-xs">Loading server images…</p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-2xl p-8 text-center">
            <ImageIcon size={48} className="text-muted-foreground/30 mb-3" />
            <p className="font-medium text-sm">No images found in this folder</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Upload images to store them permanently on the server.</p>
            <label className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-2 hover:opacity-90 transition">
              <Plus size={14} /> Upload First Image
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map(img => (
              <div key={img.id} className="group relative bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="aspect-square bg-muted/40 relative overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white rounded-md text-[10px] uppercase font-bold backdrop-blur-sm">
                    {img.folder || "misc"}
                  </span>
                </div>
                <div className="p-2.5 space-y-1.5 bg-card">
                  <p className="text-[11px] font-mono text-muted-foreground truncate" title={img.url}>{img.url.split("/").pop()}</p>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopy(img.url)}
                      className={`w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${copiedUrl === img.url ? "bg-green-600 text-white" : "bg-muted text-foreground hover:bg-muted/80"}`}
                    >
                      {copiedUrl === img.url ? <><Check size={12} /> Copied URL</> : <><Copy size={12} /> Copy URL</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

type Tab = "tours" | "blogs" | "leads" | "media";

export default function AdminPanel() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("Admin");
  const [activeTab, setActiveTab] = useState<Tab>("tours");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getToken();
    if (token) { setLoggedIn(true); setLoggedInUser(token.username || "Admin"); }
  }, []);

  if (!mounted) return null;

  const handleLogin = (user: string) => { setLoggedIn(true); setLoggedInUser(user); };
  const handleLogout = () => {
    localStorage.removeItem("admin_auth_token");
    setLoggedIn(false);
    router.push("/");
  };

  if (!loggedIn) return <LoginScreen onLogin={handleLogin} />;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "tours", label: "Tours", icon: <LayoutDashboard size={15} /> },
    { key: "blogs", label: "Blogs", icon: <FileText size={15} /> },
    { key: "leads", label: "Leads", icon: <MessageCircle size={15} /> },
    { key: "media", label: "Media Library", icon: <ImageIcon size={15} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-sm">
      <aside className="w-56 shrink-0 border-r bg-card flex flex-col">
        <div className="px-5 py-4 border-b">
          <p className="font-heading font-bold text-base">Admin Panel</p>
          <p className="text-xs text-muted-foreground mt-0.5">Hi, {loggedInUser} 👋</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t">
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-hidden">
        {activeTab === "tours" && <ToursPanel />}
        {activeTab === "blogs" && <BlogsPanel />}
        {activeTab === "leads" && <LeadsPanel />}
        {activeTab === "media" && <MediaPanel />}
      </main>
    </div>
  );
}
