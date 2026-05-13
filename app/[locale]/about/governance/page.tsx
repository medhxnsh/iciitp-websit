import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getGovernance } from "@/lib/content";
import { TeamRoster } from "@/components/team-roster";
import { Breadcrumb } from "@/components/breadcrumb";

interface Props { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: "Governing Society",
  description: "The 17-member Governing Society of IC IITP, including the Director IIT Patna, Government of India and Bihar nominees, and independent industry representatives.",
};

export default async function GovernancePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const members = getGovernance(locale);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Governing Society" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-black text-[--color-brand-800] mb-3">
          Governing Society
        </h1>
        <p className="text-[--color-text-subtle] max-w-2xl">
          The Governing Society of IC IITP comprises {members.length} members drawn from IIT Patna
          leadership, Government of India (MeitY), Government of Bihar, and independent industry and
          investment experts.
        </p>
        <div className="mt-3">
        </div>
      </header>

      <TeamRoster
        members={members}
        caption="IC IITP Governing Society members"
      />
    </div>
  );
}
