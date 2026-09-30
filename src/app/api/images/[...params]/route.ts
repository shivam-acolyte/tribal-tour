import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir, stat } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { createRequire } from "module";
import sharp from "sharp";
import { queryOne } from "@/lib/db/client";

const nodeRequire = createRequire(import.meta.url);
const nodeFs = nodeRequire("fs") as typeof import("fs");

interface RouteProps {
  params: Promise<{ params: string[] }>;
}

interface ImageMeta {
  id: number;
  filename: string | null;
  folder: string | null;
  mime_type: string | null;
}

const metaCache = new Map<string, ImageMeta>();

async function loadLocalImageBuffer(filename: string, folder?: string | null): Promise<Buffer | null> {
  if (!filename) return null;
  const baseUploads = join(process.cwd(), "public", "uploads");
  const candidates: string[] = [];

  if (folder) {
    candidates.push(join(baseUploads, folder, filename));
  }
  candidates.push(
    join(baseUploads, "blogs", filename),
    join(baseUploads, "tours", filename),
    join(baseUploads, filename)
  );

  for (const p of candidates) {
    try {
      if (existsSync(p)) {
        return await nodeFs.promises.readFile(p);
      }
    } catch {}
  }
  return null;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const resolved = await params;
    const pathSegments = resolved?.params || [];
    if (!pathSegments.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const first = pathSegments[0];
    const isNumericId = /^\d+$/.test(first);
    const idKey = isNumericId ? first : pathSegments.join("/");

    // 1. Get image metadata (cached in memory or DB)
    let meta: ImageMeta | undefined = metaCache.get(idKey);
    if (!meta) {
      if (isNumericId) {
        const row = await queryOne<ImageMeta>(
          "SELECT id, filename, folder, mime_type FROM images WHERE id = $1",
          [parseInt(first, 10)]
        );
        if (row) {
          meta = row;
          metaCache.set(idKey, row);
        }
      } else {
        const last = pathSegments[pathSegments.length - 1];
        const row = await queryOne<ImageMeta>(
          "SELECT id, filename, folder, mime_type FROM images WHERE filename = $1 OR url LIKE $2",
          [last, `%${last}`]
        );
        if (row) {
          meta = row;
          metaCache.set(idKey, row);
        }
      }
    }

    const filename = meta?.filename || (pathSegments.length > 1 ? pathSegments[pathSegments.length - 1] : null);
    const folder = meta?.folder || "blogs";
    const cacheDir = join(process.cwd(), "public", "uploads", "cache");
    const cacheKey = `${first}_${filename ? filename.replace(/[^a-zA-Z0-9_-]/g, "_") : "img"}.webp`;
    const cachedFilePath = join(cacheDir, cacheKey);

    // 2. Check if pre-optimized WebP exists in disk cache
    if (existsSync(cachedFilePath)) {
      const fileStat = await stat(cachedFilePath);
      const etag = `W/"${fileStat.size}-${fileStat.mtimeMs}"`;
      if (req.headers.get("if-none-match") === etag) {
        return new NextResponse(null, { status: 304 });
      }

      const buffer = await readFile(cachedFilePath);
      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Content-Length": String(buffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
          "ETag": etag,
        },
      });
    }

    // 3. Find original file on disk
    let rawBuffer: Buffer | null = null;
    let mimeType = meta?.mime_type || "image/jpeg";

    if (filename) {
      rawBuffer = await loadLocalImageBuffer(filename, folder);
    }

    // 4. Fallback: fetch from PostgreSQL BYTEA if not on disk
    if (!rawBuffer) {
      const row = isNumericId
        ? await queryOne<{ data: Buffer; mime_type?: string; filename?: string; folder?: string }>(
            "SELECT data, mime_type, filename, folder FROM images WHERE id = $1",
            [parseInt(first, 10)]
          )
        : await queryOne<{ data: Buffer; mime_type?: string; filename?: string; folder?: string }>(
            "SELECT data, mime_type, filename, folder FROM images WHERE filename = $1",
            [filename]
          );

      if (row && row.data) {
        rawBuffer = Buffer.isBuffer(row.data) ? row.data : Buffer.from(row.data);
        mimeType = row.mime_type || mimeType;

        // Persist original to local disk for future fast access
        if (row.filename && rawBuffer) {
          try {
            const destDir = join(process.cwd(), "public", "uploads", row.folder || "blogs");
            await mkdir(destDir, { recursive: true });
            await writeFile(join(destDir, row.filename), new Uint8Array(rawBuffer));
          } catch {}
        }
      }
    }

    if (!rawBuffer) {
      return new NextResponse("Image Not Found", { status: 404 });
    }

    // 5. Optimize via sharp: convert large images / PNGs to lightweight WebP
    try {
      await mkdir(cacheDir, { recursive: true });
      const optimizedBuffer = await sharp(rawBuffer)
        .resize({ width: 1000, withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      await writeFile(cachedFilePath, new Uint8Array(optimizedBuffer));

      return new NextResponse(new Uint8Array(optimizedBuffer), {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Content-Length": String(optimizedBuffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // If sharp fails for any reason, serve original
      return new NextResponse(new Uint8Array(rawBuffer), {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Length": String(rawBuffer.length),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch (err: any) {
    console.error("[GET /api/images] Error:", err);
    return new NextResponse("Error fetching image", { status: 500 });
  }
}
