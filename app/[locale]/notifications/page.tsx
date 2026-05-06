import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAllNotifications, isNotificationActive } from "@/lib/content";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { LastUpdatedBadge } from "@/components/last-updated-badge";
import { Bell, ArrowRight } from "lucide-react";

interface Props { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: "Notifications",
  description: "Current notifications, career openings, calls for proposals, and tender notices from IC IITP.",
};

export default async function NotificationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const notifications = getAllNotifications(locale);
  const active = notifications.filter(isNotificationActive);
  const expired = notifications.filter((n) => !isNotificationActive(n));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Notifications" }]} />

      <header className="mb-10">
        <h1 className="text-4xl font-black text-[--color-brand-800] mb-4">Notifications</h1>
        <p className="text-lg text-[--color-text-subtle] max-w-xl">
          Career openings, calls for proposals, and procurement notices from IC IITP.
        </p>
        <div className="mt-4"><LastUpdatedBadge date="2025-09-01" /></div>
      </header>

      {active.length > 0 && (
        <section aria-labelledby="active-notifs" className="mb-10">
          <h2 id="active-notifs" className="text-xl font-bold text-[--color-text] mb-5">Active Notices</h2>
          <div className="space-y-3">
            {active.map((n) => <NotifCard key={n.slug} notif={n} isActive />)}
          </div>
        </section>
      )}

      <section aria-labelledby="all-notifs">
        <h2 id="all-notifs" className="text-xl font-bold text-[--color-text] mb-5">All Notices</h2>
        <div className="space-y-3">
          {notifications.map((n) => <NotifCard key={n.slug} notif={n} isActive={isNotificationActive(n)} />)}
        </div>
      </section>
    </div>
  );
}

function NotifCard({ notif, isActive }: { notif: import("@/lib/content").Notification; isActive: boolean }) {
  const hrefs: Record<string, string> = {
    careers: "/notifications/careers",
    "call-for-proposals": "/notifications/call-for-proposals",
    "niq-tender": "/notifications/niq-tender",
  };
  const href = hrefs[notif.slug] ?? `/notifications/${notif.slug}`;

  return (
    <Link
      href={href}
      className="group flex gap-4 p-5 rounded-[--radius-xl] border border-[--color-border] bg-[--color-surface] hover:border-[--color-brand-300] hover:shadow-md transition-all"
    >
      <Bell className="w-5 h-5 text-[--color-muted] shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
          <h3 className="font-semibold text-[--color-text] group-hover:text-[--color-primary] transition-colors leading-snug">
            {notif.title}
          </h3>
          {isActive && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 shrink-0">Active</span>
          )}
        </div>
        <p className="text-sm text-[--color-text-subtle]">{notif.summary}</p>
        <p className="text-xs text-[--color-muted] mt-1">
          Valid: {new Date(notif.validFrom).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          {" – "}
          {new Date(notif.validTo).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-[--color-muted] shrink-0 mt-1 group-hover:text-[--color-primary] transition-colors" aria-hidden="true" />
    </Link>
  );
}
