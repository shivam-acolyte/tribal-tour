import { Metadata } from "next";
import BlogPostClient from "./BlogPostClient";
import { blogs } from "@/lib/data/blogs";
import { BRAND } from "@/lib/seo";

import { queryOne } from "@/lib/db/client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

async function getBlog(slug: string) {
  try {
    const row = await queryOne<any>(
      `SELECT
        slug, title, excerpt, content, image, category,
        author, author_image AS "authorImage", author_bio AS "authorBio",
        date, read_time AS "readTime", is_hidden AS "isHidden",
        seo_title AS "seoTitle", seo_description AS "seoDescription",
        seo_keywords AS "seoKeywords"
      FROM blogs
      WHERE slug = $1`,
      [slug]
    );
    if (row) return row;
  } catch (err) {
    console.error("[BlogPostPage] Error fetching blog from db:", err);
  }
  return blogs.find((b) => b.slug === slug) || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) {
    return { title: `Blog Not Found | ${BRAND.name}` };
  }
  return {
    title: blog.seoTitle || `${blog.title} | ${BRAND.name}`,
    description: blog.seoDescription || blog.excerpt,
    keywords: blog.seoKeywords ? blog.seoKeywords.split(", ") : undefined,
    alternates: { canonical: `${BRAND.url}/blog/${blog.slug}` },
    authors: [{ name: blog.author }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.image ? [{ url: blog.image, alt: blog.title }] : [],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  return <BlogPostClient slug={slug} initialBlog={blog} />;
}
