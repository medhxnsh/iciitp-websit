import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAllEvents, isEventArchived } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { Calendar, ArrowRight } from "lucide-react";

interface Props { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: "Events",
  description: "Events at IC IITP: MedTech School, EDPI, Ideathon, and Technical Training Programmes.",
};

const STATUS_STYLES: Record<string, string> = {
  "Active": "bg-green-100 text-green-800",
  "Open": "bg-green-100 text-green-800",
  "Recurring": "bg-blue-100 text-blue-800",
  "Concluded": "bg-gray-100 text-gray-600",
};

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const events = getAllEvents(locale);
  const active = events.filter((e) => !isEventArchived(e));
  const archived = events.filter((e) => isEventArchived(e));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Events" }]} />

      <header className="mb-10">
        <h1 className="text-4xl font-black text-[--color-brand-800] mb-4">Events</h1>
        <p className="text-lg text-[--color-text-subtle] max-w-2xl">
          Competitions, training programmes, and entrepreneurship courses organised by IC IITP.
        </p>
      </header>

      {active.length > 0 && (
        <section aria-labelledby="active-events-heading" className="mb-12">
          <h2 id="active-events-heading" className="text-xl font-bold text-[--color-text] mb-5">Current &amp; Upcoming</h2>
          <div className="space-y-4">
            {active.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </section>
      )}

      {archived.length > 0 && (
        <section aria-labelledby="archived-events-heading">
          <h2 id="archived-events-heading" className="text-xl font-bold text-[--color-text] mb-5">
            Past Events
            <Link href="/events/archive" className="ml-3 text-sm font-medium text-[--color-primary] hover:underline">
              View archive →
            </Link>
          </h2>
          <div className="space-y-4">
            {archived.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EventCard({ event }: { event: import("@/lib/content").Event }) {
  const statusClass = STATUS_STYLES[event.status] ?? "bg-gray-100 text-gray-600";
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group flex gap-4 p-5 rounded-[--radius-xl] border border-[--color-border] bg-[--color-surface] hover:border-[--color-brand-300] hover:shadow-md transition-all"
    >
      <div className="shrink-0 w-10 h-10 rounded-[--radius-md] bg-[--color-brand-100] text-[--color-brand-800] flex items-center justify-center">
        <Calendar className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
          <h3 className="font-bold text-[--color-text] group-hover:text-[--color-primary] transition-colors leading-snug">
            {event.title}
          </h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusClass}`}>
            {event.status}
          </span>
        </div>
        <p className="text-sm text-[--color-text-subtle] line-clamp-2 mb-2">{event.tagline}</p>
        <p className="text-xs text-[--color-muted]">
          {event.organiser} · {event.category}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-[--color-muted] shrink-0 mt-1 group-hover:text-[--color-primary] transition-colors" aria-hidden="true" />
    </Link>
  );
}
