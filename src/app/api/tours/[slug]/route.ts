import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db/client";

interface Params { params: Promise<{ slug: string }> }

// ── PATCH /api/tours/[slug] ────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await req.json();

    // Build dynamic SET clause from provided fields
    const map: Record<string, string> = {
      isHidden: "is_hidden", name: "name", location: "location",
      duration: "duration", price: "price", originalPrice: "original_price",
      rating: "rating", reviewCount: "review_count", image: "image",
      images: "images", badge: "badge", category: "category",
      groupSize: "group_size", description: "description",
      highlights: "highlights", included: "included", excluded: "excluded",
      itinerary: "itinerary", reviews: "reviews",
      seoTitle: "seo_title", seoDescription: "seo_description", seoKeywords: "seo_keywords",
    };

    const setClauses: string[] = [];
    const values: any[] = [];
    let i = 1;

    for (const [jsKey, dbCol] of Object.entries(map)) {
      if (jsKey in body) {
        const val = typeof body[jsKey] === "object" ? JSON.stringify(body[jsKey]) : body[jsKey];
        setClauses.push(`${dbCol} = $${i}`);
        values.push(val);
        i++;
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(slug);

    await query(`UPDATE tours SET ${setClauses.join(", ")} WHERE slug = $${i}`, values);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[PATCH /api/tours/[slug]]", err);
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
  }
}

// ── DELETE /api/tours/[slug] ───────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    await query("DELETE FROM tours WHERE slug = $1", [slug]);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /api/tours/[slug]]", err);
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}
