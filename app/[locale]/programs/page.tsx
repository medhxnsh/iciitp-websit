import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getAllPrograms } from "@/lib/content";
import { ProgramCard } from "@/components/program-card";
import { Breadcrumb } from "@/components/breadcrumb";

interface Props { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: "Incubation Programs",
  description:
    "Six incubation schemes at IC IITP: Flagship Incubation, Nidhi Prayas, Nidhi-EIR, SISF, BioNEST, and GENESIS — supporting deep-tech startups from idea to market.",
};

export default async function ProgramsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const programs = getAllPrograms(locale);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Programs" }]} />

      <header className="mb-10">
        <h1 className="text-4xl font-black text-[--color-brand-800] mb-4">
          Incubation Programs
        </h1>
        <p className="text-lg text-[--color-text-subtle] max-w-2xl leading-relaxed">
          IC IITP runs six complementary schemes covering the full innovation journey — from
          prototyping grants to seed investment to entrepreneurship fellowships.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <ProgramCard key={program.slug} program={program} />
        ))}
      </div>
    </div>
  );
}
