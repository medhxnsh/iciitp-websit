import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAllStartups } from "@/lib/content";
import { StartupGrid } from "@/components/startup-grid";
import { Breadcrumb } from "@/components/breadcrumb";
import { LastUpdatedBadge } from "@/components/last-updated-badge";

interface Props { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: "Startup Portfolio",
  description: "100+ startups incubated at IC IITP across MeitY, SISF, Nidhi Prayas, Nidhi EIR, and GENESIS schemes.",
};

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const startups = getAllStartups(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Portfolio" }]} />

      <header className="mb-10">
        <h1 className="text-4xl font-black text-[--color-brand-800] mb-4">Startup Portfolio</h1>
        <p className="text-lg text-[--color-text-subtle] max-w-2xl leading-relaxed">
          {startups.length}+ startups incubated across five government-backed schemes — from ESDM
          and MedTech to AI, EV, and deep tech.
        </p>
        <div className="mt-4"><LastUpdatedBadge date="2025-09-01" /></div>
      </header>

      <StartupGrid startups={startups} showFilter />
    </div>
  );
}
