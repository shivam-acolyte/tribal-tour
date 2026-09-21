import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/client";

interface Params { params: Promise<{ slug: string }> }

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
