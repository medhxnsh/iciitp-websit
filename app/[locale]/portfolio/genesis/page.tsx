import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getStartupsByScheme } from "@/lib/content";
import { StartupGrid } from "@/components/startup-grid";
import { Breadcrumb } from "@/components/breadcrumb";

interface Props { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: "GENESIS Portfolio",
  description: "Startups supported by IC IITP under the GENESIS.",
};

export default async function PortfolioSchemePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const startups = getStartupsByScheme("genesis" as const, locale);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Portfolio", href: "/portfolio" }, { label: "GENESIS" }]} />
      <header className="mb-10">
        <h1 className="text-4xl font-black text-[var(--color-brand-800)] mb-4">GENESIS</h1>
        <p className="text-lg text-[var(--color-text-subtle)] max-w-2xl">
          {startups.length} startups supported under the GENESIS.
        </p>
      </header>
      <StartupGrid startups={startups} filterScheme="genesis" />
    </div>
  );
}
