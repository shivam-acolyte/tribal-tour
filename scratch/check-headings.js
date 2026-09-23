const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function check() {
  const res = await pool.query("SELECT content FROM blogs WHERE slug = 'arunachal-pradesh-tourist-places'");
  if (res.rows.length > 0) {
    const content = res.rows[0].content;
    console.log("Total length:", content.length);
    console.log("First 2000 chars:\n", content.slice(0, 2000));
    // Let's check for heading tags
    const h1s = content.match(/<h1[^>]*>.*?<\/h1>/gi) || [];
    const h2s = content.match(/<h2[^>]*>.*?<\/h2>/gi) || [];
    const h3s = content.match(/<h3[^>]*>.*?<\/h3>/gi) || [];
    const h4s = content.match(/<h4[^>]*>.*?<\/h4>/gi) || [];
    console.log("Found h1 count:", h1s.length);
    console.log("Found h2 count:", h2s.length, h2s.slice(0, 3));
    console.log("Found h3 count:", h3s.length, h3s.slice(0, 3));
    console.log("Found h4 count:", h4s.length);
  }
  pool.end();
}
check();
