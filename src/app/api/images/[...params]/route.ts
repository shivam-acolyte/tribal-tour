import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db/client";

interface RouteProps {
  params: Promise<{ params: string[] }>;
}

// ── GET /api/images/[...params] ────────────────────────────────────────────────
// Serves image binary from PostgreSQL BYTEA column
export async function GET(_req: NextRequest, { params }: RouteProps) {
  try {
    const resolved = await params;
    const pathSegments = resolved?.params || [];
    if (!pathSegments.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Case 1: First segment is numeric ID: /api/images/15 or /api/images/15/kaziranga.webp
    const first = pathSegments[0];
    const isNumericId = /^\d+$/.test(first);

    let row: any = null;
    if (isNumericId) {
      row = await queryOne(
        "SELECT data, mime_type, filename, size FROM images WHERE id = $1",
        [parseInt(first, 10)]
      );
    }

    // Case 2: Query by filename or url suffix if not numeric
    if (!row) {
      const last = pathSegments[pathSegments.length - 1];
      row = await queryOne(
        "SELECT data, mime_type, filename, size FROM images WHERE filename = $1 OR url LIKE $2",
        [last, `%${last}`]
      );
    }

    if (!row || !row.data) {
      return new NextResponse("Image Not Found", { status: 404 });
    }

    const buffer = Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data);
    const mimeType = row.mime_type || "image/jpeg";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(buffer.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err: any) {
    console.error("[GET /api/images] Error:", err);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
