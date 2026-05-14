import { NextResponse } from "next/server";
import { getPublishedEvents } from "@/lib/cms/events";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await getPublishedEvents();
    return NextResponse.json(
      events.map((e) => ({ slug: e.slug, title: e.title }))
    );
  } catch {
    return NextResponse.json([]);
  }
}
