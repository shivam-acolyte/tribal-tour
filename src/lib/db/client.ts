import { Pool } from "pg";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

declare global {
  var _pgPool: Pool | undefined;
  var _pgConnectionString: string | undefined;
}

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Fallback: read directly from .env.local if not loaded into process.env yet
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const idx = trimmed.indexOf("=");
          if (idx > 0) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
            if (key === "DATABASE_URL") {
              process.env.DATABASE_URL = val;
              return val;
            }
          }
        }
      }
    }
  } catch {}

  throw new Error(
    "DATABASE_URL is not set. Add it to your .env.local file.\n" +
    "Example: DATABASE_URL=postgresql://postgres:password@localhost:5432/tribal_tours"
  );
}

function getPool(): Pool {
  const currentUrl = getDatabaseUrl();

  // If pool exists and connection string hasn't changed, reuse it
  if (globalThis._pgPool && globalThis._pgConnectionString === currentUrl) {
    return globalThis._pgPool;
  }

  // If connection string changed, end old pool
  if (globalThis._pgPool) {
    globalThis._pgPool.end().catch(() => {});
  }

  const useSSL =
    currentUrl.includes("sslmode=require") ||
    currentUrl.includes("neon.tech") ||
    currentUrl.includes("supabase.co") ||
    process.env.DATABASE_SSL === "true";

  const newPool = new Pool({
    connectionString: currentUrl,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  globalThis._pgPool = newPool;
  globalThis._pgConnectionString = currentUrl;
  return newPool;
}

// Export default pool getter proxy for compatibility
const poolProxy = new Proxy({} as Pool, {
  get(_target, prop) {
    const p = getPool() as any;
    const val = p[prop];
    if (typeof val === "function") {
      return val.bind(p);
    }
    return val;
  },
});

export default poolProxy;

// Helper: run a query with auto-release
export async function query<T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> {
  const p = getPool();
  const client = await p.connect();
  try {
    const result = await client.query(sql, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

// Helper: run a query and return first row or null
export async function queryOne<T = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
