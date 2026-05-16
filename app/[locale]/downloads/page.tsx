import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAllDownloads } from "@/lib/content";
import { getPublishedDownloads } from "@/lib/cms/downloads";
import { DownloadRow } from "@/components/download-row";
import { Breadcrumb } from "@/components/breadcrumb";
import type { Download } from "@/lib/content-types";

export const revalidate = 60; // ISR: re-fetch at most once per minute

interface Props { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: "Downloads",
  description: "All documents, forms, certificates, and PDFs available for download from IC IITP.",
};

export default async function DownloadsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // CMS downloads from Firestore
  let cmsDownloads: Download[] = [];
  try {
    const raw = await getPublishedDownloads();
    cmsDownloads = raw.map((d) => ({
      title: d.title,
      path: d.fileUrl,
      format: d.fileType,
      purpose: d.purpose,
      category: d.category,
      lastUpdated: "",
    }));
  } catch {}

  // Static fallback downloads (only shown if CMS is empty)
  const staticDownloads = getAllDownloads();
  const allDownloads = cmsDownloads.length > 0
    ? [...cmsDownloads, ...staticDownloads]
    : staticDownloads;

  const byCategory = allDownloads.reduce<Record<string, Download[]>>((acc, d) => {
    (acc[d.category] ??= []).push(d);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Downloads" }]} />

      <header className="mb-10">
        <h1 className="text-4xl font-black text-[--color-brand-800] mb-4">Downloads</h1>
        <p className="text-lg text-[--color-text-subtle] max-w-xl">
          All application forms, certificates, and documents available from IC IITP in one place.
          Each file includes its format and purpose.
        </p>
      </header>

      <div className="space-y-10">
        {Object.entries(byCategory).map(([category, items]) => (
          <section key={category} aria-labelledby={`cat-${category}`}>
            <h2
              id={`cat-${category}`}
              className="text-sm font-semibold text-[--color-muted] uppercase tracking-wider mb-4"
            >
              {category}
            </h2>
            <div className="space-y-3">
              {items.map((d) => (
                <DownloadRow key={d.title} download={d} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
