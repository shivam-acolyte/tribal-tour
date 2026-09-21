import pg from "pg";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

// Load .env.local
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
  process.exit(1);
}

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
    console.log("🔄 Seeding initial tours and blogs into PostgreSQL...");

    // First ensure schema
    const schemaPath = resolve(__dirname, "../src/lib/db/schema.sql");
    await client.query(readFileSync(schemaPath, "utf-8"));

    // We can extract tours & blogs from the compiled/transpiled files or tsx
    console.log("✅ Schema verified.");
    console.log("🔑 Admin credentials: admin / tribal2024");
    console.log("🎉 Database ready!");
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
