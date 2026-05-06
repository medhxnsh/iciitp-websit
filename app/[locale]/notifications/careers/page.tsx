import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getNotification, isNotificationActive } from "@/lib/content";
import { Breadcrumb } from "@/components/breadcrumb";
import { LastUpdatedBadge } from "@/components/last-updated-badge";
import { ExternalLink } from "@/components/external-link";
import { FileDown } from "lucide-react";

interface Props { params: Promise<{ locale: string }> }
const SLUG = "careers";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const n = getNotification(SLUG, locale);
  return { title: n.title, description: n.summary };
}

export default async function NotificationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  let n;
  try { n = getNotification(SLUG, locale); } catch { notFound(); }
  const active = isNotificationActive(n);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Notifications", href: "/notifications" }, { label: "Careers" }]} />
      <header className="mb-8 pb-6 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-800)]">{n.purpose}</span>
          {active ? <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-800">Active</span>
                  : <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">Expired</span>}
        </div>
        <h1 className="text-3xl font-bold text-[var(--color-text)] mb-2">{n.title}</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Valid: {new Date(n.validFrom).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })} – {new Date(n.validTo).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
        </p>
        <div className="mt-3"><LastUpdatedBadge date={n.validFrom} /></div>
      </header>

      <div className="prose max-w-none text-[var(--color-text-subtle)] leading-relaxed mb-8 whitespace-pre-line">
        {n.body}
      </div>

      {n.downloads && n.downloads.length > 0 && (
        <section aria-labelledby="downloads-notif" className="mb-8">
          <h2 id="downloads-notif" className="text-lg font-bold text-[var(--color-text)] mb-4">Downloads</h2>
          <div className="space-y-3">
            {n.downloads.map(d => (
              <a key={d.title} href={d.path} download className="flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:bg-[var(--color-brand-50)] hover:border-[var(--color-brand-300)] transition-all">
                <FileDown className="w-5 h-5 text-[var(--color-brand-600)]" aria-hidden="true" />
                <div>
                  <p className="font-medium text-sm text-[var(--color-text)]">{d.title}</p>
                  <p className="text-xs text-[var(--color-muted)]">{d.format}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {n.externalUrl && (
        <section aria-labelledby="ext-link-notif" className="mb-8">
          <h2 id="ext-link-notif" className="text-lg font-bold text-[var(--color-text)] mb-3">External Portal</h2>
          <ExternalLink href={n.externalUrl} className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: "#3a5214" }}>
            Visit Portal
          </ExternalLink>
        </section>
      )}

      {n.contactEmail && (
        <p className="text-sm text-[var(--color-text-subtle)]">
          Contact: <a href={`mailto:${n.contactEmail}`} className="text-[var(--color-primary)] hover:underline">{n.contactEmail}</a>
        </p>
      )}
    </div>
  );
}
