import { Metadata } from "next";
import BlogClient from "./BlogClient";
import { PAGE_DEFAULTS } from "@/lib/seo";
import { query } from "@/lib/db/client";
import { blogs as initialBlogs } from "@/lib/data/blogs";
import { BlogPost } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: PAGE_DEFAULTS.blog.title,
  description: PAGE_DEFAULTS.blog.description,
  keywords: PAGE_DEFAULTS.blog.keywords.split(", "),
  alternates: { canonical: "https://www.tribaldiscoverytour.com/blog" },
};

async function getBlogs(): Promise<BlogPost[]> {
  try {
    const rows = await query<BlogPost>(`
      SELECT
        slug, title, excerpt, image, category,
        author, author_image AS "authorImage", author_bio AS "authorBio",
        date, read_time AS "readTime", is_hidden AS "isHidden",
        seo_title AS "seoTitle", seo_description AS "seoDescription",
        seo_keywords AS "seoKeywords"
      FROM blogs
      ORDER BY updated_at DESC
    `);
    if (rows && rows.length > 0) {
      return rows;
    }
  } catch (err) {
    console.error("[BlogPage] Error fetching blogs on server, using fallback:", err);
  }
  return initialBlogs;
}

export default async function BlogPage() {
  const posts = await getBlogs();
  return <BlogClient initialPosts={posts} />;
}
