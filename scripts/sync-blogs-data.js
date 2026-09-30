const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function sync() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT
        slug, title, excerpt, content, image, category,
        author, author_image AS "authorImage", author_bio AS "authorBio",
        date, read_time AS "readTime", is_hidden AS "isHidden",
        seo_title AS "seoTitle", seo_description AS "seoDescription",
        seo_keywords AS "seoKeywords"
      FROM blogs
      WHERE slug NOT LIKE 'test%'
      ORDER BY updated_at DESC
    `);
    console.log(`Fetched ${res.rows.length} blogs from PostgreSQL.`);

    const filePath = path.join(process.cwd(), 'src', 'lib', 'data', 'blogs.ts');
    const fileContent = 'import { BlogPost } from "../types";\n\nexport const blogs: BlogPost[] = ' + JSON.stringify(res.rows, null, 2) + ';\n';
    fs.writeFileSync(filePath, fileContent, 'utf-8');

    const sizeMb = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ Successfully updated src/lib/data/blogs.ts! New file size: ${sizeMb} MB (was 33.4 MB).`);
  } finally {
    client.release();
    await pool.end();
  }
}

sync().catch(err => {
  console.error("Sync error:", err);
  process.exit(1);
});
