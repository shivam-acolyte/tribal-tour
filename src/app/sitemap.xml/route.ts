import { NextResponse } from "next/server";
import { query } from "@/lib/db/client";
import { tours as initialTours } from "@/lib/data/tours";
import { blogs as initialBlogs } from "@/lib/data/blogs";
import { BRAND } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(dateInput: any): string {
  try {
    const d = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

export async function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || BRAND?.url || "https://tribaldiscoverytour.com").replace(/\/+$/, "");
  const today = formatDate(new Date());

  // 1. Core Static Pages
  const staticPages = [
    { path: "", changefreq: "daily", priority: "1.0", lastmod: today },
    { path: "/tours", changefreq: "daily", priority: "0.9", lastmod: today },
    { path: "/destinations", changefreq: "weekly", priority: "0.9", lastmod: today },
    { path: "/activities", changefreq: "weekly", priority: "0.8", lastmod: today },
    { path: "/packages", changefreq: "weekly", priority: "0.8", lastmod: today },
    { path: "/blog", changefreq: "daily", priority: "0.9", lastmod: today },
    { path: "/gallery", changefreq: "weekly", priority: "0.7", lastmod: today },
    { path: "/about", changefreq: "monthly", priority: "0.7", lastmod: today },
    { path: "/contact", changefreq: "monthly", priority: "0.7", lastmod: today },
  ];

  const staticXml = staticPages
    .map(
      (p) => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join("\n");

  // 2. Dynamic Tours (From PostgreSQL, falling back to local dataset)
  let toursList: { slug: string; name?: string; image?: string; updated_at?: any }[] = [];
  try {
    const rows = await query(`
      SELECT slug, name, image, updated_at
      FROM tours
      WHERE COALESCE(is_hidden, false) = false
      ORDER BY updated_at DESC NULLS LAST
    `);
    // Use DB rows if any exist; only fall back if DB returned nothing at all
    toursList = (rows && rows.length > 0) ? rows : initialTours.filter((t) => !t.isHidden);
  } catch (err) {
    console.error("[sitemap.xml] Error querying tours table, falling back to local data:", err);
    // If is_hidden column doesn't exist yet, fetch ALL tours as fallback
    try {
      const allRows = await query(`SELECT slug, name, image, updated_at FROM tours ORDER BY updated_at DESC NULLS LAST`);
      toursList = allRows && allRows.length > 0 ? allRows : initialTours.filter((t) => !t.isHidden);
    } catch {
      toursList = initialTours.filter((t) => !t.isHidden);
    }
  }

  const toursXml = toursList
    .map((tour) => {
      const imgTag = tour.image
        ? `\n    <image:image>
      <image:loc>${escapeXml(tour.image.startsWith("http") ? tour.image : `${baseUrl}${tour.image}`)}</image:loc>
      <image:title>${escapeXml(tour.name || "Tour")}</image:title>
    </image:image>`
        : "";

      return `  <url>
    <loc>${baseUrl}/tours/${escapeXml(tour.slug)}</loc>
    <lastmod>${formatDate(tour.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imgTag}
  </url>`;
    })
    .join("\n");

  // 3. Dynamic Blogs (From PostgreSQL, falling back to local dataset)
  let blogsList: { slug: string; title?: string; image?: string; updated_at?: any }[] = [];
  try {
    const rows = await query(`
      SELECT slug, title, image, updated_at
      FROM blogs
      WHERE COALESCE(is_hidden, false) = false
      ORDER BY updated_at DESC NULLS LAST
    `);
    // Use DB rows if any exist; only fall back if DB returned nothing at all
    blogsList = (rows && rows.length > 0) ? rows : initialBlogs.filter((b) => !b.isHidden);
  } catch (err) {
    console.error("[sitemap.xml] Error querying blogs table, falling back to local data:", err);
    // If is_hidden column doesn't exist yet, fetch ALL published blogs as fallback
    try {
      const allRows = await query(`SELECT slug, title, image, updated_at FROM blogs ORDER BY updated_at DESC NULLS LAST`);
      blogsList = allRows && allRows.length > 0 ? allRows : initialBlogs.filter((b) => !b.isHidden);
    } catch {
      blogsList = initialBlogs.filter((b) => !b.isHidden);
    }
  }

  const blogsXml = blogsList
    .map((blog) => {
      const imgTag = blog.image
        ? `\n    <image:image>
      <image:loc>${escapeXml(blog.image.startsWith("http") ? blog.image : `${baseUrl}${blog.image}`)}</image:loc>
      <image:title>${escapeXml(blog.title || "Blog Post")}</image:title>
    </image:image>`
        : "";

      return `  <url>
    <loc>${baseUrl}/blog/${escapeXml(blog.slug)}</loc>
    <lastmod>${formatDate(blog.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imgTag}
  </url>`;
    })
    .join("\n");

  // Assemble full XML document
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticXml}
${toursXml}
${blogsXml}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
