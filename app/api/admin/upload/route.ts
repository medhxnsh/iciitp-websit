/**
 * Admin file upload endpoint.
 * Streams a single uploaded file to Firebase Storage and returns the public URL.
 *
 * Hardening:
 * - Requires authenticated session.
 * - Validates and sanitizes `path` to prevent traversal / bucket-root writes.
 * - Enforces max size (10 MB) and a mime/extension allowlist.
 * - Server-side errors are logged but never returned to the client verbatim.
 */
import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { getApp, getStorageBucket } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME = new Set([
  "image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
]);

const ALLOWED_EXT = /\.(png|jpe?g|webp|gif|svg|pdf|docx?|xlsx?|pptx?|zip)$/i;

/**
 * Validates the storage path:
 * - rejects empty / absolute paths
 * - rejects `..` segments (traversal)
 * - rejects backslashes
 * - normalizes leading slashes
 */
function sanitizePath(raw: string): string | null {
  if (!raw) return null;
  const path = raw.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!path) return null;
  if (path.split("/").some((seg) => seg === ".." || seg === "")) return null;
  if (path.length > 512) return null;
  return path;
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const rawPath = formData.get("path");

  if (!(file instanceof File) || typeof rawPath !== "string") {
    return NextResponse.json({ error: "file and path are required" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Empty file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: `File exceeds ${MAX_BYTES / 1024 / 1024} MB limit` }, { status: 413 });
  }
  if (!ALLOWED_MIME.has(file.type) && !ALLOWED_EXT.test(file.name)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 415 });
  }
  const path = sanitizePath(rawPath);
  if (!path) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  getApp(); // initialize Firebase if not already
  const bucketName = getStorageBucket();

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = getStorage().bucket(bucketName);
    const fileRef = bucket.file(path);

    await fileRef.save(buffer, { metadata: { contentType: file.type } });

    try {
      await fileRef.makePublic();
    } catch {
      // makePublic fails when uniform bucket-level access is enabled — fall back to signed URL
      const [signedUrl] = await fileRef.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });
      return NextResponse.json({ url: signedUrl });
    }

    return NextResponse.json({
      url: `https://storage.googleapis.com/${bucketName}/${path}`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[upload] Firebase Storage error:", msg, "bucket:", bucketName);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
