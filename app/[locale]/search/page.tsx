import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  getAllPrograms, getAllEvents, getAllNotifications,
  getAllLabs, getAllStartups,
} from "@/lib/content";
import { SearchClient } from "./_client";

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.search" });
  return { title: t("title"), description: t("description") };
}

export interface SearchDoc {
  id: string;
  title: string;
  body: string;
  category: string;
  href: string;
}

function buildIndex(locale: string): SearchDoc[] {
  const docs: SearchDoc[] = [];

  // Programs
  for (const p of getAllPrograms(locale)) {
    docs.push({
      id: `program-${p.slug}`,
      title: p.title,
      body: [p.tagline, p.about, ...(p.objectives ?? [])].filter(Boolean).join(" "),
      category: "Program",
      href: `/programs/${p.slug}`,
    });
  }

  // Events
  for (const e of getAllEvents(locale)) {
    docs.push({
      id: `event-${e.slug}`,
      title: e.title,
      body: [e.tagline, e.description].filter(Boolean).join(" "),
      category: "Event",
      href: `/events/${e.slug}`,
    });
  }

  // Notifications
  for (const n of getAllNotifications(locale)) {
    docs.push({
      id: `notification-${n.slug}`,
      title: n.title,
      body: [n.summary, n.body].filter(Boolean).join(" "),
      category: "Notification",
      href: `/notifications/${n.slug}`,
    });
  }

  // Labs
  for (const lab of getAllLabs(locale)) {
    docs.push({
      id: `lab-${lab.slug}`,
      title: lab.title,
      body: [lab.tagline].filter(Boolean).join(" "),
      category: "Facility",
      href: `/facilities/${lab.slug}`,
    });
  }

  // Startups (sample — index by name + tagline)
  try {
    const startups = getAllStartups(locale);
    for (let i = 0; i < startups.length; i++) {
      const s = startups[i];
      docs.push({
        id: `startup-${i}`,
        title: s.name,
        body: [s.tagline, ...s.sectors].join(" "),
        category: "Startup",
        href: `/portfolio/${s.scheme}`,
      });
    }
  } catch {
    // startups index may be missing for some locales
  }

  return docs;
}

export default async function SearchPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const docs = buildIndex(locale);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <header className="mb-8">
        <h1 className="text-4xl font-black mb-2" style={{ color: "#3a5214" }}>
          Search
        </h1>
        <p className="text-base" style={{ color: "#5a6644" }}>
          Search across programs, events, facilities, notifications, and startups.
        </p>
      </header>
      <SearchClient docs={docs} />
    </div>
  );
}
