import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/client";

// ── GET /api/tours ─────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const rows = await query(`
      SELECT
        slug, name, location, duration,
        price::float, original_price::float AS "originalPrice",
        rating::float, review_count AS "reviewCount",
        is_hidden AS "isHidden", image, images, badge, category,
        group_size AS "groupSize", description, highlights,
        included, excluded, itinerary, reviews,
        seo_title AS "seoTitle", seo_description AS "seoDescription",
        seo_keywords AS "seoKeywords"
      FROM tours
      ORDER BY name ASC
    `);
    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("[GET /api/tours]", err);
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 });
  }
}

// ── POST /api/tours ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const t = await req.json();

    if (!t.slug || !t.name) {
      return NextResponse.json({ error: "slug and name are required" }, { status: 400 });
    }

    await query(
      `INSERT INTO tours (
        slug, name, location, duration, price, original_price, rating, review_count,
        is_hidden, image, images, badge, category, group_size, description,
        highlights, included, excluded, itinerary, reviews,
        seo_title, seo_description, seo_keywords, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,
        $16,$17,$18,$19,$20,$21,$22,$23, NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name, location = EXCLUDED.location,
        duration = EXCLUDED.duration, price = EXCLUDED.price,
        original_price = EXCLUDED.original_price, rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count, is_hidden = EXCLUDED.is_hidden,
        image = EXCLUDED.image, images = EXCLUDED.images,
        badge = EXCLUDED.badge, category = EXCLUDED.category,
        group_size = EXCLUDED.group_size, description = EXCLUDED.description,
        highlights = EXCLUDED.highlights, included = EXCLUDED.included,
        excluded = EXCLUDED.excluded, itinerary = EXCLUDED.itinerary,
        reviews = EXCLUDED.reviews, seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description, seo_keywords = EXCLUDED.seo_keywords,
        updated_at = NOW()`,
      [
        t.slug, t.name, t.location, t.duration,
        t.price ?? 0, t.originalPrice ?? 0, t.rating ?? 4.5, t.reviewCount ?? 0,
        t.isHidden ?? false, t.image ?? "",
        JSON.stringify(t.images ?? []),
        t.badge ?? "New", t.category ?? "", t.groupSize ?? "", t.description ?? "",
        JSON.stringify(t.highlights ?? []),
        JSON.stringify(t.included ?? []),
        JSON.stringify(t.excluded ?? []),
        JSON.stringify(t.itinerary ?? []),
        JSON.stringify(t.reviews ?? []),
        t.seoTitle ?? "", t.seoDescription ?? "", t.seoKeywords ?? "",
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[POST /api/tours]", err);
    return NextResponse.json({ error: "Failed to save tour" }, { status: 500 });
  }
}
