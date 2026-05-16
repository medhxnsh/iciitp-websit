import { requireAuth } from "@/lib/auth";
import { getProgram } from "@/lib/content";
import { getCmsProgramBySlug } from "@/lib/cms/programs";
import { ProgramForm } from "@/components/admin/program-form";
import { saveProgramAction, deleteProgramAction } from "../actions";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ slug: string }> }

export default async function EditProgramPage({ params }: Props) {
  await requireAuth();
  const { slug } = await params;

  let staticProg: ReturnType<typeof getProgram> | null = null;
  try { staticProg = getProgram(slug, "en"); } catch { /* CMS-only program */ }

  const cms = await getCmsProgramBySlug(slug);

  // Pre-fill: CMS values first, then static JSON, then empty
  const initial = {
    published: cms?.published ?? false,
    images: cms?.images ?? [],
    imageLayout: cms?.imageLayout ?? "banner" as const,
    title: cms?.title ?? staticProg?.title ?? "",
    tagline: cms?.tagline ?? staticProg?.tagline ?? "",
    about: cms?.about ?? staticProg?.about ?? "",
    status: cms?.status ?? staticProg?.status ?? "",
    statusNote: cms?.statusNote ?? staticProg?.statusNote ?? "",
    applyUrl: cms?.applyUrl ?? staticProg?.applyUrl ?? "",
    applicationFormUrl: cms?.applicationFormUrl ?? staticProg?.applicationForm ?? "",
    contactEmail: cms?.contactEmail ?? staticProg?.contactEmail ?? "",
    grant: cms?.grant ?? staticProg?.grant ?? "",
    schemeOutlay: cms?.schemeOutlay ?? staticProg?.schemeOutlay ?? "",
    stipend: cms?.stipend ?? staticProg?.stipend ?? "",
    duration: cms?.duration ?? staticProg?.duration ?? "",
    eligibility: cms?.eligibility ?? staticProg?.eligibility ?? [],
    notEligible: cms?.notEligible ?? staticProg?.notEligible ?? [],
    objectives: cms?.objectives ?? staticProg?.objectives ?? [],
    targetAudience: cms?.targetAudience ?? staticProg?.targetAudience ?? [],
    expectedOutcomes: cms?.expectedOutcomes ?? staticProg?.expectedOutcomes ?? [],
    support: cms?.support ?? staticProg?.support ?? [],
    preferences: cms?.preferences ?? staticProg?.preferences ?? [],
    notes: cms?.notes ?? staticProg?.notes ?? [],
    disclaimer: cms?.disclaimer ?? staticProg?.disclaimer ?? [],
  };

  const displayName = cms?.title ?? staticProg?.title ?? slug;

  return (
    <main className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/admin/content/programs" className="text-sm" style={{ color: "#7a8e6a" }}>
          ← Programs
        </Link>
        <span style={{ color: "#d4e6c4" }}>/</span>
        <BookOpen className="w-5 h-5" style={{ color: "#3a5214" }} />
        <h1 className="text-xl font-black" style={{ color: "#1c2e06" }}>{displayName}</h1>
        {cms && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-2" style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}>
            Customised
          </span>
        )}
        {!staticProg && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-2" style={{ backgroundColor: "#fff7ed", color: "#c2410c" }}>
            CMS only
          </span>
        )}
      </div>
      <p className="text-xs mb-8" style={{ color: "#aab89e" }}>
        {staticProg
          ? "Fields you leave blank revert to the default content. Saving always stores the current values."
          : "This is a CMS-only programme. All content is managed here."}
      </p>
      <ProgramForm
        slug={slug}
        initial={initial}
        isStaticBacked={!!staticProg}
        onSave={saveProgramAction}
        onDelete={cms ? deleteProgramAction : undefined}
      />
    </main>
  );
}
