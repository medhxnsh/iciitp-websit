import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { getApp, getStorageBucket } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

function mimeFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    gif: "image/gif", webp: "image/webp", svg: "image/svg+xml",
    pdf: "application/pdf",
  };
  return map[ext] ?? "application/octet-stream";
}

function walkDir(dir: string, acc: string[] = []): string[] {
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkDir(full, acc);
    else acc.push(full);
  }
  return acc;
}

// Upload a single local file to Firebase Storage, return public URL
async function uploadFile(localPath: string, storagePath: string): Promise<string> {
  const bucket = getStorage().bucket(getStorageBucket());
  const buffer = readFileSync(localPath);
  const fileRef = bucket.file(storagePath);
  await fileRef.save(buffer, { metadata: { contentType: mimeFromName(localPath) } });
  try {
    await fileRef.makePublic();
    return `https://storage.googleapis.com/${getStorageBucket()}/${storagePath}`;
  } catch {
    const [url] = await fileRef.getSignedUrl({ action: "read", expires: "03-01-2500" });
    return url;
  }
}

/**
 * One-shot migration: copy files under `public/<dir>/` to Firebase Storage at
 * the same relative path. Admin-only. Locked to an allowlist of safe public
 * subdirectories so a request body cannot escape into other filesystem paths.
 */
const ALLOWED_DIRS = new Set([
  "photos/staff", "photos/team",
  "logos/startups", "logos/funders",
  "pdfs", "downloads",
  "images/programs", "images/events",
]);

function isDirAllowed(dir: string): boolean {
  if (!dir || dir.includes("..") || dir.startsWith("/") || dir.includes("\\")) return false;
  return ALLOWED_DIRS.has(dir);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Migrations only run in development" }, { status: 403 });
  }

  getApp();

  let body: { dirs?: string[] };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const requested = Array.isArray(body.dirs) ? body.dirs : ["photos/staff", "logos/startups"];
  const targetDirs = requested.filter(isDirAllowed);
  if (targetDirs.length === 0) {
    return NextResponse.json({ error: "No allowed directories specified" }, { status: 400 });
  }

  const results: Array<{ local: string; storagePath: string; url: string; error?: string }> = [];

  for (const dir of targetDirs) {
    const absDir = join(process.cwd(), "public", dir);
    const files = walkDir(absDir);

    for (const localPath of files) {
      const relativePath = localPath.replace(join(process.cwd(), "public") + "/", "");
      const storagePath = relativePath; // mirror the public/ structure in Storage

      try {
        const url = await uploadFile(localPath, storagePath);
        results.push({ local: relativePath, storagePath, url });
      } catch (err) {
        results.push({ local: relativePath, storagePath, url: "", error: err instanceof Error ? err.message : String(err) });
      }
    }
  }

  const succeeded = results.filter((r) => !r.error).length;
  const failed = results.filter((r) => r.error).length;

  return NextResponse.json({ succeeded, failed, results });
}
