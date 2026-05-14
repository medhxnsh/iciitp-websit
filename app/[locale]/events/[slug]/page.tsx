import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getEventBySlug, resolveStatus } from "@/lib/cms/events";
import { Timestamp } from "firebase-admin/firestore";
import { Breadcrumb } from "@/components/breadcrumb";
import { ExternalLink } from "@/components/external-link";
import { Calendar, Mail, Link2 } from "lucide-react";
import type { CustomField, FieldType } from "@/lib/cms/events";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ locale: string; slug: string }> }

function fmtDate(v: string) {
  try {
    return new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return v;
  }
}

function fmtTs(ts: unknown): string {
  if (!ts) return "";
  if (ts instanceof Timestamp) return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  if (typeof ts === "object" && ts !== null && "_seconds" in ts) {
    return new Date((ts as { _seconds: number })._seconds * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }
  return "";
}

const STATUS_CLASS: Record<string, string> = {
  Upcoming:  "bg-blue-100 text-blue-800",
  Ongoing:   "bg-green-100 text-green-800",
  Closed:    "bg-gray-100 text-gray-600",
  Recurring: "bg-yellow-100 text-yellow-800",
};

function CustomFieldSection({ field }: { field: CustomField }) {
  const type: FieldType = field.type;
  return (
    <section aria-labelledby={`cf-${field.id}`}>
      <h2 id={`cf-${field.id}`} className="text-xl font-bold text-[var(--color-text)] mb-3">
        {field.label}
      </h2>
      {type === "text" && (
        <p className="text-[var(--color-text-subtle)]">{field.value}</p>
      )}
      {type === "textarea" && (
        <p className="text-[var(--color-text-subtle)] leading-relaxed whitespace-pre-line">{field.value}</p>
      )}
      {type === "url" && (
        <ExternalLink
          href={field.value}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg"
          style={{ backgroundColor: "#f0f7e6", color: "#3a5214" }}
        >
          <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
          {field.label}
        </ExternalLink>
      )}
      {type === "date" && (
        <p className="text-[var(--color-text-subtle)] flex items-center gap-2">
          <Calendar className="w-4 h-4" aria-hidden="true" />
          {fmtDate(field.value)}
        </p>
      )}
      {type === "image" && field.value && (
        <img
          src={field.value}
          alt={field.label}
          className="w-full max-h-96 object-contain rounded-xl"
        />
      )}
      {type === "list" && field.items.length > 0 && (
        <ul className="space-y-2">
          {field.items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--color-text-subtle)]">
              <span className="text-[var(--color-brand-600)] shrink-0">·</span>
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ev = await getEventBySlug(slug);
  if (!ev) return {};
  return { title: ev.title, description: ev.tagline };
}

export default async function CmsEventPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const ev = await getEventBySlug(slug);
  if (!ev) notFound();

  const resolved = resolveStatus(ev);
  const statusClass = STATUS_CLASS[resolved] ?? "bg-gray-100 text-gray-600";
  const sortedFields = [...ev.customFields].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: ev.title },
        ]}
      />

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-800)]">
            {ev.category}
          </span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusClass}`}>
            {resolved}
          </span>
          {!ev.published && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">
              Preview
            </span>
          )}
        </div>
        <h1 className="text-3xl font-black text-[var(--color-brand-800)] mb-3 leading-tight">
          {ev.title}
        </h1>
        {ev.tagline && (
          <p className="text-[var(--color-text-subtle)] max-w-2xl">{ev.tagline}</p>
        )}
        {ev.closingDate && (
          <p className="mt-3 text-sm text-[var(--color-muted)] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
            {resolved === "Closed" ? "Closed on" : "Closes on"} {fmtTs(ev.closingDate)}
          </p>
        )}
      </header>

      {ev.coverImageUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={ev.coverImageUrl}
            alt={ev.title}
            className="w-full max-h-80 object-cover"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {ev.description && (
            <section aria-labelledby="about-ev">
              <h2 id="about-ev" className="text-xl font-bold text-[var(--color-text)] mb-3">About</h2>
              <p className="text-[var(--color-text-subtle)] leading-relaxed whitespace-pre-line">
                {ev.description}
              </p>
            </section>
          )}
          {sortedFields.map((field) => (
            <CustomFieldSection key={field.id} field={field} />
          ))}
        </div>

        <aside className="space-y-5">
          {ev.applyUrl && resolved !== "Closed" && (
            <div className="rounded-xl text-white p-6" style={{ backgroundColor: "#3a5214" }}>
              <h2 className="font-bold mb-3">Register Now</h2>
              <ExternalLink
                href={ev.applyUrl}
                className="inline-flex w-full justify-center px-4 py-2.5 rounded-[var(--radius-md)] bg-white text-[var(--color-brand-800)] font-semibold text-sm hover:bg-[var(--color-brand-100)] transition-colors"
              >
                Apply / Register
              </ExternalLink>
            </div>
          )}

          <div
            className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
          >
            <h2 className="text-sm font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-3">
              Details
            </h2>
            <dl className="space-y-2 text-sm">
              <dt className="font-medium text-[var(--color-text)]">Organiser</dt>
              <dd className="text-[var(--color-text-subtle)] -mt-1">IC IITP</dd>
              <dt className="font-medium text-[var(--color-text)]">Category</dt>
              <dd className="text-[var(--color-text-subtle)] -mt-1">{ev.category}</dd>
              {ev.contact && (
                <>
                  <dt className="font-medium text-[var(--color-text)]">Contact</dt>
                  <dd className="-mt-1">
                    {ev.contact.includes("@") ? (
                      <a
                        href={`mailto:${ev.contact}`}
                        className="text-[var(--color-primary)] hover:underline text-xs flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" aria-hidden="true" />
                        {ev.contact}
                      </a>
                    ) : (
                      <span className="text-[var(--color-text-subtle)] text-xs">{ev.contact}</span>
                    )}
                  </dd>
                </>
              )}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
