import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { query } from "@/lib/db/client";

// ── GET /api/upload ────────────────────────────────────────────────────────────
// Returns list of all uploaded images stored on server
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    let rows;
    if (folder) {
      rows = await query(
        "SELECT id, url, folder, created_at FROM images WHERE folder = $1 ORDER BY created_at DESC",
        [folder]
      );
    } else {
      rows = await query("SELECT id, url, folder, created_at FROM images ORDER BY created_at DESC");
    }

    return NextResponse.json(rows);
  } catch (err: any) {
    console.error("[GET /api/upload]", err);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

// ── POST /api/upload ───────────────────────────────────────────────────────────
// Saves image to server filesystem (/public/uploads/[folder]/) & records to PostgreSQL
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "misc";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Build safe filename
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = `${Math.random().toString(36).slice(2)}-${Date.now()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads", folder);
    const filePath = join(uploadDir, safeName);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer);

    // Return public server URL
    const publicUrl = `/uploads/${folder}/${safeName}`;

    // Record in PostgreSQL images table
    try {
      await query(
        "INSERT INTO images (url, folder) VALUES ($1, $2)",
        [publicUrl, folder]
      );
    } catch (dbErr) {
      console.error("[POST /api/upload DB Record Warning]", dbErr);
    }

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error("[POST /api/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
