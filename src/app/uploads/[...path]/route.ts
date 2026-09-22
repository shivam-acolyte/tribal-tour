import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db/client";
import { join } from "path";
import { existsSync, readFileSync } from "fs";

interface RouteProps {
  params: Promise<{ path: string[] }>;
}

// ── GET /uploads/[...path] ─────────────────────────────────────────────────────
// Fallback route for /uploads/* paths:
// 1. Checks local filesystem if physical file exists
// 2. If not on disk (e.g. on serverless Vercel), queries PostgreSQL images table for data BYTEA
export async function GET(_req: NextRequest, { params }: RouteProps) {
  try {
    const { path: segments } = await params;
    if (!segments || !segments.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const relativePath = segments.join("/");
    const dbUrl = `/uploads/${relativePath}`;

    // 1. Try local filesystem if file physically exists on disk
    try {
      const localFile = join(process.cwd(), "public", "uploads", ...segments);
      if (existsSync(localFile)) {
        const fileBuf = readFileSync(localFile);
        const ext = segments[segments.length - 1].split(".").pop()?.toLowerCase() || "jpg";
        const mime = ext === "png"
          ? "image/png"
          : ext === "webp"
          ? "image/webp"
          : ext === "svg"
          ? "image/svg+xml"
          : "image/jpeg";

        return new NextResponse(fileBuf, {
          status: 200,
          headers: {
            "Content-Type": mime,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {}

    // 2. Query PostgreSQL images table by URL or filename
    const filename = segments[segments.length - 1];
    const row = await queryOne(
      "SELECT data, mime_type FROM images WHERE url = $1 OR filename = $2",
      [dbUrl, filename]
    );

    if (row && row.data) {
      const buffer = Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": row.mime_type || "image/jpeg",
          "Content-Length": String(buffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new NextResponse("Image Not Found", { status: 404 });
  } catch (err: any) {
    console.error("[GET /uploads] Error:", err);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
