import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { query } from "@/lib/db/client";
import { blogs as initialBlogs } from "@/lib/data/blogs";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

// ── GET /api/blogs ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : null;
    const category = searchParams.get("category");
    const includeContent = searchParams.get("includeContent") === "true";

    const contentSelect = includeContent ? ", content" : "";
    let sql = `
      SELECT
        slug, title, excerpt${contentSelect}, image, category,
        author, author_image AS "authorImage", author_bio AS "authorBio",
        date, read_time AS "readTime", is_hidden AS "isHidden",
        seo_title AS "seoTitle", seo_description AS "seoDescription",
        seo_keywords AS "seoKeywords"
      FROM blogs
    `;
    const params: any[] = [];
    const conditions: string[] = [];

    if (category && category !== "All") {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    sql += ` ORDER BY updated_at DESC`;

    if (limit && limit > 0) {
      params.push(limit);
      sql += ` LIMIT $${params.length}`;
    }

    const rows = await query(sql, params);
    if (rows && rows.length > 0) {
      return NextResponse.json(rows, { headers: noCacheHeaders });
    }
    return NextResponse.json(initialBlogs, { headers: noCacheHeaders });
  } catch (err: any) {
    console.error("[GET /api/blogs] DB fallback triggered:", err?.message || err);
    return NextResponse.json(initialBlogs, { headers: noCacheHeaders });
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

    try {
      revalidatePath("/blog");
      revalidatePath(`/blog/${b.slug}`);
      revalidatePath("/");
      revalidatePath("/api/blogs");
    } catch {}

    // Persist to local data/blogs.ts so fallback data stays up-to-date
    try {
      const blogsFilePath = join(process.cwd(), "src", "lib", "data", "blogs.ts");
      if (existsSync(blogsFilePath)) {
        const allBlogs = await query(`
          SELECT
            slug, title, excerpt, content, image, category,
            author, author_image AS "authorImage", author_bio AS "authorBio",
            date, read_time AS "readTime", is_hidden AS "isHidden",
            seo_title AS "seoTitle", seo_description AS "seoDescription",
            seo_keywords AS "seoKeywords"
          FROM blogs
          ORDER BY updated_at DESC
        `);
        if (allBlogs && allBlogs.length > 0) {
          await writeFile(
            blogsFilePath,
            `import { BlogPost } from "../types";\n\nexport const blogs: BlogPost[] = ${JSON.stringify(allBlogs, null, 2)};\n`,
            "utf-8"
          );
        }
      }
    } catch {}

    return NextResponse.json({ success: true, slug: b.slug });
  } catch (err: any) {
    console.error("[POST /api/blogs]", err);
    return NextResponse.json({ error: "Failed to save blog" }, { status: 500 });
  }
}
