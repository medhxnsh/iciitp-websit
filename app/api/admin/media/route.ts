import { NextRequest, NextResponse } from "next/server";
import { getStorage } from "firebase-admin/storage";
import { getApp, getStorageBucket } from "@/lib/firebase-admin";
import { getDb } from "@/lib/firebase-admin";
import { getSession } from "@/lib/auth";
import { readdirSync, statSync } from "fs";
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
  usedIn: string[];
}

async function buildUsageMap(): Promise<Map<string, string[]>> {
  const db = getDb();
  const map = new Map<string, string[]>();

  function tag(url: string, label: string) {
    if (!url) return;
    const list = map.get(url) ?? [];
    list.push(label);
    map.set(url, list);
  }

  const [evSnap, notifSnap, dlSnap, secSnap, progSnap] = await Promise.all([
    db.collection("cms-events").get(),
    db.collection("cms-notifications").get(),
    db.collection("cms-downloads").get(),
    db.collection("cms-page-sections").get(),
    db.collection("cms-programs").get(),
  ]);

  evSnap.docs.forEach((d) => {
    const data = d.data();
    tag(data.coverImageUrl, `Event: ${data.title ?? d.id}`);
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
      if (data[k]) tag(data[k], `Page: ${d.id}`);
    });
  });
  progSnap.docs.forEach((d) => {
    const data = d.data();
    if (Array.isArray(data.images)) {
      data.images.forEach((img: { url: string }) => {
        if (img?.url) tag(img.url, `Program: ${data.slug ?? d.id}`);
      });
    }
  });

  return map;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  getApp();

  const usageMap = await buildUsageMap().catch(() => new Map<string, string[]>());

  const items: MediaItem[] = [];

  // Firebase Storage files
  try {
    const bucket = getStorage().bucket(getStorageBucket());
    const [files] = await bucket.getFiles();
    for (const file of files) {
      const [meta] = await file.getMetadata();
      const publicUrl = `https://storage.googleapis.com/${getStorageBucket()}/${file.name}`;
      items.push({
        name: file.name.split("/").pop() ?? file.name,
        path: file.name,
        size: Number(meta.size ?? 0),
        contentType: meta.contentType ?? "application/octet-stream",
        timeCreated: meta.timeCreated ?? "",
        publicUrl,
        source: "firebase",
        usedIn: usageMap.get(publicUrl) ?? [],
      });
    }
  } catch {
    // Storage unavailable
  }

  // Static images from public/images/
  try {
    const imgDir = join(process.cwd(), "public", "images");
    function scanDir(dir: string, prefix: string) {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const rel = `${prefix}/${entry}`;
        if (statSync(full).isDirectory()) {
          scanDir(full, rel);
        } else {
          items.push({
            name: entry,
            path: rel,
            size: statSync(full).size,
            contentType: entry.endsWith(".png") ? "image/png"
              : entry.endsWith(".jpg") || entry.endsWith(".jpeg") ? "image/jpeg"
              : entry.endsWith(".svg") ? "image/svg+xml"
              : entry.endsWith(".webp") ? "image/webp"
              : "application/octet-stream",
            timeCreated: "",
            publicUrl: `/images${rel}`,
            source: "static",
            usedIn: usageMap.get(`/images${rel}`) ?? [],
          });
        }
      }
    }
    scanDir(imgDir, "");
  } catch {
    // no public/images dir
  }

  return NextResponse.json(items);
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path } = await request.json() as { path: string };
  if (!path) return NextResponse.json({ error: "path is required" }, { status: 400 });

  getApp();
  try {
    const bucket = getStorage().bucket(getStorageBucket());
    await bucket.file(path).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
