import { NextResponse } from "next/server";
import { getPublishedNotifications } from "@/lib/cms/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const all = await getPublishedNotifications();
    const items = all.map((n) => ({
      id: n.id,
      title: n.title,
      category: n.category || n.type || "",
      href: "/notifications",
    }));
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([]);
  }
}
