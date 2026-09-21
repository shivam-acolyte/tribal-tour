import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/client";

// ── GET /api/blogs ─────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const rows = await query(`
      SELECT
        slug, title, excerpt, content, image, category,
        author, author_image AS "authorImage", author_bio AS "authorBio",
        date, read_time AS "readTime", is_hidden AS "isHidden",
        seo_title AS "seoTitle", seo_description AS "seoDescription",
        seo_keywords AS "seoKeywords"
      FROM blogs
      ORDER BY updated_at DESC
    `);
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("[GET /api/blogs]", err);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

// ── POST /api/blogs ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const b = await req.json();

    if (!b.slug || !b.title) {
      return NextResponse.json({ error: "slug and title are required" }, { status: 400 });
    }

    await query(
      `INSERT INTO blogs (
        slug, title, excerpt, content, image, category,
        author, author_image, author_bio, date, read_time,
        is_hidden, seo_title, seo_description, seo_keywords, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title, excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content, image = EXCLUDED.image,
        category = EXCLUDED.category, author = EXCLUDED.author,
        author_image = EXCLUDED.author_image, author_bio = EXCLUDED.author_bio,
        date = EXCLUDED.date, read_time = EXCLUDED.read_time,
        is_hidden = EXCLUDED.is_hidden, seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords,
        updated_at = NOW()`,
      [
        b.slug, b.title, b.excerpt ?? "", b.content ?? "", b.image ?? "",
        b.category ?? "Destinations", b.author ?? "Admin User",
        b.authorImage ?? "", b.authorBio ?? "",
        b.date ?? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        b.readTime ?? "5 min read",
        b.isHidden ?? false,
        b.seoTitle ?? "", b.seoDescription ?? "", b.seoKeywords ?? "",
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[POST /api/blogs]", err);
    return NextResponse.json({ error: "Failed to save blog" }, { status: 500 });
  }
}
