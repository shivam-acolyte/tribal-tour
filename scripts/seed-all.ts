import { Pool } from "pg";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { tours } from "../src/lib/data/tours";
import { blogs } from "../src/lib/data/blogs";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

const useSSL =
  DATABASE_URL.includes("sslmode=require") ||
  DATABASE_URL.includes("neon.tech") ||
  DATABASE_URL.includes("supabase.co") ||
  process.env.DATABASE_SSL === "true";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

async function main() {
  const client = await pool.connect();
  try {
    console.log("🔄 Ensuring schema tables...");
    const schemaSql = readFileSync(resolve(process.cwd(), "src/lib/db/schema.sql"), "utf-8");
    await client.query(schemaSql);

    console.log(`📦 Seeding ${tours.length} tours into PostgreSQL...`);
    let tourCount = 0;
    for (const t of tours) {
      await client.query(
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
          t.slug,
          t.name,
          t.location || "",
          t.duration || "",
          t.price ?? 0,
          t.originalPrice ?? 0,
          t.rating ?? 4.5,
          t.reviewCount ?? 0,
          t.isHidden ?? false,
          t.image || "",
          JSON.stringify(t.images ?? []),
          t.badge || "New",
          t.category || "",
          t.groupSize || "",
          t.description || "",
          JSON.stringify(t.highlights ?? []),
          JSON.stringify(t.included ?? []),
          JSON.stringify(t.excluded ?? []),
          JSON.stringify(t.itinerary ?? []),
          JSON.stringify(t.reviews ?? []),
          t.seoTitle || "",
          t.seoDescription || "",
          t.seoKeywords || "",
        ]
      );
      tourCount++;
    }
    console.log(`✅ Successfully seeded ${tourCount} tours!`);

    console.log(`📝 Seeding ${blogs.length} blogs into PostgreSQL...`);
    let blogCount = 0;
    for (const b of blogs) {
      await client.query(
        `INSERT INTO blogs (
          slug, title, excerpt, content, image, category, author,
          author_image, author_bio, date, read_time, is_hidden,
          seo_title, seo_description, seo_keywords, updated_at
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
          seo_description = EXCLUDED.seo_description,
          seo_keywords = EXCLUDED.seo_keywords, updated_at = NOW()`,
        [
          b.slug,
          b.title,
          b.excerpt || "",
          b.content || "",
          b.image || "",
          b.category || "Destinations",
          b.author || "Admin",
          b.authorImage || "",
          b.authorBio || "",
          b.date || new Date().toLocaleDateString(),
          b.readTime || "5 min read",
          b.isHidden ?? false,
          b.seoTitle || "",
          b.seoDescription || "",
          b.seoKeywords || "",
        ]
      );
      blogCount++;
    }
    console.log(`✅ Successfully seeded ${blogCount} blogs!`);

    // Verify counts
    const toursRes = await client.query("SELECT count(*) FROM tours");
    const blogsRes = await client.query("SELECT count(*) FROM blogs");
    const leadsRes = await client.query("SELECT count(*) FROM leads");
    console.log("\n📊 PostgreSQL Database Summary:");
    console.log(`  - Total Tours: ${toursRes.rows[0].count}`);
    console.log(`  - Total Blogs: ${blogsRes.rows[0].count}`);
    console.log(`  - Total Leads: ${leadsRes.rows[0].count}`);
    console.log("\n🎉 All existing data is now in PostgreSQL!");
  } catch (err: any) {
    console.error("❌ Seed error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
