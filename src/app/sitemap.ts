import type { MetadataRoute } from "next";
import { query } from "@/lib/db/client";
import { tours as initialTours } from "@/lib/data/tours";
import { blogs as initialBlogs } from "@/lib/data/blogs";
import { BRAND } from "@/lib/seo";

export const revalidate = 3600; // Dynamically revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || BRAND.url || "https://tribaldiscoverytour.com").replace(/\/+$/, "");

  // 1. Core Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/activities`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. Dynamic Tours
  let tourEntries: MetadataRoute.Sitemap = [];
  try {
    const tourRows = await query(`
      SELECT slug, updated_at
      FROM tours
      WHERE is_hidden IS NOT TRUE
      ORDER BY updated_at DESC
    `);

    if (tourRows && tourRows.length > 0) {
      tourEntries = tourRows.map((tour: any) => ({
        url: `${baseUrl}/tours/${tour.slug}`,
        lastModified: tour.updated_at ? new Date(tour.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } else {
      tourEntries = initialTours
        .filter((t) => !t.isHidden)
        .map((t) => ({
          url: `${baseUrl}/tours/${t.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }
  } catch (err) {
    console.error("[sitemap] Failed to query tours table, falling back to local data:", err);
    tourEntries = initialTours
      .filter((t) => !t.isHidden)
      .map((t) => ({
        url: `${baseUrl}/tours/${t.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  }

  // 3. Dynamic Blogs
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const blogRows = await query(`
      SELECT slug, updated_at
      FROM blogs
      WHERE is_hidden IS NOT TRUE
      ORDER BY updated_at DESC
    `);

    if (blogRows && blogRows.length > 0) {
      blogEntries = blogRows.map((blog: any) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    } else {
      blogEntries = initialBlogs
        .filter((b) => !b.isHidden)
        .map((b) => ({
          url: `${baseUrl}/blog/${b.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }));
    }
  } catch (err) {
    console.error("[sitemap] Failed to query blogs table, falling back to local data:", err);
    blogEntries = initialBlogs
      .filter((b) => !b.isHidden)
      .map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  }

  return [...staticRoutes, ...tourEntries, ...blogEntries];
}
