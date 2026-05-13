import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getEvaluationTeam } from "@/lib/content";
import { TeamRoster } from "@/components/team-roster";
import { Breadcrumb } from "@/components/breadcrumb";

interface Props { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: "Project Evaluation Team",
  description: "The 14-member Project Evaluation Team of IC IITP, comprising experts from IIT Patna, IIT Bombay, IIT Madras, King's College London, and the investment community.",
};

export default async function EvaluationTeamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const members = getEvaluationTeam(locale);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Project Evaluation Team" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-black text-[--color-brand-800] mb-3">
          Project Evaluation Team
        </h1>
        <p className="text-[--color-text-subtle] max-w-2xl">
          The Project Evaluation Team comprises {members.length} domain experts from leading Indian
          institutions, international universities, and the investment community who evaluate and
          guide incubated startups.
        </p>
        <div className="mt-3">
        </div>
      </header>

      <TeamRoster
        members={members}
        caption="IC IITP Project Evaluation Team members"
      />
    </div>
  );
}
