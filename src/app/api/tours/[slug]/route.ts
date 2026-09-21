import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db/client";
import { tours as initialTours } from "@/lib/data/tours";

interface Params { params: Promise<{ slug: string }> }

// ── GET /api/tours/[slug] ──────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const tour = await queryOne(
      `SELECT
        slug, name, location, duration,
        price::float, original_price::float AS "originalPrice",
        rating::float, review_count AS "reviewCount",
        is_hidden AS "isHidden", image, images, badge, category,
        group_size AS "groupSize", description, highlights,
        included, excluded, itinerary, reviews,
        seo_title AS "seoTitle", seo_description AS "seoDescription",
        seo_keywords AS "seoKeywords"
      FROM tours
      WHERE slug = $1`,
      [slug]
    );

    if (tour) {
      return NextResponse.json(tour);
    }

    const fallback = initialTours.find((t) => t.slug === slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  } catch (err: any) {
    console.error(`[GET /api/tours/${slug}] DB fallback triggered:`, err?.message || err);
    const fallback = initialTours.find((t) => t.slug === slug);
    if (fallback) {
      return NextResponse.json(fallback);
    }
    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  }
}

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
