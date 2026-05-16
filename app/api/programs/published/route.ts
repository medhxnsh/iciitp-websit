import { NextResponse } from "next/server";
import { getAllCmsPrograms } from "@/lib/cms/programs";
import { STATIC_PROGRAM_SLUGS } from "@/lib/static-slugs";

const STATIC_SLUGS = new Set<string>(STATIC_PROGRAM_SLUGS);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const programs = await getAllCmsPrograms();
    const cmsOnly = programs
      .filter((p) => p.published && !STATIC_SLUGS.has(p.slug))
      .map((p) => ({ slug: p.slug, title: p.title ?? p.slug }));
    return NextResponse.json(cmsOnly);
  } catch {
    return NextResponse.json([]);
  }
}
