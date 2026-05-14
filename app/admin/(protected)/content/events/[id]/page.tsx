import { requireAuth } from "@/lib/auth";
import { getEventById } from "@/lib/cms/events";
import { Timestamp } from "firebase-admin/firestore";
import { EventForm } from "@/components/admin/event-form";
import { updateEventAction } from "../actions";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import Link from "next/link";
import type { EventFormData } from "../actions";

function serializeClosingDate(ts: unknown): string | null {
  if (!ts) return null;
  if (ts instanceof Timestamp) return ts.toDate().toISOString().slice(0, 10);
  if (typeof ts === "object" && ts !== null && "_seconds" in ts)
    return new Date((ts as { _seconds: number })._seconds * 1000).toISOString().slice(0, 10);
  return null;
}

export const metadata = { title: "Edit Event — IC IITP Admin" };
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function EditEventPage({ params }: Props) {
  await requireAuth();
  const { id } = await params;
  const raw = await getEventById(id);
  if (!raw) notFound();

  const event: EventFormData = {
    slug: raw.slug,
    title: raw.title,
    tagline: raw.tagline,
    description: raw.description,
    category: raw.category,
    status: raw.status,
    autoClose: raw.autoClose,
    closingDate: serializeClosingDate(raw.closingDate),
    coverImageUrl: raw.coverImageUrl,
    applyUrl: raw.applyUrl,
    contact: raw.contact,
    published: raw.published,
    customFields: raw.customFields,
  };

  async function save(data: EventFormData) {
    "use server";
    return updateEventAction(id, data);
  }

  return (
    <main className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/content/events"
          className="text-sm"
          style={{ color: "#7a8e6a" }}
        >
          ← Events
        </Link>
        <span style={{ color: "#d4e6c4" }}>/</span>
        <Calendar className="w-5 h-5" style={{ color: "#3a5214" }} />
        <h1 className="text-xl font-black truncate" style={{ color: "#1c2e06" }}>{raw.title}</h1>
      </div>
      <EventForm event={event} onSave={save} />
    </main>
  );
}
