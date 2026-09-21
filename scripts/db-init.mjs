import pg from "pg";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

// Load .env.local manually if exists
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
  console.error("\n❌ DATABASE_URL is not configured in .env.local");
  console.error("👉 Please add DATABASE_URL=postgresql://postgres:password@localhost:5432/tribal_tours to .env.local\n");
  process.exit(1);
}

console.log("🔄 Connecting to PostgreSQL database...");

const useSSL = 
  DATABASE_URL.includes("sslmode=require") ||
  DATABASE_URL.includes("neon.tech") ||
  DATABASE_URL.includes("supabase.co") ||
  process.env.DATABASE_SSL === "true";

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
});

async function main() {
  const client = await pool.connect();
  try {
    console.log("✅ Connected successfully!");

    // Read and run schema.sql
    const schemaPath = resolve(__dirname, "../src/lib/db/schema.sql");
    const schemaSql = readFileSync(schemaPath, "utf-8");

    console.log("🔄 Executing schema.sql to create/verify tables...");
    await client.query(schemaSql);
    console.log("✅ Schema initialized (admins, tours, blogs, leads, images)!");

    // Verify admin
    const adminCheck = await client.query("SELECT username FROM admins WHERE username = 'admin'");
    if (adminCheck.rows.length > 0) {
      console.log("🔑 Default Admin account verified: username = admin");
    }

    // Check tours count
    const toursCheck = await client.query("SELECT COUNT(*) as count FROM tours");
    console.log(`📦 Tours in database: ${toursCheck.rows[0].count}`);

    // Check blogs count
    const blogsCheck = await client.query("SELECT COUNT(*) as count FROM blogs");
    console.log(`📝 Blogs in database: ${blogsCheck.rows[0].count}`);

    console.log("\n🎉 Database setup complete and ready to use!\n");
  } catch (err) {
    console.error("❌ Database initialization error:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
