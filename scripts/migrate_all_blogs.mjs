import pg from "pg";
import { writeFile } from "fs/promises";
import { join } from "path";

const { Pool } = pg;

const SUPABASE_URL = "https://gwjzpcsccgbhaqolpsqi.supabase.co";
const SUPABASE_KEY = "sb_publishable_CdC0dTy1KUMopUSItAu4TQ_BsP0u5F_";
const DATABASE_URL = "postgresql://acolyte:acolyte%401234@165.99.228.81:6432/terra_x_nexus";

async function main() {
  console.log("Fetching all blogs from Supabase...");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blogs?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from Supabase: ${res.statusText}`);
  }

  const sbBlogs = await res.json();
  console.log(`Fetched ${sbBlogs.length} blogs from Supabase.`);

  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        slug            TEXT PRIMARY KEY,
        title           TEXT        NOT NULL,
        excerpt         TEXT,
        content         TEXT,
        image           TEXT,
        category        TEXT        DEFAULT 'Destinations',
        author          TEXT,
        author_image    TEXT,
        author_bio      TEXT,
        date            TEXT,
        read_time       TEXT,
        is_hidden       BOOLEAN     DEFAULT FALSE,
        seo_title       TEXT,
        seo_description TEXT,
        seo_keywords    TEXT,
        updated_at      TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const cleanedBlogs = [];

    for (const b of sbBlogs) {
      const slug = (b.slug || "").trim();
      const title = (b.title || "").trim();
      if (!slug || !title) continue;

      const excerpt = b.excerpt || "";
      const content = b.content || "";
      const image = b.image || "";
      const category = b.category || "Destinations";
      const author = b.author || "Admin User";
      const authorImage = b.authorImage || b.author_image || "";
      const authorBio = b.authorBio || b.author_bio || "";
      const date = b.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const readTime = b.readTime || b.read_time || "5 min read";
      const isHidden = Boolean(b.isHidden || b.is_hidden);
      const seoTitle = b.seoTitle || b.seo_title || title;
      const seoDescription = b.seoDescription || b.seo_description || excerpt;
      const seoKeywords = b.seoKeywords || b.seo_keywords || "";

      await pool.query(
        `INSERT INTO blogs (
          slug, title, excerpt, content, image, category,
          author, author_image, author_bio, date, read_time,
          is_hidden, seo_title, seo_description, seo_keywords, updated_at
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, NOW()
        )
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          image = EXCLUDED.image,
          category = EXCLUDED.category,
          author = EXCLUDED.author,
          author_image = EXCLUDED.author_image,
          author_bio = EXCLUDED.author_bio,
          date = EXCLUDED.date,
          read_time = EXCLUDED.read_time,
          is_hidden = EXCLUDED.is_hidden,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          seo_keywords = EXCLUDED.seo_keywords,
          updated_at = NOW();`,
        [
          slug, title, excerpt, content, image, category,
          author, authorImage, authorBio, date, readTime,
          isHidden, seoTitle, seoDescription, seoKeywords,
        ]
      );

      cleanedBlogs.push({
        slug,
        title,
        excerpt,
        content,
        image,
        category,
        author,
        authorImage,
        authorBio,
        date,
        readTime,
        isHidden,
        seoTitle,
        seoDescription,
        seoKeywords,
      });

      console.log(`✓ Migrated: ${title} (${slug})`);
    }

    const countRes = await pool.query("SELECT COUNT(*) FROM blogs");
    console.log(`\n🎉 Total blogs now in PostgreSQL: ${countRes.rows[0].count}`);

    // Update src/lib/data/blogs.ts
    const blogsTsPath = join(process.cwd(), "src", "lib", "data", "blogs.ts");
    const blogsTsContent = `import { BlogPost } from "../types";\n\nexport const blogs: BlogPost[] = ${JSON.stringify(cleanedBlogs, null, 2)};\n`;
    await writeFile(blogsTsPath, blogsTsContent, "utf-8");
    console.log(`✓ Updated ${blogsTsPath} with ${cleanedBlogs.length} blogs.`);

  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
