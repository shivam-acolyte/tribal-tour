import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db/client";
import { blogs as initialBlogs } from "@/lib/data/blogs";

interface Params { params: Promise<{ slug: string }> }

// ── GET /api/blogs/[slug] ──────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const blog = await queryOne(
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

    if (blog) {
      return NextResponse.json(blog);
    }

    const fallback = initialBlogs.find((b) => b.slug === slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  } catch (err: any) {
    console.error(`[GET /api/blogs/${slug}] DB fallback triggered:`, err?.message || err);
    const fallback = initialBlogs.find((b) => b.slug === slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }
}

// ── PATCH /api/blogs/[slug] ───────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await req.json();

    const map: Record<string, string> = {
      isHidden: "is_hidden", title: "title", excerpt: "excerpt",
      content: "content", image: "image", category: "category",
      author: "author", authorImage: "author_image", authorBio: "author_bio",
      date: "date", readTime: "read_time",
      seoTitle: "seo_title", seoDescription: "seo_description", seoKeywords: "seo_keywords",
    };

    const setClauses: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const [jsKey, dbCol] of Object.entries(map)) {
      if (jsKey in body) {
        setClauses.push(`${dbCol} = $${i}`);
        values.push(body[jsKey]);
        i++;
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(slug);

    await query(`UPDATE blogs SET ${setClauses.join(", ")} WHERE slug = $${i}`, values);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[PATCH /api/blogs/[slug]]", err);
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

// ── DELETE /api/blogs/[slug] ──────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    await query("DELETE FROM blogs WHERE slug = $1", [slug]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /api/blogs/[slug]]", err);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
