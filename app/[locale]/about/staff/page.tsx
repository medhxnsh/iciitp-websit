import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getStaff } from "@/lib/content";
import { TeamRoster } from "@/components/team-roster";
import { Breadcrumb } from "@/components/breadcrumb";

interface Props { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: "IC IITP Staff",
  description: "The 18-member operational staff team of IC IITP managing day-to-day incubation, lab operations, administration, and programmes.",
};

export default async function StaffPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const members = getStaff(locale);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Staff" },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl font-black text-[--color-brand-800] mb-3">
          IC IITP Staff
        </h1>
        <p className="text-[--color-text-subtle] max-w-2xl">
          The {members.length}-member operational team behind IC IITP, spanning incubation
          management, laboratory operations, technical support, and administration.
        </p>
        <div className="mt-3">
        </div>
      </header>

      <TeamRoster
        members={members}
        caption="IC IITP operational staff"
        groupByRole
      />
    </div>
  );
}
