import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { query } from "@/lib/db/client";

/**
 * Compresses any raster image to WebP format.
 * - Resizes images exceeding 1920px max dimension down to fit inside 1920x1920
 * - Automatically auto-rotates based on EXIF metadata
 * - Compresses with WebP quality 80 for optimal fidelity and minimal file size
 * - Preserves vector SVG images as-is
 */
async function compressImageToWebp(
  buffer: Buffer,
  mimeType: string,
  ext: string
): Promise<{
  buffer: Buffer;
  mimeType: string;
  ext: string;
  size: number;
}> {
  if (mimeType === "image/svg+xml" || ext === "svg") {
    return {
      buffer,
      mimeType: "image/svg+xml",
      ext: "svg",
      size: buffer.length,
    };
  }

  try {
    const webpBuffer = await sharp(buffer)
      .rotate()
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
        effort: 4,
      })
      .toBuffer();

    return {
      buffer: webpBuffer,
      mimeType: "image/webp",
      ext: "webp",
      size: webpBuffer.length,
    };
  } catch (err) {
    console.warn("[Upload Compressor] Sharp conversion failed, falling back to original:", err);
    return {
      buffer,
      mimeType,
      ext,
      size: buffer.length,
    };
  }
}

// ── GET /api/upload ────────────────────────────────────────────────────────────
// Returns list of all uploaded images stored in PostgreSQL (excluding heavy BYTEA data)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    let rows;
    if (folder && folder !== "all") {
      rows = await query(
        "SELECT id, url, folder, filename, size, created_at FROM images WHERE folder = $1 ORDER BY created_at DESC",
        [folder]
      );
    } else {
      rows = await query(
        "SELECT id, url, folder, filename, size, created_at FROM images ORDER BY created_at DESC"
      );
    }

    return NextResponse.json(rows || []);
  } catch (err: any) {
    console.error("[GET /api/upload]", err);
    return NextResponse.json({ error: err?.message || "Failed to fetch images" }, { status: 500 });
  }
}

// ── POST /api/upload ───────────────────────────────────────────────────────────
// Compresses, converts image to WebP, and saves to PostgreSQL & local disk
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = ((formData.get("folder") as string) || "misc").replace(/[^a-zA-Z0-9_-]/g, "");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Extract filename and extension
    const originalName = file.name || "image.jpg";
    const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
    const isImageMime = file.type && file.type.startsWith("image/");
    const isImageExt = ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif", "bmp", "ico"].includes(ext);

    if (!isImageMime && !isImageExt) {
      return NextResponse.json({ error: "Only image files are allowed (.jpg, .png, .webp, .gif, .svg)" }, { status: 400 });
    }

    // Limit to 25MB input
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum allowed size is 25MB." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const rawBuffer = Buffer.from(bytes);

    const initialMimeType = isImageMime
      ? file.type
      : ext === "png"
      ? "image/png"
      : ext === "webp"
      ? "image/webp"
      : ext === "gif"
      ? "image/gif"
      : ext === "svg"
      ? "image/svg+xml"
      : "image/jpeg";

    // Compress & convert to optimized WebP
    const compressed = await compressImageToWebp(rawBuffer, initialMimeType, ext);

    // Build sanitized safe unique filename with .webp (or .svg)
    const cleanBase = originalName
      .substring(0, originalName.lastIndexOf(".") > 0 ? originalName.lastIndexOf(".") : originalName.length)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 32);
    const safeName = `${cleanBase || "img"}-${Math.random().toString(36).slice(2, 8)}-${Date.now()}.${compressed.ext}`;

    // 1. Try writing compressed file to local disk
    try {
      const uploadDir = join(process.cwd(), "public", "uploads", folder);
      const filePath = join(uploadDir, safeName);
      await mkdir(uploadDir, { recursive: true });
      await writeFile(filePath, compressed.buffer);
    } catch {
      // Non-blocking: expected in serverless / Vercel read-only filesystem
    }

    // 2. Save compressed WebP directly to PostgreSQL BYTEA column
    const initialUrl = `/uploads/${folder}/${safeName}`;
    const insertResult = await query(
      `INSERT INTO images (url, folder, mime_type, filename, size, data)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [initialUrl, folder, compressed.mimeType, safeName, compressed.size, compressed.buffer]
    );

    const insertedId = insertResult[0]?.id;
    // Format final public image URL: /api/images/[id]/[safeName]
    const publicUrl = insertedId ? `/api/images/${insertedId}/${safeName}` : initialUrl;

    if (insertedId) {
      try {
        await query("UPDATE images SET url = $1 WHERE id = $2", [publicUrl, insertedId]);
      } catch {}

      // Pre-populate disk cache so the very first load serves instantly with zero processing
      try {
        const cacheDir = join(process.cwd(), "public", "uploads", "cache");
        const cacheKey = `${insertedId}_${safeName.replace(/[^a-zA-Z0-9_-]/g, "_")}.webp`;
        await mkdir(cacheDir, { recursive: true });
        await writeFile(join(cacheDir, cacheKey), compressed.buffer);
      } catch {}
    }

    return NextResponse.json({ success: true, url: publicUrl, id: insertedId });
  } catch (err: any) {
    console.error("[POST /api/upload Fatal]", err);
    return NextResponse.json({ error: err?.message || "Internal upload error" }, { status: 500 });
  }
}

// ── DELETE /api/upload ─────────────────────────────────────────────────────────
// Deletes an image by id or url from PostgreSQL and disk
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const url = searchParams.get("url");

    if (!id && !url) {
      return NextResponse.json({ error: "Missing id or url parameter" }, { status: 400 });
    }

    // 1. Try local disk cleanup if applicable
    if (url && url.startsWith("/uploads/")) {
      try {
        const filePath = join(process.cwd(), "public", url);
        await unlink(filePath);
      } catch {}
    }

    // 2. Delete from PostgreSQL
    if (id) {
      await query("DELETE FROM images WHERE id = $1", [parseInt(id, 10)]);
    } else if (url) {
      await query("DELETE FROM images WHERE url = $1", [url]);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[DELETE /api/upload]", err);
    return NextResponse.json({ error: err?.message || "Delete failed" }, { status: 500 });
  }
}
