import { requireAuth } from "@/lib/auth";
import { getEventOverlay } from "@/lib/cms/events";
import { getEvent } from "@/lib/content";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import Link from "next/link";
import { saveEventOverlayAction } from "../../actions";
import { StaticEventOverlayForm } from "./form";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ slug: string }> }

export default async function StaticEventEditPage({ params }: Props) {
  await requireAuth();
  const { slug } = await params;

  let base;
  try { base = getEvent(slug, "en"); } catch { notFound(); }

  const overlay = await getEventOverlay(slug).catch(() => null);

  async function save(data: Parameters<typeof saveEventOverlayAction>[1]) {
    "use server";
    return saveEventOverlayAction(slug, data);
  }

  return (
    <main className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/content/events" className="text-sm" style={{ color: "#7a8e6a" }}>← Events</Link>
        <span style={{ color: "#d4e6c4" }}>/</span>
        <Calendar className="w-5 h-5" style={{ color: "#3a5214" }} />
        <h1 className="text-xl font-black truncate" style={{ color: "#1c2e06" }}>{base.title}</h1>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>Static</span>
      </div>
      <p className="text-xs mb-8" style={{ color: "#7a8e6a" }}>
        This event&apos;s base content comes from a content file. Fields you fill in here override what&apos;s shown on the public page. Leave a field blank to keep the original.
      </p>
      <StaticEventOverlayForm base={base} overlay={overlay} onSave={save} />
    </main>
  );
}
