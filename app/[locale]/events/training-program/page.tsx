import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getEvent } from "@/lib/content";
import { getEventOverlay } from "@/lib/cms/events";
import { Breadcrumb } from "@/components/breadcrumb";
import { ExternalLink } from "@/components/external-link";
import { Calendar, MapPin, Clock } from "lucide-react";

interface Props { params: Promise<{ locale: string }> }
export const revalidate = 60; // ISR: re-fetch at most once per minute
const SLUG = "training-program";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const ev = getEvent(SLUG, locale);
  return { title: ev.title, description: ev.tagline };
}

export default async function EventPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  let ev;
  try { ev = getEvent(SLUG, locale); } catch { notFound(); }

  const overlay = await getEventOverlay(SLUG).catch(() => null);
  if (overlay?.title) ev = { ...ev, title: overlay.title };
  if (overlay?.tagline) ev = { ...ev, tagline: overlay.tagline };
  if (overlay?.description) ev = { ...ev, description: overlay.description };
  if (overlay?.status) ev = { ...ev, status: overlay.status };
  if (overlay?.applyUrl) ev = { ...ev, applyUrl: overlay.applyUrl };

  const contact = overlay?.contact
    ? { email: overlay.contact }
    : typeof ev.contact === "string" ? { email: ev.contact } : ev.contact;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Events", href: "/events" }, { label: ev.shortTitle }]} />
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-800)]">{ev.category}</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ev.status === "Active" || ev.status === "Recurring" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{ev.status}</span>
        </div>
        <h1 className="text-3xl font-black text-[var(--color-brand-800)] mb-3 leading-tight">{ev.title}</h1>
        <p className="text-[var(--color-text-subtle)] max-w-2xl">{ev.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
          {ev.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" aria-hidden="true"/>{ev.duration}</span>}
          {ev.venue && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" aria-hidden="true"/>{ev.venue}</span>}
          {ev.schedule && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" aria-hidden="true"/>{ev.schedule}</span>}
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section aria-labelledby="about-ev">
            <h2 id="about-ev" className="text-xl font-bold text-[var(--color-text)] mb-3">About</h2>
            <p className="text-[var(--color-text-subtle)] leading-relaxed whitespace-pre-line">{ev.description}</p>
          </section>
          {ev.topics && ev.topics.length > 0 && (
            <section aria-labelledby="topics-ev">
              <h2 id="topics-ev" className="text-xl font-bold text-[var(--color-text)] mb-3">Topics Covered</h2>
              <ul className="space-y-2">
                {ev.topics.map(t => <li key={t} className="flex gap-2 text-sm text-[var(--color-text-subtle)]"><span className="text-[var(--color-brand-600)]">·</span>{t}</li>)}
              </ul>
            </section>
          )}
          {ev.highlights && ev.highlights.length > 0 && (
            <section aria-labelledby="highlights-ev">
              <h2 id="highlights-ev" className="text-xl font-bold text-[var(--color-text)] mb-3">Highlights</h2>
              <ul className="space-y-2">
                {ev.highlights.map(h => <li key={h} className="flex gap-2 text-sm text-[var(--color-text-subtle)]"><span className="text-[var(--color-brand-600)]">✓</span>{h}</li>)}
              </ul>
            </section>
          )}
          {ev.fees && ev.fees.length > 0 && (
            <section aria-labelledby="fees-ev">
              <h2 id="fees-ev" className="text-xl font-bold text-[var(--color-text)] mb-3">Registration Fees</h2>
              <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                <table className="w-full text-sm">
                  <caption className="sr-only">Registration fees for {ev.title}</caption>
                  <thead><tr className="bg-[var(--color-surface-alt)]"><th scope="col" className="px-4 py-3 text-left font-semibold text-[var(--color-text)]">Category</th><th scope="col" className="px-4 py-3 text-left font-semibold text-[var(--color-text)]">Fee</th></tr></thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {ev.fees.map(f => <tr key={f.category} className="bg-[var(--color-surface)]"><td className="px-4 py-3 text-[var(--color-text-subtle)]">{f.category}</td><td className="px-4 py-3 font-bold text-[var(--color-brand-800)]">{f.amount}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {ev.prizes && ev.prizes.length > 0 && (
            <section aria-labelledby="prizes-ev">
              <h2 id="prizes-ev" className="text-xl font-bold text-[var(--color-text)] mb-3">Prizes</h2>
              <ul className="space-y-2">
                {ev.prizes.map(p => <li key={p.position} className="flex gap-3 text-sm"><span className="font-bold text-[var(--color-brand-800)] w-8">{p.position}</span><span className="text-[var(--color-text-subtle)]">{p.prize}</span></li>)}
              </ul>
              {ev.specialAward && <p className="text-sm text-[var(--color-text-subtle)] mt-2 italic">Special: {ev.specialAward}</p>}
            </section>
          )}
          {ev.speakers && ev.speakers.length > 0 && (
            <section aria-labelledby="speakers-ev">
              <h2 id="speakers-ev" className="text-xl font-bold text-[var(--color-text)] mb-3">Speakers</h2>
              <ul className="space-y-2">
                {ev.speakers.map(s => <li key={s.name} className="text-sm text-[var(--color-text-subtle)]"><span className="font-medium text-[var(--color-text)]">{s.name}</span> — {s.affiliation}</li>)}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          {ev.applyUrl && (
            <div className="rounded-xl text-white p-6" style={{ backgroundColor: "#3a5214" }}>
              <h2 className="font-bold mb-3">Register Now</h2>
              <ExternalLink href={ev.applyUrl} className="inline-flex w-full justify-center px-4 py-2.5 rounded-[var(--radius-md)] bg-white text-[var(--color-brand-800)] font-semibold text-sm hover:bg-[var(--color-brand-100)] transition-colors">Apply / Register</ExternalLink>
            </div>
          )}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
            <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">Details</h2>
            <dl className="space-y-2 text-sm">
              <dt className="font-medium text-[var(--color-text)]">Organiser</dt>
              <dd className="text-[var(--color-text-subtle)] -mt-1">{ev.organiser}</dd>
              {contact?.email && <><dt className="font-medium text-[var(--color-text)]">Email</dt><dd className="-mt-1"><a href={`mailto:${contact.email}`} className="text-[var(--color-primary)] hover:underline text-xs">{contact.email}</a></dd></>}
              {contact?.phone && <><dt className="font-medium text-[var(--color-text)]">Phone</dt><dd className="text-[var(--color-text-subtle)] -mt-1 text-xs">{contact.phone}</dd></>}
              {ev.mode && <><dt className="font-medium text-[var(--color-text)]">Mode</dt><dd className="text-[var(--color-text-subtle)] -mt-1">{ev.mode}</dd></>}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
