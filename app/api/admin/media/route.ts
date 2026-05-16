import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { getApp, getStorageBucket, getDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { readdirSync, statSync, readFileSync, existsSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export interface MediaItem {
  name: string;
  path: string;
  size: number;
  contentType: string;
  timeCreated: string;
  publicUrl: string;
  source: "firebase" | "static";
  folder: string;
  usedIn: string[];
}

function mimeFromName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    gif: "image/gif", webp: "image/webp", svg: "image/svg+xml",
    pdf: "application/pdf",
  };
  return map[ext] ?? "application/octet-stream";
}

// Recursively scan a directory; returns list of { publicUrl, localPath, name, size, contentType, folder }
function scanPublicDir(subPath: string, folderLabel: string): Omit<MediaItem, "usedIn" | "source" | "timeCreated">[] {
  const absDir = join(process.cwd(), "public", subPath);
  if (!existsSync(absDir)) return [];
  const results: Omit<MediaItem, "usedIn" | "source" | "timeCreated">[] = [];

  function walk(dir: string, urlPrefix: string) {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full, `${urlPrefix}/${entry}`);
      } else {
        results.push({
          name: entry,
          path: `${urlPrefix}/${entry}`.replace(/^\//, ""),
          size: stat.size,
          contentType: mimeFromName(entry),
          publicUrl: `${urlPrefix}/${entry}`,
          folder: folderLabel,
        });
      }
    }
  }

  walk(absDir, `/${subPath}`);
  return results;
}

async function buildUsageMap(): Promise<Map<string, string[]>> {
  const db = getDb();
  const map = new Map<string, string[]>();

  function tag(url: string | undefined | null, label: string) {
    if (!url) return;
    const list = map.get(url) ?? [];
    list.push(label);
    map.set(url, list);
  }

  // Firestore usage
  const [evSnap, overlaySnap, notifSnap, dlSnap, secSnap, progSnap] = await Promise.all([
    db.collection("cms-events").get(),
    db.collection("cms-event-overlays").get(),
    db.collection("cms-notifications").get(),
    db.collection("cms-downloads").get(),
    db.collection("cms-page-sections").get(),
    db.collection("cms-programs").get(),
  ]);

  evSnap.docs.forEach((d) => {
    const data = d.data();
    tag(data.coverImageUrl, `Event: ${data.title ?? d.id}`);
    (data.images ?? []).forEach((img: { url: string }) => tag(img?.url, `Event: ${data.title ?? d.id}`));
  });
  overlaySnap.docs.forEach((d) => {
    const data = d.data();
    tag(data.coverImageUrl, `Event overlay: ${d.id}`);
    (data.images ?? []).forEach((img: { url: string }) => tag(img?.url, `Event overlay: ${d.id}`));
  });
  notifSnap.docs.forEach((d) => {
    const data = d.data();
    tag(data.attachmentUrl, `Notification: ${data.title ?? d.id}`);
  });
  dlSnap.docs.forEach((d) => {
    const data = d.data();
    tag(data.fileUrl, `Download: ${data.title ?? d.id}`);
  });
  secSnap.docs.forEach((d) => {
    const data = d.data();
    ["building_image_url", "team_image_url", "team_group_image_url",
     "inauguration_image_url", "ceremony_image_url"].forEach((k) => {
      tag(data[k], `Page: ${d.id}`);
    });
  });
  progSnap.docs.forEach((d) => {
    const data = d.data();
    (data.images ?? []).forEach((img: { url: string }) => tag(img?.url, `Program: ${data.slug ?? d.id}`));
  });

  // Static JSON files usage
  function readJson(rel: string): unknown {
    try { return JSON.parse(readFileSync(join(process.cwd(), rel), "utf-8")); } catch { return null; }
  }

  const staff = readJson("content/en/team/staff.json") as Array<{ name: string; photo?: string }> | null;
  (staff ?? []).forEach((m) => tag(m.photo, `Staff: ${m.name}`));

  const startups = readJson("content/en/startups/index.json") as Array<{ name: string; logo?: string }> | null;
  (startups ?? []).forEach((s) => tag(s.logo, `Startup: ${s.name}`));

  return map;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  getApp();

  const usageMap = await buildUsageMap().catch(() => new Map<string, string[]>());
  const items: MediaItem[] = [];

  // 1 — Firebase Storage
  try {
    const bucket = getStorage().bucket(getStorageBucket());
    const [files] = await bucket.getFiles();
    for (const file of files) {
      const [meta] = await file.getMetadata();
      const publicUrl = `https://storage.googleapis.com/${getStorageBucket()}/${file.name}`;
      const folder = file.name.includes("/") ? file.name.split("/")[0] : "root";
      items.push({
        name: file.name.split("/").pop() ?? file.name,
        path: file.name,
        size: Number(meta.size ?? 0),
        contentType: meta.contentType ?? "application/octet-stream",
        timeCreated: meta.timeCreated ?? "",
        publicUrl,
        source: "firebase",
        folder,
        usedIn: usageMap.get(publicUrl) ?? [],
      });
    }
  } catch { /* Storage unavailable */ }

  // 2 — Static public directories
  const staticDirs: Array<{ sub: string; label: string }> = [
    { sub: "images", label: "images" },
    { sub: "photos/staff", label: "staff-photos" },
    { sub: "logos/startups", label: "startup-logos" },
    { sub: "logos", label: "logos" },
  ];

  for (const { sub, label } of staticDirs) {
    for (const item of scanPublicDir(sub, label)) {
      // Skip if a firebase file with same publicUrl already listed
      if (items.some((i) => i.publicUrl === item.publicUrl)) continue;
      items.push({
        ...item,
        timeCreated: "",
        source: "static",
        usedIn: usageMap.get(item.publicUrl) ?? [],
      });
    }
  }

  // Sort: firebase first, then by folder, then by name
  items.sort((a, b) => {
    if (a.source !== b.source) return a.source === "firebase" ? -1 : 1;
    if (a.folder !== b.folder) return a.folder.localeCompare(b.folder);
    return a.name.localeCompare(b.name);
  });

  return NextResponse.json(items);
}

// Object prefixes that admin is allowed to delete from. Anything outside these
// (e.g. system folders, future protected areas) is rejected.
const ALLOWED_DELETE_PREFIXES = [
  "programs/", "events/", "notifications/", "downloads/", "media/", "uploads/",
];

function isPathAllowed(raw: string): boolean {
  if (!raw || raw.length > 512) return false;
  if (raw.startsWith("/") || raw.includes("\\")) return false;
  if (raw.split("/").some((seg) => seg === ".." || seg === "")) return false;
  return ALLOWED_DELETE_PREFIXES.some((p) => raw.startsWith(p));
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { path?: string };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const path = body.path;
  if (!path || typeof path !== "string") {
    return NextResponse.json({ error: "path is required" }, { status: 400 });
  }
  if (!isPathAllowed(path)) {
    return NextResponse.json({ error: "Path not allowed" }, { status: 403 });
  }

  getApp();
  try {
    const bucket = getStorage().bucket(getStorageBucket());
    await bucket.file(path).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[media DELETE]", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
