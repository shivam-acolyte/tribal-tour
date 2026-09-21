import { Pool } from "pg";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import { writeFile, mkdir } from "fs/promises";
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
  console.error("❌ DATABASE_URL is not set in .env.local");
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

async function downloadImage(url: string, targetDir: string, baseName: string): Promise<string | null> {
  if (!url || typeof url !== "string") return null;
  // If already a local server path, skip
  if (url.startsWith("/uploads/") || url.startsWith("/gallery/")) {
    return url;
  }

  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      console.warn(`  ⚠️ Failed to fetch ${url} (status: ${res.status})`);
      return url;
    }

    const contentType = res.headers.get("content-type") || "";
    let ext = "jpg";
    if (contentType.includes("webp")) ext = "webp";
    else if (contentType.includes("png")) ext = "png";
    else if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = "jpg";

    const fileName = `${baseName}.${ext}`;
    await mkdir(targetDir, { recursive: true });
    const filePath = join(targetDir, fileName);

    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(filePath, buffer);

    const folder = targetDir.split(/[\\/]/).pop();
    const serverUrl = `/uploads/${folder}/${fileName}`;
    return serverUrl;
  } catch (err: any) {
    console.warn(`  ⚠️ Error downloading ${url}:`, err.message);
    return url;
  }
}

async function main() {
  const client = await pool.connect();
  try {
    console.log("🚀 Starting Image Migration to Server Storage (/public/uploads/)...");

    const toursDir = resolve(process.cwd(), "public/uploads/tours");
    const blogsDir = resolve(process.cwd(), "public/uploads/blogs");
    await mkdir(toursDir, { recursive: true });
    await mkdir(blogsDir, { recursive: true });

    // ─── 1. Migrate Tour Images ────────────────────────────────────────────────
    console.log(`\n📦 Processing ${tours.length} Tours...`);
    const updatedTours = [];

    for (let i = 0; i < tours.length; i++) {
      const t = { ...tours[i] };
      const slug = t.slug || `tour-${i}`;
      console.log(`[${i + 1}/${tours.length}] Migrating images for: ${t.name}`);

      // Main featured image
      if (t.image && (t.image.startsWith("http://") || t.image.startsWith("https://"))) {
        const localImg = await downloadImage(t.image, toursDir, `${slug}-main`);
        if (localImg) t.image = localImg;
      }

      // Gallery images
      if (Array.isArray(t.images)) {
        const newGallery = [];
        for (let j = 0; j < t.images.length; j++) {
          const gUrl = t.images[j];
          if (gUrl && (gUrl.startsWith("http://") || gUrl.startsWith("https://"))) {
            const localG = await downloadImage(gUrl, toursDir, `${slug}-gallery-${j + 1}`);
            newGallery.push(localG || gUrl);
          } else {
            newGallery.push(gUrl);
          }
        }
        t.images = newGallery;
      }

      updatedTours.push(t);

      // Update in PostgreSQL
      await client.query(
        `UPDATE tours SET image = $1, images = $2 WHERE slug = $3`,
        [t.image, JSON.stringify(t.images), t.slug]
      );
    }

    // Save updated tours to src/lib/data/tours.ts
    const toursCode = `import { Tour } from "../types";\n\nexport const tours: Tour[] = ${JSON.stringify(updatedTours, null, 2)};\n`;
    writeFileSync(resolve(process.cwd(), "src/lib/data/tours.ts"), toursCode, "utf-8");
    console.log("✅ All tour images migrated to server filesystem & PostgreSQL updated!");

    // ─── 2. Migrate Blog Images ────────────────────────────────────────────────
    console.log(`\n📝 Processing ${blogs.length} Blogs...`);
    const updatedBlogs = [];

    for (let i = 0; i < blogs.length; i++) {
      const b = { ...blogs[i] };
      const slug = b.slug || `blog-${i}`;
      console.log(`[${i + 1}/${blogs.length}] Migrating images for: ${b.title}`);

      // Cover image
      if (b.image && (b.image.startsWith("http://") || b.image.startsWith("https://"))) {
        const localImg = await downloadImage(b.image, blogsDir, `${slug}-cover`);
        if (localImg) b.image = localImg;
      }

      // Author image
      if (b.authorImage && (b.authorImage.startsWith("http://") || b.authorImage.startsWith("https://"))) {
        const localAuth = await downloadImage(b.authorImage, blogsDir, `${slug}-author`);
        if (localAuth) b.authorImage = localAuth;
      }

      updatedBlogs.push(b);

      // Update in PostgreSQL
      await client.query(
        `UPDATE blogs SET image = $1, author_image = $2 WHERE slug = $3`,
        [b.image, b.authorImage, b.slug]
      );
    }

    // Save updated blogs to src/lib/data/blogs.ts
    const blogsCode = `import { BlogPost } from "../types";\n\nexport const blogs: BlogPost[] = ${JSON.stringify(updatedBlogs, null, 2)};\n`;
    writeFileSync(resolve(process.cwd(), "src/lib/data/blogs.ts"), blogsCode, "utf-8");
    console.log("✅ All blog images migrated to server filesystem & PostgreSQL updated!");

    console.log("\n🎉 ALL IMAGES ARE NOW HOSTED DIRECTLY ON YOUR SERVER FILESYSTEM (/public/uploads/)!");
  } catch (err: any) {
    console.error("❌ Migration error:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
