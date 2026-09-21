import pg from "pg";
import { readFileSync } from "fs";

const env = readFileSync(".env.local", "utf-8");
const match = env.match(/DATABASE_URL=(.+)/);
const pool = new pg.Pool({ connectionString: match[1].trim() });

async function run() {
  const result = await pool.query(
    "INSERT INTO leads (name, email, phone, subject, message, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    ["Aarav Sharma", "aarav.sharma@example.com", "+91 98765 43210", "Nagaland Hornbill Festival Tour", "Looking for 5 days package for family.", "New"]
  );
  console.log("✅ Successfully inserted lead into PostgreSQL:", result.rows[0]);

  const all = await pool.query("SELECT id, name, email, phone, subject, status, created_at FROM leads");
  console.log("📋 All leads in database:", all.rows);

  await pool.end();
}

run();
